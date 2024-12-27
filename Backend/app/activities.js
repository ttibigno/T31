const Activity = require('./model/activity')
const User = require('./model/user')
const express = require('express');
var mongoose = require('mongoose');
// https://expressjs.com/en/5x/api.html#router
const router = express.Router();
const { authenticateToken }= require('./security/verification');
const {verifyAdmin } = require('./security/verification');
const userJoined = require('./security/checks');
router.use((req, res, next) => {
    console.log(`routing to /activities${req.url}`)
    next()
})

// GET every Activity from the Database
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let activities = await Activity.find({}).lean()
    activities = activities.map( (activity) => {
        return {
            id: activity._id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts,
            warnings: activity.warnings,
            joinedUserIds: activity.joinedUserIds,
            ended: activity.ended,
            reportUserIds: activity.reportUserIds //RIMUOVI DOPO
        }
    })
    res.status(200).json(activities);
})


//Restituisce all'admin le attività con più segnalazioni
//https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573
//https://mongoosejs.com/docs/tutorials/lean.html
router.get('/monitor/',authenticateToken, verifyAdmin, async(req,res) => {
    try{
        let reportedActivities= await Activity.find({ warnings: { $gte: 1 }})
        .sort({warnings:-1});

        if(reportedActivities.length === 0) {
            return res.status(205).json({message: 'Nessuna attività con seganalazioni'});
        }
        res.status(200).json(reportedActivities);
    } catch (error){
        res.status(500).json({message: 'Errore nel monitoraggio delle segnalazioni', error});
    }
});

//restituisce le attività create dall'utente
router.get('/my', authenticateToken, async( req, res) => {
    const creator = req.user.username;
    try{
    let activities = await Activity.find({creator : creator}).sort({date: -1}).lean();
    if(activities.length === 0){
        return res.status(205).json({message: 'Ancora nessuna attività creata'});
    }
    res.status(200).json(activities);
} catch(error){
    res.status(500).json({message: 'Errore nella restituzione delle attività create'});
}
});

// GET a list of Activities by ID, Name, Topic, Place and Creator
router.get('/:query', async (req, res) => {

    try{
        var id = new mongoose.Types.ObjectId(req.params.query)
    }
    catch{}
    let activities = await Activity.find({
        $or: [
            { _id : id},
            // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
            // https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-options
            { name : { $regex: '.*' + req.params.query + '.*', $options: "i" }},
            // https://www.mongodb.com/docs/manual/tutorial/query-arrays/#match-an-array
            { topic : {$all: [req.params.query]} },
            { place : { $regex: '.*' + req.params.query + '.*', $options: "i" }},
            { creator : { $regex: '.*' + req.params.query + '.*' }}
        ]  
    })

    activities = activities.map((activity) => {
        return {
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts,
            warnings: activity.warnings,
            joinedUserIds: activity.joinedUserIds,
            ended: activity.ended
        }})
    res.status(200).json(activities);
    res.end();
});

//Crea le proprie attività
router.post('', authenticateToken , async (req, res) => {
    const creator = req.user.username;
    try {
        const newActivity = new Activity({
            name: req.body.name,
            topic: req.body.topic,
            place: req.body.place,
            date: req.body.date,
            creator: creator,  //il creatore è per forza quello che fa la richiesta
            maxSlot: req.body.maxSlot,
            remainingSlots: req.body.maxSlot, //gli slot rimanenti sono i maxSlot
            contacts: req.body.contacts
        });
        const savedActivity = await newActivity.save();  //questo per aspettare che i dati si salvino sul database

        res.status(201).json({
            self: '/api/v1/activities/' + savedActivity.id,
            name: savedActivity.name,
            topic: savedActivity.topic,
            place: savedActivity.place,
            date: savedActivity.date,
            creator: savedActivity.creator,
            maxSlot: savedActivity.maxSlot,
            remainingSlots: savedActivity.remainingSlots,
            contacts: savedActivity.contacts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la creazione' });
    }
});

// segnala un'attività
router.put('/report/:id', authenticateToken, async( req, res) => {
    const userId = req.user.id;
    const activityId = req.params.id;
     try{
        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            { $inc: { warnings: 1 } },
            {new : true}
        );
        await Activity.findByIdAndUpdate(
            activityId,
            { $push : {reportUserIds : userId}},
            {new: true, runValidators: false } 
        )

        if(!updatedActivity){
            return res.status(404).json({message: 'Attività non trovata'});
        }
        res.status(200).json({
            message: 'Segnalazione aggiunta con successo',
            warnings: updatedActivity.reportCount
        });
    }  catch(error) {
        res.status(500).json({message :'Errore durante la segnalazione'});
    }

});

//partecipa a un'attività
router.put('/join/:id', authenticateToken, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        res.end();
    }
    else {
    if(await userJoined(req.user.id, req.params.id)) {
        res.status(401);
        res.end();
    }
    else {
    const userId = req.user.id;
    try{

        //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
        var activity = await Activity.findByIdAndUpdate(
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
}}})

//rimuovi un'attività (per operatore comunale)
router.delete('/:id', authenticateToken, verifyAdmin, async (req, res) =>{
    const activityId = req.params.id;
    try{
        const deletedActivity = await Activity.findByIdAndDelete(activityId);
        if (!deletedActivity) {
            return res.status(404).json({ message: 'Attività non trovata' });
        }

        res.status(200).json({ message: 'Attività eliminata con successo' });
    }  catch(error){
        res.status(500).json({message: 'Errore durante eliminazione attività'});
    }
});

//modifica una delle attività create dall'utente
router.put('/:id' , authenticateToken, async(req,res) => {
    const activityId = req.params.id;
    const updates = req.body;
    const user= req.user.username;
    try{
        //non si può modificare il nome del creatore.
        if (updates.creator) {
            delete updates.creator;
        }

        const updatedActivity= await Activity.findOneAndUpdate(
            {_id : activityId, creator:user },
            updates,
            {new :true, runValidators: true}
        );

        if(!updatedActivity){
            return res.status(404).json({error: 'Attività non trovata o modifica non autorizzata'});
        }
        res.status(200).json(updatedActivity);
    } catch(err){
        console.error(err);
        res.status(400).json({error: 'Errore durante aggiornamento'});
    }
});

// returning the Router() module to app.js
module.exports = router;