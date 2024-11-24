const Activity = require('./model/activity')
const express = require('express');
var mongoose = require('mongoose');
// https://expressjs.com/en/5x/api.html#router
const router = express.Router();
const { authenticateToken }= require('./auth');
const {verifyAdmin } = require('./auth');
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
            warnings: activity.warnings
        }
    })
    res.status(200).json(activities);
})

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
            warnings: activity.warnings
        }})
    res.status(200).json(activities);
    res.end();
});


router.post('',authenticateToken , async (req, res) => {
    const creator=req.user.username;
    try {
        const newActivity = new Activity({
            name: req.body.name,
            topic: req.body.topic,
            place: req.body.place,
            date: req.body.date,
            creator: creator,  //il creatore è per forza quello che fa la richiesta
            maxSlot: req.body.maxSlot,
            remainingSlots: req.body.remainingSlots,
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

router.delete('/:id', authenticateToken, verifyAdmin, async (req, res) =>{
    const activityId= req.params.id;
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
// returning the Router() module to app.js
module.exports = router;