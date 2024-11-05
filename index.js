const app = require('./app/app.js'); //express app module
const mongoose = require('mongoose'); 
require('dotenv').config(); // .env file support for private KEYS
// Usage: https://www.npmjs.com/package/dotenv#%EF%B8%8F-usage
// Why: https://www.dotenv.org/docs/security/env

const port = process.env.port || 8080;

// app.locals: https://expressjs.com/en/5x/api.html#app.locals
// mongoose.connect: https://mongoosejs.com/docs/connections.html
app.locals.database = mongoose.connect(process.env.database, {
    serverSelectionTimeoutMS: 5000 //tries to connect only for 5000ms. DELETE LATER.
  })
.catch( error => {throw(error)}
)
.then( () => {
    console.log("Connected to MongoDB");

    // https://expressjs.com/en/5x/api.html#app.listen
    app.listen(port, () => { 
        console.log(`Server listening on port ${port}`);
    })
})
