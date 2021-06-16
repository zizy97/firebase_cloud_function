const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.getAllNewsdata = functions.https.onRequest(async (request, response) => {
  const dbRef = admin.database().ref();
  var output;
  await dbRef.child("Newsdata").get().then((snapshot) => {
    var result;
    if (snapshot.exists()) {
      const newsdata = snapshot.val();
      const arr = [];
      for (const x in newsdata) {
        if (x != null) {
          arr.push(newsdata[x]);
        }
      }
      output = { "Newsdata": arr };
    } else {
      output = "No data available";
    }
  }).catch((error) => {
    output = error;
  });
  await response.send(output);
});

exports.getRecentNewsdata = functions.https.onRequest(async (request, response) => {
  const dbRef = admin.database().ref();
  var output;
  await dbRef.child("Newsdata").get().then((snapshot) => {
    if (snapshot.exists()) {
      const newsdata = snapshot.val();
      const arr = [];
      for (const x in newsdata) {
        if (x != null) {
          if (newsdata[x]["recent"] == true) {
            arr.push(newsdata[x]);
          }
        }
      }
      output = { "Newsdata": arr };
    } else {
      output = "No data available";
    }
  }).catch((error) => {
    output = error;
  });
  await response.send(output);
});

exports.sendNotify = functions.database
  .ref("Newsdata/{id}")
  .onCreate((datasnap, context) => {
    const msg = datasnap.val();
    console.log(msg);
    const title = msg["title"];
    const description = msg["description"];
    const message = {
      notification: {
        title: title,
        body: description
          .substr(0, description.length > 100 ? 100 : description.length) +
          "...",
      },
      topic: "notification",
    };
    admin.messaging().send(message);
  });
  