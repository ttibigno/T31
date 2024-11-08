const Activity = require('./model/activity')
const express = require('express');
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
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts,
        }
    })
    res.status(200).json(activities);
})

// GET a list of Activities by ID, Name, Topic, Place and Creator
router.get('/:query', async (req, res) => {

    let activitiesByID = await Activity.where('id').equals(`${req.params.query}`)
    activitiesByID = activitiesByID.map((activity) => {
        return {
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts
        }
    })

    // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
    // https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-options
    let activitiesByName = await Activity.find({ "name" : { $regex: '.*' + req.params.query + '.*', $options: "i" }}).lean()
    activitiesByName = activitiesByName.map((activity) => {
        return {
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts
        }})

    // https://www.mongodb.com/docs/manual/tutorial/query-arrays/#match-an-array
    let activitiesByTopic = await Activity.find({ topic : {$all: [req.params.query]} }).lean();
    activitiesByTopic = activitiesByTopic.map((activity) => {
        return {
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts
        }})

    let activitiesByPlace = await Activity.find({ place : { $regex: '.*' + req.params.query + '.*', $options: "i" }}).lean()
    activitiesByPlace = activitiesByPlace.map((activity) => {
        return {
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts
        }})
    
    let activitiesByCreator = await Activity.find({ creator : { $regex: '.*' + req.params.query + '.*' }}).lean()
    activitiesByCreator = activitiesByCreator.map((activity) => {
        return {
            id: activity.id,
            name: activity.name,
            topic: activity.topic,
            place: activity.place,
            date: activity.date,
            creator: activity.creator,
            maxSlot: activity.maxSlot,
            remainingSlots: activity.remainingSlots,
            contacts: activity.contacts
        }})
    

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
    // filtering duplicates
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    let arr = (activitiesByID.concat(activitiesByName, activitiesByTopic, activitiesByPlace, activitiesByCreator))
    .filter((obj, index, self) =>
        index === self.findIndex((t) => (
            t.id === obj.id
        ))
    );

    res.status(200).json(arr);
    res.end();
});

// returning the Router() module to app.js
module.exports = router;