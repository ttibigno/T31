const request = require('supertest');
const app = require('../app');
const api = "/api/v2/join";
const mongoose = require('mongoose')
const User = require('../model/user');
const Activity = require('../model/activity');
const jwt = require('jsonwebtoken');
const Participation = require('../model/participation');
const salt = require('../security/salt');

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

    console.log("Deleting participations");
    await Participation.deleteMany({}).catch(err => {
        console.log("Error deleting participations", err);
    });

    mongoose.connection.close()
});

test('PUT /:id should return 200 with valid activityId and userId', async () => {
    var actTest = new Activity({
            name: "test activity",
            topic: [("test")],
            place: "test",
            date: "2060-01-01T00:00:00.000+01:00",
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
            username: "testUsrJoin1",
            email: "test@join.usr1",
            password: await salt("test")
        });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/' + actTest._id)
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
        .expect(200)
})

test('PUT /:id should return 404 with valid activityId and an user that has already joined', async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrJoin2",
        email: "test@join.usr2",
        password: await salt("test")
    });
    await testUsr.save();

    var actTest = new Activity({
            name: "test activity",
            topic: [("test")],
            place: "test",
            date: "2060-01-01T00:00:00.000+01:00",
            creator: "usr1",
            maxSlot: 10,
            remainingSlots: 10,
            contacts: [],
            warnings: 0
        });
    await actTest.save();

    var testParticipation = new Participation({
        activityId: actTest._id,
        userId: testUsr._id,
    });
    await testParticipation.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/' + actTest._id)
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
        .expect(404)
})

test('PUT /:id should return 404 with valid ended activityId and userId', async () => {
    var actTest = new Activity({
            name: "test activity",
            topic: [("test")],
            place: "test",
            date: "1970-01-01T00:00:00.000+01:00",
            creator: "testUsrJoin3",
            maxSlot: 10,
            remainingSlots: 10,
            contacts: [],
            warnings: 0
        });
    await actTest.save();

    var testUsr = new User({
            name: "testUsr",
            surname: "testUsr",
            username: "testUsrJoin3",
            email: "test@join.usr3",
            password: await salt("test")
        });
    await testUsr.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/' + actTest._id)
        .set('Authorization', 'Bearer ' + userToken)
        .set('Accept', 'application/json')
        .expect(404)
})

test('PUT /:id should return 400 with an invalid activityId and a valid userId', async () => {
    var testUsr = new User({
            name: "testUsr",
            surname: "testUsr",
            username: "testUsrJoin4",
            email: "test@join.usr4",
            password: await salt("test")
        });
    await testUsr.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/invalidActivity')
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
        .expect(400)
})

test("PUT /:id should return 401 with an invalid token", async () => {
    var actTest = new Activity({
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "1970-01-01T00:00:00.000+01:00",
        creator: "usr1",
        maxSlot: 10,
        remainingSlots: 10,
        contacts: [],
        warnings: 0
    });
    await actTest.save();

    return await request(app).put(api + '/' + actTest._id)
        .set('Accept', 'application/json')
        .expect(401)
})


test('GET / should return 200 with valid userId', async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrJoin5",
        email: "test@join.usr5",
        password: await salt("test")
    });
    await testUsr.save();

    var actTest = new Activity({
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2060-01-01T00:00:00.000+01:00",
        creator: "usr1",
        maxSlot: 10,
        remainingSlots: 10,
        contacts: [],
        warnings: 0
    });
await actTest.save();

var testParticipation = new Participation({
    activityId: actTest._id,
    userId: testUsr._id,
});
await testParticipation.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    const response = await request(app).get(api + '/')
        .set('Authorization', 'Bearer ' + userToken)
        .send({id: testUsr._id}).set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
})

test("GET / should return 401 with an invalid token", async () => {
    return await request(app).put(api + '/activities')
        .set('Accept', 'application/json')
        .expect(401)
})