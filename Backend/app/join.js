const express = require('express');
const router = express.Router();
const Activity = require('./model/activity');
const User = require('./model/user');
const {authenticateToken} = require('./security/verification');
const {isIDValid, userJoined, checkTime} = require('./security/checks');

//partecipa a un'attività
router.put('/:id', authenticateToken, async (req, res) => {
    if (await isIDValid(req.params.id)){
        if(await userJoined(req.user.id, req.params.id)) {
            res.status(401);
            res.end();
        }
        if(await checkTime(req.params.id)){
            activity = await Activity.findByIdAndUpdate(
                req.params.id,
                { $set : {ended : true}},
                {new: true, runValidators: false } 
            )
            res.status(403).json({ error: 'Attività terminata' });
        }
        else {
        const userId = req.user.id;
        try{

            //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
            activity = await Activity.findByIdAndUpdate(
                req.params.id,
                { $push : {joinedUserIds : userId}},
                {new: true, runValidators: false } 
            )
            await User.findByIdAndUpdate(
                req.user.id,
                { $push : {regActivities : req.params.id}},
                {new: true, runValidators: false } 
            )

            if (activity != undefined)
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
        const activities = await Activity.find({ joinedUserIds: userId });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Errore interno del server' });
    }
} )

module.exports = router;