const request = require('supertest');
const app = require('../app');
const api = "/api/v2/activities";
const mongoose = require('mongoose');
const activity = require('../model/activity');

beforeAll( async () => {
    app.locals.database = await mongoose.connect(process.env.database, {
        serverSelectionTimeoutMS: 5000
    })
});
afterAll( () => {
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
