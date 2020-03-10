const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

//Sanity Check
exports.test = functions.https.onRequest((request, response) => {
    response.send("Hello Jeremy's Firebase API");
   });


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
            const { tankComSuc } = queryRecieved;

            if(tankComSuc === '1') {
                admin.database().ref(`/lastSuccessful`).set(queryRecieved); 
            }  

            admin.database().ref(`/lastUpdate`).set(queryRecieved);

            admin.database().ref(`/records`).once("value").then((snapshot) => {
  
                admin.database().ref(`/records`).push(queryRecieved);

                var count = snapshot.numChildren();
                admin.database().ref(`/recordsTotal`).set(count);

                if(count >= 1000) { //Later change to ~5000
                    admin.database().ref('/records').orderByKey().limitToFirst(1).once("value").then((snap)=>{
                        admin.database().ref(`/records`).child(Object.keys(snap.exportVal())[0]).remove(); 
                        return;
                    }).catch(()=>{return;});
                }
                return;
              }).catch(()=>{return;});
            response.send(`All keys recieved ${JSON.stringify(queryRecieved)}`);
        } else {
            response.send(`Not all keys recieved (${keyMissing}) ${JSON.stringify(queryRecieved)}`);
        }
    } else {
       response.send(`No keys recieved ${JSON.stringify(queryRecieved)}`); 
    } 
   });