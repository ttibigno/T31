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


router.post('', async (req, res) => {
    try {
        const newActivity = new Activity({
            name: req.body.name,
            topic: req.body.topic,
            place: req.body.place,
            date: req.body.date,
            creator: req.body.creator,
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
        res.status(500).json({ message: 'Errore durante la creazione dell\'attività' });
    }
});
// returning the Router() module to app.js
module.exports = router;