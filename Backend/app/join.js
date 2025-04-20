const express = require('express');
const router = express.Router();
const Activity = require('./model/activity.js');
const Participation = require('./model/participation.js');
const {authenticateToken} = require('./security/verification');
const {isIDValid, userJoined, checkTime} = require('./security/checks');

//partecipa a un'attività
router.put('/:id', authenticateToken, async (req, res) => {
    if (await isIDValid(req.params.id)){
        if(await userJoined(req.user.id, req.params.id)) {
            res.status(404);
            res.end();
        }
        else if(await checkTime(req.params.id)){
            activity = await Activity.findByIdAndUpdate(
                req.params.id,
                { $set : {ended : true}},
                {new: true, runValidators: false } 
            )
            res.status(404).json({ error: 'Attività terminata' });
        }
        else {
        var userId = req.user.id;
        var activityId = req.params.id;
        try{
            //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
            var activity = await Activity.findByIdAndUpdate(
                req.params.id,
                { $inc: { remainingSlots: -1 } },
                {new: true, runValidators: false } 
            )
            if (activity != null) {
            var newPartecipation = new Participation({
                activityId: activityId,
                userId: userId,
              });
              await newPartecipation.save().catch(err => {console.log(err)}); 
            }
            else{
                //console.log(`${activity} is null. id provided: ${activityId}`);
                res.status(404).end();
            }
            if (activity != undefined && activity != null)
            res.status(200).json({ message: 'ok'});
            else res.status(400)
            
        } catch(err){
            res.status(500);
            throw(err);
        }
}}
    else {
        res.status(400);
        res.end();
    }
})

//restituisce allo user le attività a cui partecipa
router.get('', authenticateToken, async( req, res) =>{
    try {
        const userId = req.user.id;
        let activities = await Participation.find({ userId: userId });
        activities = await Promise.all(activities.map(async (activity) => {
            let act = await Activity.findById(activity.activityId);
            return {
                id: act._id,
                name: act.name,
                topic: act.topic,
                place: act.place,
                date: act.date,
                creator: act.creator,
                maxSlot: act.maxSlot,
                remainingSlots: act.remainingSlots,
                warnings: act.warnings,
                ended: act.ended,
            }
        }));
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Errore interno del server' });
    }
})

module.exports = router;