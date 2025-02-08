const Activity = require('./model/activity')
const User = require('./model/user')
const express = require('express');
var mongoose = require('mongoose');
// https://expressjs.com/en/5x/api.html#router
const router = express.Router();
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

// returning the Router() module to app.js
module.exports = router;