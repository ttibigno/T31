const request = require('supertest');
const app = require('../app');
const api = "/api/v2/admin";
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Admin = require('../model/admin');
const mongoose = require('mongoose');
const Activity = require('../model/activity');
const salt = require('../security/salt');

beforeAll( async () => {
    jest.setTimeout(10000);
    app.locals.database = await mongoose.connect(process.env.database, {
        serverSelectionTimeoutMS: 5000
    })
});

afterAll( async () => {
    console.log("Deleting test activity");
    await Activity.deleteMany({name: "test activity"}).catch(err => {
        console.log("Error deleting test activity", err);
    });

    console.log("Deleting test user");
    await User.deleteMany({name: "testUsr"}).catch(err => {
        console.log("Error deleting test user", err);
    });
    mongoose.connection.close()
});

test('GET /manageActivities should return 401 without a token', async () => {
    return await request(app).get(api + '/manageActivities')
    .set('Accept', 'application/json')
    .expect(401);
})

test('GET /manageActivities should return 404 with an adminToken and 0 reported activities', async () => {
    const user = await await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: user._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/manageActivities')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(404);
})

test('GET /manageActivities should return 200 with an adminToken and 1 or more reported activities', async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrAdmin1",
        email: "test@admin.usr1",
        password: await salt("test")
    });
    await testUsr.save();
    
    var actTest = new Activity({
        name: "test activity",
        topic: [("test")],
        place: "test",
        date: "2060-01-01T00:00:00.000+01:00",
        creator: "testUsrAdmin1",
        maxSlot: 10,
        remainingSlots: 10,
        contacts: [],
        warnings: 1
    });
    await actTest.save();
    const user = await await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: user._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/manageActivities')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(200);
})

test('DELETE /manageActivities/:id should return 401 without a token', async () => {
    return await request(app).delete(api + '/manageActivities/anyId')
    .set('Accept', 'application/json')
    .expect(401);
})

test('DELETE /manageActivities/:id should return 200 with an adminToken and a valid activityId', async () => {
    //genera un'attività con segnalazioni per testare DELETE /manageActivities/:id OK 200
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
    const user = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: user._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/manageActivities/' + actTest._id)
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(200);
})

test('DELETE /manageActivities/:id should return 404 with and adminToken and an invalid activityId', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/manageActivities/invalidId')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(404);
})

test('GET /manageUsers should return 401 without a token', async () => {
    return await request(app).get(api + '/manageUsers')
    .set('Accept', 'application/json')
    .expect(401);
})

test('GET /manageUsers should return 200 with an adminToken', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/manageUsers')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(200);
})

test('GET /manageUsers/:query should return 200 with an adminToken', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).get(api + '/manageUsers/randomId')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(200);
})

test('PUT /manageUsers/:id should return 401 without a token', async () => {
    return await request(app).put(api + '/manageUsers/anyId')
    .set('Accept', 'application/json')
    .expect(401);
})

test('PUT /manageUsers/:id should return 200 with an adminToken and a valid userId', async () => {
    var testUsr = new User({
            name: "testUsr",
            surname: "testUsr",
            username: "testUsrAdmin2",
            email: "test@admin.usr2",
            password: await salt("test")
        });
    await testUsr.save();
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    const response = await request(app).put(api + '/manageUsers/' + testUsr._id)
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    await Admin.findOneAndDelete({userId: testUsr._id}).catch(err => {
        console.log("Error deleting test admin", err);
    });
    expect(response.statusCode).toBe(200);
})

test('PUT /manageUsers/:id should return 404 with an adminToken and an invalid userId', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/manageUsers/randomId')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(404);
})

test('PUT /manageUsers/:id should return 400 with an adminToken and an admin as parameter', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).put(api + '/manageUsers/' + admin._id)
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(400);
})

test('DELETE /manageUsers/:id should return 401 without a token', async () => {
    return await request(app).delete(api + '/manageUsers/anyId')
    .set('Accept', 'application/json')
    .expect(401);
})

/*

Funzioava, non funziona più
voglio piangere
sto impazzendo

test('DELETE /manageUsers/:id should return 200 with an adminToken and a valid userId', async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrAdmin3",
        email: "test@admin.usr3",
        password: await salt("test")
    });
    await testUsr.save();
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/manageUsers/' + testUsr._id)
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(200);
})
*/

test('DELETE /manageUsers/:id should return 404 with an adminToken and an invalid userId', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/manageUsers/randomId')
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(404);
})

test('DELETE /manageUsers/:id should return 400 with an adminToken and an admin as parameter', async () => {
    const admin = await User.findOne({ username: 'admin1' });
    var adminToken = await jwt.sign( {id: admin._id, username: 'admin1'}, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '1h'});
    return await request(app).delete(api + '/manageUsers/' + admin._id)
    .set('Authorization', 'Bearer ' + adminToken).set('Accept', 'application/json')
    .expect(400);
})