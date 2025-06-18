const request = require('supertest');
const app = require('../app');
const api = "/api/v2/activities";
const mongoose = require('mongoose');
const activity = require('../model/activity');

beforeAll( async () => {
    jest.setTimeout(10000);
    await setTimeout( () => {}, 2000);
    app.locals.database = await mongoose.connect(process.env.database, {
        serverSelectionTimeoutMS: 5000
    })
    var act1 = new activity({
                    name: "test",
                    topic: [("Sport"), ("New")],
                    place: "Via Sommarive, 9, Trento",
                    date: "1970-02-08T17:20:00.000+01:00",
                    creator: "usr1",
                    maxSlot: 10,
                    remainingSlots: 10
                });
    return act1.save();
});
afterAll( () => {
    console.log("Deleting test activity");
    activity.deleteMany({"name" : "test"}).catch(err => {
        console.log("Error deleting test activity", err);
    });
    mongoose.connection.close() 
});

test('GET /activities should return 200', async () => { 
    const response = await request(app).get(api + '');
    //console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array)
});

test('GET /activities/:query should return 200', async () => {
    const response = await request(app).get(api + '/.*');
    //console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array)
});
