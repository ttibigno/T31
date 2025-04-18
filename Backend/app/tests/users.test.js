const request = require('supertest');
const app = require('../app');
const api = "/api/v2/users";
const mongoose = require('mongoose');
const User = require('../model/user');
const Activity = require('../model/activity');
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

    mongoose.connection.close()
});

test("GET /activities should return 401 with an invalid token", async () => {
    return await request(app).get(api + '/activities')
        .set('Accept', 'application/json')
        .expect(401)
})

test("GET /activities should return 200 with a valid token and at least 1 activity", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers1",
        email: "test@users.usr1",
        password: await salt("test")
    });
    await testUsr.save();

    var actTest = new Activity({
                    name: "test activity",
                    topic: [("test")],
                    place: "test",
                    date: "2040-01-01T00:00:00.000+01:00",
                    creator: "testUsrUsers1",
                    maxSlot: 10,
                    remainingSlots: 10,
                    contacts: [],
                    warnings: 0
                });
    await actTest.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/activities')
        .set('Authorization', 'Bearer ' + userToken)
        .send({username: testUsr.username}).set('Accept', 'application/json')
        .expect(200)
})

test("GET /activities should return 204 with a valid token and no activities", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers2",
        email: "test@users.usr2",
        password: await salt("test")
    });
    await testUsr.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/activities')
        .set('Authorization', 'Bearer ' + userToken)
        .send({username: testUsr.username}).set('Accept', 'application/json')
        .expect(204)
})

test("POST /activities should return 401 with an invalid token", async () => {
    return await request(app).post(api + '/activities')
        .set('Accept', 'application/json')
        .expect(401)
})


test("POST /activities should return 200 with a valid token and a valid activity", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers3",
        email: "test@users.usr3",
        password: await salt("test")
    });
    await testUsr.save();

    var newActTest = {
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2040-01-01T00:00:00.000+01:00",
        maxSlot: 10,
        contacts: []
    };

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).post(api + '/activities')
        .set('Authorization', 'Bearer ' + userToken)
        .send(newActTest).set('Accept', 'application/json')
        .expect(201)
})

test("POST /activities should return 400 with a valid token and no activity", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers4",
        email: "test@users.usr4",
        password: await salt("test")
    });
    await testUsr.save();

    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).post(api + '/activities')
        .set('Authorization', 'Bearer ' + userToken)
        .set('Accept', 'application/json')
        .expect(400)
})

test("PUT /activities/:id should return 401 with an invalid token", async () => {
    return await request(app).put(api + '/activities/randomId')
        .set('Accept', 'application/json')
        .expect(401)
})

test("PUT /activities/:id should return 200 with a valid token and a valid activityId", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers5",
        email: "test@users.usr5",
        password: await salt("test")
    });
    await testUsr.save();
    var actTest = new Activity({
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2040-01-01T00:00:00.000+01:00",
        creator: "testUsrUsers5",
        maxSlot: 10,
        contacts: []
    });
    await actTest.save();
    var newActTest = {
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2040-01-01T00:00:00.000+01:00",
        maxSlot: 10
    };
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/activities/' + actTest._id)
    .set('Authorization', 'Bearer ' + userToken)
    .send(newActTest).set('Accept', 'application/json')
    .expect(200)

})

test("PUT /activities/:id should return 404 with a valid token and a valid activityId with a different creator", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers6",
        email: "test@users.usr6",
        password: await salt("test")
    });
    await testUsr.save();
    var actTest = new Activity({
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2040-01-01T00:00:00.000+01:00",
        creator: "NOTtestUsrUsers6",
        maxSlot: 10,
        contacts: []
    });
    await actTest.save();
    var newActTest = {
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2040-01-01T00:00:00.000+01:00",
        maxSlot: 10
    };
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/activities/' + actTest._id)
    .set('Authorization', 'Bearer ' + userToken)
    .send(newActTest).set('Accept', 'application/json')
    .expect(404)

})

test("PUT /activities/:id should return 404 with a valid token and an invalid activityId", async () => {
    
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers6",
        email: "test@users.usr6",
        password: await salt("test")
    });
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/activities/invalidActivity')
    .set('Authorization', 'Bearer ' + userToken)
    .set('Accept', 'application/json')
    .expect(404)

})

test("DELETE /activities/:id should return 401 with an invalid token", async () => {
    return await request(app).delete(api + '/activities/randomId')
        .set('Accept', 'application/json')
        .expect(401)
})

test("DELETE /activities/:id should return 200 with a valid token and a valid activityId", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers7",
        email: "test@users.usr7",
        password: await salt("test")
    });
    await testUsr.save();
    var actTest = new Activity({
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2040-01-01T00:00:00.000+01:00",
        creator: "testUsrUsers7",
        maxSlot: 10,
        contacts: []
    });
    await actTest.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/activities/' + actTest._id)
    .set('Authorization', 'Bearer ' + userToken)
    .set('Accept', 'application/json')
    .expect(200);
})

test("DELETE /activities/:id should return 404 with a valid token and an invalid activityId", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers8",
        email: "test@users.usr8",
        password: await salt("test")
    });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/activities/invalidActivity')
    .set('Authorization', 'Bearer ' + userToken)
    .set('Accept', 'application/json')
    .expect(404);
})

test("GET /private should return 401 with an invalid token", async () => {
    return await request(app).get(api + '/private')
        .set('Accept', 'application/json')
        .expect(401)
})

test("GET /private should return 200 with a valid userId", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers9",
        email: "test@users.usr9",
        password: await salt("test")
    });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/private')
        .set('Authorization', 'Bearer ' + userToken)
        .set('Accept', 'application/json')
        .expect(200);
})

test("PUT /private should return 401 with an invalid token", async () => {
    return await request(app).put(api + '/private')
        .set('Accept', 'application/json')
        .expect(401)
})

test("PUT /private should return 200 with a valid token and valid fields", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers10",
        email: "test@users.usr10",
        password: await salt("test")
    });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    var newUser = {
        username: "testUsrUsers10",
        email: "test@users.usr10"
    };
    return await request(app).put(api + '/private')
        .set('Authorization', 'Bearer ' + userToken)
        .send(newUser).set('Accept', 'application/json')
        .expect(200);
})

test("PUT /private should return 401 with a valid token and invalid fields", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers11",
        email: "test@users.usr11",
        password: await salt("test")
    });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    var newUser = {
        username: "admin1"
    };
    return await request(app).put(api + '/private')
        .set('Authorization', 'Bearer ' + userToken)
        .send(newUser).set('Accept', 'application/json')
        .expect(406);
})

test("PUT /private should return 401 with a valid token and no fields", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers12",
        email: "test@users.usr12",
        password: await salt("test")
    });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/private')
        .set('Authorization', 'Bearer ' + userToken)
        .set('Accept', 'application/json')
        .expect(400);
})

test("DELETE /private should return 401 with an invalid token", async () => {
    return await request(app).delete(api + '/private')
        .set('Accept', 'application/json')
        .expect(401)
})

test("DELETE /private should return 200 with a valid token", async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrUsers13",
        email: "test@users.usr13",
        password: await salt("test")
    });
    await testUsr.save();
    var userToken = await jwt.sign( {id: testUsr._id, username: testUsr.username}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/private')
        .set('Authorization', 'Bearer ' + userToken)
        .set('Accept', 'application/json')
        .expect(400);
})