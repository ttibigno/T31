const express = require('express');
// https://expressjs.com/en/5x/api.html#router
const router = express.Router();


router.use((req, res, next) => {
    console.log(`routing to /activities${req.url}`)
    next()
})

router.get('/');

// returning the Router() module to app.js
module.exports = router;