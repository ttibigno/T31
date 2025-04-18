const request = require('supertest');
const app = require('../app');
const api = "/api/v2/report";
const mongoose = require('mongoose');
const User = require('../model/user');
const Activity = require('../model/activity');
const Report = require('../model/report');
const salt = require('../security/salt');
const jwt = require('jsonwebtoken');

beforeAll( async () => {
    jest.setTimeout(10000);
    app.locals.database = await mongoose.connect(process.env.database, {
        serverSelectionTimeoutMS: 5000
    })
});

afterAll( async () => {

    console.log("Deleting test user");
    await User.deleteMany({name: "testUsr"}).catch(err => {
        console.log("Error deleting test user", err);
    });
    
    console.log("Deleting test activity");
    await Activity.deleteMany({name: "test activity"}).catch(err => {
        console.log("Error deleting test activity", err);
    });

    console.log("Deleting test report");
    await Report.deleteMany({}).catch(err => {
        console.log("Error deleting reports", err);
    });

    mongoose.connection.close()
});

test("PUT /:id should return 200 with a valid userId and activityId", async () => {
    var actTest = new Activity({
                name: "test activity",
                topic: [("test")],
                place: "test",
                date: "2040-01-01T00:00:00.000+01:00",
                creator: "usr1",
                maxSlot: 10,
                remainingSlots: 10,
                contacts: [],
                warnings: 0
            });
    await actTest.save();

    var testUsr = new User({
                name: "testUsr",
                surname: "testUsr",
                username: "testUsrReport1",
                email: "test@report.usr1",
                password: await salt("test")
            });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/' + actTest._id)
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
        .expect(200)
})

test("PUT /:id should return 400 with a valid userId and an activity arleady reported", async () => {
    var actTest = new Activity({
                name: "test activity",
                topic: [("test")],
                place: "test",
                date: "2040-01-01T00:00:00.000+01:00",
                creator: "usr1",
                maxSlot: 10,
                remainingSlots: 10,
                contacts: [],
                warnings: 0
            });
    await actTest.save();

    var testUsr = new User({
                name: "testUsr",
                surname: "testUsr",
                username: "testUsrReport2",
                email: "test@report.usr2",
                password: await salt("test")
            });
    await testUsr.save();
    
    var newReport = new Report({
        activityId: actTest._id,
        userId: testUsr._id
    });
    await newReport.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/' + actTest._id)
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
        .expect(400)
})

test("PUT /:id should return 404 with a valid userId and an invalid activityId", async () => {

    var testUsr = new User({
                name: "testUsr",
                surname: "testUsr",
                username: "testUsrReport3",
                email: "test@report.usr3",
                password: await salt("test")
            });
    await testUsr.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/invalidActivity')
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
        .expect(404)
})

test("PUT /:id should return 401 with an invalid token", async () => {
    return await request(app).put(api + '/invalidActivity')
        .set('Accept', 'application/json')
        .expect(401)
})