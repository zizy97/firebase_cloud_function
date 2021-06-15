const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

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
              .substr(0, description.length > 100 ? 100 : description.length)+
                "...",
        },
        topic: "notification",
      };
      admin.messaging().send(message);
    });
