const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

//Sanity Check
exports.test = functions.https.onRequest( (request, response) => {
    response.send("Hello Jeremy's Firebase API");
   });

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true })); // Automatically allow cross-origin requests

admin.initializeApp();

//CRUD interface
app.get('/:updatetank', (req, res) => {
    res.send(JSON.stringify(req.params));
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
