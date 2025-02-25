var mongoose = require('mongoose');
require('dotenv').config();
var Activity = require('../app/model/activity');
var User = require('../app/model/user');
var Participation = require('../app/model/participation');
var Report = require('../app/model/report');
const salt = require('../app/security/salt');
var Admin = require('../app/model/admin');

var args = process.argv.slice(2);

var database = new String();
var databaseType = new String();

if (args[0] === "cloud") { // Check the first element of the args array
    database = process.env.cloudDatabase;
    databaseType = "MongoDB Atlas Cluster";
} else {
    database = process.env.database;
    databaseType = "MongoDB";
}

mongoose.connect(database, {
    serverSelectionTimeoutMS: 5000
})
.catch(error => { throw(error) })
.then(async () => {
    console.log("Connected to " + databaseType);

    console.log("Deleting activities..");
    await Activity.deleteMany()
        .then(() => {
            var act1 = new Activity({
                name: "Ping Pong Povo",
                topic: [("Sport"), ("New")],
                place: "Via Sommarive, 9, Trento",
                date: "2025-02-08T17:20:00.000+01:00",
                creator: "usr1",
                maxSlot: 10,
                remainingSlots: 10,
                contacts: []
            });
            return act1.save();
        }).then(() => {
            console.log("Created act1");
        }).then(() => {
            var act2 = new Activity({
                name: "FabLab",
                topic: [("Art")],
                place: "Via Sommarive, 9, Trento",
                date: "2025-09-25T09:45:00.000+01:00",
                creator: "admin1",
                maxSlot: 8,
                remainingSlots: 8,
                contacts: []
            });
            return act2.save();
        }).then(() => {
            console.log("Created act2");
        }).then(() => {
            var act3 = new Activity({
                name: "AperiPovo",
                topic: [("University"), ("New")],
                place: "Via Sommarive, 9, Trento",
                date: "2025-11-08T17:15:00.000+01:00",
                creator: "usr2",
                maxSlot: 4,
                remainingSlots: 4,
                contacts: []
            });
            return act3.save();
        }).then(() => {
            console.log("Created act3");
        }).catch(error => { throw(error) });

    console.log("Clearing users..");
    await User.deleteMany()
    .then(async () => {
        var usr1 = new User({
            name: "usr1",
            surname: "usr1",
            username: "usr1",
            email: "usr1@test.test",
            password: await salt("password")
        });
        return usr1.save();
    }).then(async (usr1) => {
        console.log("Created usr1");

        var usr2 = new User({
            name: "usr2",
            surname: "usr2",
            username: "usr2",
            email: "usr2@test.test",
            password: await salt("password")
        });
        return usr2.save();
    }).then(async (usr2) => {
        console.log("Created usr2");

        var admin1 = new User({
            name: "admin1",
            surname: "admin1",
            username: "admin1",
            email: "admin1@test.test",
            password: await salt("admin")
        });
        return admin1.save();
    }).then(async (admin1) => {
        console.log("Created admin1");
        console.log(admin1._id);
        await Admin.deleteMany();
        const adminDoc1 = new Admin({
            adminId: admin1._id
        });
        return adminDoc1.save();
    }).catch(err => {
        console.error("Errore durante la creazione degli utenti/admin:", err);
    });
    console.log("Done");

    console.log("Clearing participations..")
    await Participation.deleteMany()
        .exec()
        .catch( error => {throw(error)})
        .then( () => {
            console.log("Done.");
        })
    console.log("Clearing reports..")
    await Report.deleteMany()
        .exec()
        .catch( error => {throw(error)})
        .then( () => {
            console.log("Done.");
        })
    console.log("Done");
    
    process.exit(0);
});