const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/user')
// const routes = ;

// require("dotenv").config({
//     path: path.join(__dirname, "../.env")
// });
require("dotenv").config();
const app = express();
//Firebase storage
const Firebase = require('firebase-admin');
const firesdk = {
    type: "service_account",
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}

// var serviceAccount = require('./firebasesdk.json');
Firebase.initializeApp({
    credential: Firebase.credential.cert(JSON.parse(JSON.stringify(firesdk))),
    storageBucket: process.env.storageBucket
});
//DATABASE
const PORT = process.env.PORT || 3000;
const dbString = process.env.DATABASE;

mongoose
    .connect(dbString, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to the Database successfully');
    });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async(req, res, next) => {
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
        }
        res.locals.loggedInUser = await User.findById(userId);
        next();
    } else {
        next();
    }
});

app.use('/api/v1', require('./routes/route'));

app.listen(PORT, () => {
    console.log('Server is listening on Port:', PORT);
})
