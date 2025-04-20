const request = require('supertest');
const app = require('../app');
const api = "/api/v2/auth";
const mongoose = require('mongoose')
const User = require('../model/user')
const salt = require('../security/salt')

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
    mongoose.connection.close()
});


test('POST /register should return 201 with valid credentials', async () => {
    const query = {
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrAuth1",
        email: "test@auth.usr1",
        password: await salt("test")
    }
    const reque = await request(app).post(api + '/register')
    .send(query).set('Accept', 'application/json')

    expect(reque.status).toBe(201)
})

test('POST /register should return 400 with missing credentials', async () => {
    const query = {
        name: "testUsr",
        //everything else is missing
    }
    const reque = await request(app).post(api + '/register')
    .send(query).set('Accept', 'application/json')
    expect(reque.status).toBe(400)
})

test('POST /login should return 200 with valid credentials', async () => {
    var testUsr = new User({
        name: "testUsr",
        surname: "testUsr",
        username: "testUsrAuth2",
        email: "test@auth.usr2",
        password: await salt("test")
    });
    await testUsr.save();
    const query = {
        username: "testUsrAuth2",
        password: "test"
    }
    const reque = await request(app).post(api + '/login')
    .send(query).set('Accept', 'application/json')
    expect(reque.status).toBe(200)
})

test('POST /login should return 401 with invalid credentials', async () => {
    const query = {
        username: "nonExistentUsr",
        password: "invalid"
    }
    const reque = await request(app).post(api + '/login')
    .send(query).set('Accept', 'application/json')
    expect(reque.status).toBe(401)
})