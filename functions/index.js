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
                keyMissing = keyMisscing + `${key} ,`;
            }
        });                
        if(allKeysRecieved) {
            const { tankComSuc } = queryRecieved;
            if(tankComSuc === '1') {
                admin.database().ref(`/lastsuccessful`).set(queryRecieved); 
            }  
            admin.database().ref(`/storage`).once("value").then((snapshot) => {
                var count = snapshot.numChildren();
                admin.database().ref(`/storage`).push(queryRecieved);
                admin.database().ref(`/count`).set(count);
                if(count >= 5) { //Later change to ~500
                        admin.database().ref('/storage').orderByKey().limitToFirst(1).once("value").then((snap)=>{
                        admin.database().ref(`/random`).push(snap.exportVal()); 
                        admin.database().ref(`/storage`).child(Object.keys(snap.exportVal())[0]).remove(); 
                        return;
                    }).catch(()=>{return;});
                    // admin.database().ref(`/storage`).child("-M1jZ_k3g-WuoHlKVR9U").remove()
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