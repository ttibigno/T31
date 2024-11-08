const express = require('express');

// https://expressjs.com/en/5x/api.html#app
const app = express();

// external Router() module "activities"
const activities = require('./activities')

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
app.use('/api/v1/activities', activities);

// returning the express app module to index.js
module.exports = app;