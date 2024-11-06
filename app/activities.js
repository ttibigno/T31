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
    let activities = await Activity.find({});
    activities = activities.map( (activity) => {
        return {
            self: '/api/v1/activities/' + activity.id,
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

router.get('/:id', async (req, res) => {
    let activities = await Activity.find({})
    res.end();
});

// returning the Router() module to app.js
module.exports = router;