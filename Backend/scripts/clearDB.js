var mongoose = require('mongoose');
require('dotenv').config();
var Activity = require('../app/model/activity');
var User = require('../app/model/user');


mongoose.connect(process.env.database, {
    serverSelectionTimeoutMS: 5000
  })
.catch( error => {throw(error)}
)
.then( async () => {
    console.log("Connected to MongoDB");

    console.log("Clearing activities..")
    await Activity.deleteMany()
    .exec()
    .catch( error => {throw(error)})
    .then( () => {
        console.log("Done.");
    })
    console.log("Clearing users..")
    await User.deleteMany()
    .exec()
    .catch( error => {throw(error)})
    .then( () => {
        console.log("Done.");
    })
    process.exit(0);
})
