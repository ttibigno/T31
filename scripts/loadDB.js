var mongoose = require('mongoose');
require('dotenv').config();
var Activity = require('../app/model/activity');


mongoose.connect(process.env.database, {
    serverSelectionTimeoutMS: 5000
  })
.catch( error => {throw(error)}
)
.then( async () => {
    console.log("Connected to MongoDB");

    console.log("Deleting activities..")
    // https://mongoosejs.com/docs/api/model.html#Model.deleteMany()
    await Activity.deleteMany()
        .then( () => {
        var act1 = new Activity({
            id: '0000-0000-0000-0001',
            name: "Act 1",
            topic: [("Sport"), ("New")],
            place: "Povo1",
            // https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format
            date: Date("2024-10-09T10:30:00.000+02:00") ,
            creator: "server",
            maxSlot: 10,
            remainingSlots: 10,
            contacts: []
        });
        // https://mongoosejs.com/docs/api/document.html#Document.prototype.save()
        return act1.save();
    }).then( () => {
        console.log("Created act1")
    }).then( () => {
        var act2 = new Activity({
            id: '0378-0501-6082-0002',
            name: "Act 2",
            topic: [("Art")],
            place: "Povo2",
            date: Date("2024-09-25T09:45:00.000+02:00"),
            creator: "server",
            maxSlot: 8,
            remainingSlots: 8,
            contacts: []
        });
        return act2.save();
    }).then( () => {
        console.log("Created act2")
    }).then( () => {
        var act2 = new Activity({
            id: '8194-5729-3916-0003',
            name: "Act 3",
            topic: [("Debate"), ("University")],
            place: "Povo0",
            date: Date("2024-11-11T15:15:00.000+02:00"),
            creator: "server",
            maxSlot: 4,
            remainingSlots: 4,
            contacts: []
        });
        return act2.save();
    }).then( () => {
        console.log("Created act3")
    }).catch( error => {throw(error)})
    
    console.log("Done.");
    process.exit(0);
})
