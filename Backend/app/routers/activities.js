const Activity = require('../model/activity')
const User = require('../model/user')
const express = require('express');
var mongoose = require('mongoose');
// https://expressjs.com/en/5x/api.html#router
const router = express.Router();
router.use((req, res, next) => {
    console.log(`routing to /activities${req.url}`)
    next()
})

// update attività
function updateActivities(){
    Activity.find({ended: false}).then( (activities) => {
        activities.forEach(async (activity) => {
            if(activity.date.getTime() < currentTime.getTime()){
                activity.ended = true;
                console.log(`Attività ${activity.name} terminata\n`);
                await activity.save();
            }
        })
    })
}

// refresh time
let currentTime = new Date();
console.log(`Tempo attuale: ${currentTime}\n`);
updateActivities();
setInterval(() => {currentTime = new Date(), console.log(`Tempo attuale: ${currentTime}\n`), updateActivities()}, 600000);

// GET every Activity from the Database
router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let activities = await Activity.find({ended : false}).lean()
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
            warnings: activity.warnings,
            ended: activity.ended,
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
        ended : false,
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
    }).lean()

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
            warnings: activity.warnings,
            ended: activity.ended
        }})
    res.status(200).json(activities);
    res.end();
});

// returning the Router() module to app.js
module.exports = router;