const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//Sanity Check
exports.test = functions.https.onRequest((request, response) => {
    response.send("Hello Jeremy's Firebase API");
   });

const writeToRealTimeDB = (queryRecieved) => {

}

exports.updatetank = functions.https.onRequest((request, response) => {
    const keysToCheck=["lowLvl", "medLvl", "highLvl", "lastNetwrkTimeMeas", "tankComSuc", "errorLvls", "emergLvls", "warnLvls", "tankLvlsOk", "lastEppochTime"];
    const queryRecieved = request.query;
    let allKeysRecieved = true;
    let keyMissing = '';

    if(Object.entries(queryRecieved).length !== 0) {
        keysToCheck.forEach(key => {
            if(!queryRecieved.hasOwnProperty(key)) {
                allKeysRecieved = false;
                keyMissing = keyMissing + `${key} ,`;
            }
        });                
        if(allKeysRecieved) {
            writeToRealTimeDB(queryRecieved);
            response.send(`All keys recieved ${JSON.stringify(queryRecieved)}`);
        } else {
            response.send(`Not all keys recieved (${keyMissing}) ${JSON.stringify(queryRecieved)}`);
        }
    } else {
       response.send(`No keys recieved ${JSON.stringify(queryRecieved)}`); 
    } 
   });

 