var mongoose = require('mongoose');
require('dotenv').config();
var Activity = require('../app/model/activity');
var User = require('../app/model/user');
var args = process.argv.slice(2);

var database = new String();
var databaseType = new String();

if (args == "cloud") {
        database = process.env.cloudDatabase
        databaseType = "MongoDB Atlas Cluster"
}
else {
    database = process.env.database
     databaseType = "MongoDB";
}

mongoose.connect(database, {
    serverSelectionTimeoutMS: 5000
  })
.catch( error => {throw(error)}
)
.then( async () => {
    console.log("Connected to " + databaseType);

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
