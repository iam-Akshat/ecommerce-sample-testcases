const mongoose = require('mongoose');
const app = require('../src/app');
const dotenv = require('dotenv');
dotenv.config();

const port = 5000;

const mongoURI = "mongodb://localhost/ecommerceTest" || "mongodb://mongoService:27017/" + "ecommerceTesting"

//connect to DB before running tests
before((done) => {
    // start the server
    app.listen(port, () => {
        mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
        mongoose.connection.once('open', () => {
            console.log('connected to database');
            done();
        }).on('connectionError', (err) =>{
            console.log(err);
        })
    })
})

//drop the databsae
after((done) =>{
    mongoose.connection.db.dropDatabase(() => {
        mongoose.disconnect().then(() => done()).catch(err => console.log(err));
    })
})