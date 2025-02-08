const express = require('express');
const cors = require('cors')

// https://expressjs.com/en/5x/api.html#app
const app = express();

// external Router() module "activities"
const activityRoutes = require('./activities')
const authRoutes = require('./auth')
const usersRoutes = require('./users')
const adminRoutes = require('./admin')
const joinRoutes = require('./join')
const reportRoutes = require('./report')

app.use(cors())

app.use(
    // REQ: https://expressjs.com/en/5x/api.html#req
    // RES: https://expressjs.com/en/5x/api.html#res
    (req, res, next) => {
    console.log(`received ${req.method + " " + req.hostname + req.url}`)
    next()
    }
)
app.use(express.json());
// Routing
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/join', joinRoutes);
app.use('/api/v1/report', reportRoutes);
// returning the express app module to index.js
module.exports = app;