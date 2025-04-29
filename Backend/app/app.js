const express = require('express');
const cors = require('cors')

// https://expressjs.com/en/5x/api.html#app
const app = express();

// external Router() module "activities"
const activityRoutes = require('./routers/activities')
const authRoutes = require('./routers/auth')
const usersRoutes = require('./routers/users')
const adminRoutes = require('./routers/admin')
const joinRoutes = require('./routers/join')
const reportRoutes = require('./routers/report')

// cors
app.use(cors())

// Middleware
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
app.use('/api/v2/activities', activityRoutes);
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/users', usersRoutes);
app.use('/api/v2/admin', adminRoutes);
app.use('/api/v2/join', joinRoutes);
app.use('/api/v2/report', reportRoutes);
// returning the express app module to index.js
module.exports = app;