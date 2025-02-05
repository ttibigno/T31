var mongoose = require('mongoose');
require('dotenv').config();
var Activity = require('../app/model/activity');
var User = require('../app/model/user');
const salt = require('../app/security/salt');

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

    console.log("Deleting activities..")
    // https://mongoosejs.com/docs/api/model.html#Model.deleteMany()
    await Activity.deleteMany()
        .then( () => {
        var act1 = new Activity({
            name: "Ping Pong Povo",
            topic: [("Sport"), ("New")],
            place: "Povo1",
            // https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format
            date: "2024-10-09T10:30:00.000+02:00" ,
            creator: "server",
            maxSlot: 10,
            remainingSlots: 10,
            contacts: [],
            joinedUserIds: [],
            reportUserIds: []
        });
        // https://mongoosejs.com/docs/api/document.html#Document.prototype.save()
        return act1.save();
    }).then( () => {
        console.log("Created act1")
    }).then( () => {
        var act2 = new Activity({
            name: "FabLab",
            topic: [("Art")],
            place: "Povo2",
            date: "2024-09-25T09:45:00.000+02:00",
            creator: "server",
            maxSlot: 8,
            remainingSlots: 8,
            contacts: [],
            joinedUserIds: [],
            reportUserIds: []
        });
        return act2.save();
    }).then( () => {
        console.log("Created act2")
    }).then( () => {
        var act2 = new Activity({
            name: "AperiPovo",
            topic: [("University"), ("New")],
            place: "Povo1",
            date: "2024-11-08T17:15:00.000+02:00",
            creator: "usr1",
            maxSlot: 4,
            remainingSlots: 4,
            contacts: [],
            joinedUserIds: [],
            reportUserIds: []
        });
        return act2.save();
    }).then( () => {
        console.log("Created act3")
    }).catch( error => {throw(error)})
    console.log("Clearing users..")
    await User.deleteMany()
    .then( async () => {
        var usr1 = new User({
            name: "usr1",
            surname: "usr1",
            username: "usr1",
            email: "usr1@test.test",
            password: await salt("password"),
            role : "admin"
        });
        return usr1.save()
    }).then( ()  => {
        (console.log("Created usr1"));
    }).then( async () => {
        var usr2 = new User({
            name: "usr2",
            surname: "usr2",
            username: "usr2",
            email: "usr2@test.test",
            password: await salt("password2"),
            role : "user"
        });
        return usr2.save()
    }).then( ()  => {
        (console.log("Created usr2"));
    })
    
    console.log("Done.");
    process.exit(0);
})
