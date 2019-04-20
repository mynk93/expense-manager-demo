const express = require("express");
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://convergytics-challenge.firebaseio.com",
  storageBucket: "convergytics-challenge.appspot.com/"
});
var db = admin.firestore();
var bucket = admin.storage().bucket();

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.get("/api/getExpenses/:email", (req, res) => {
  let email = req.params.email;
  let ref = db
    .collection("users")
    .doc(email)
    .collection("expenses");
  let data = [];
  let allExpenses = ref
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data.push({...doc.data(), id: doc.id})
      });
      res.send(data);
    })
    .catch(err => {
      console.log("Error getting documents", err);
      res.err(err);
    });
});

app.post("/api/addExpense/:email", (req, res) => {
  let email = req.params.email;
  let data = req.body;
  let ref = db
    .collection("users")
    .doc(email)
    .collection("expenses");
  ref.add({
    ...data,
    date: "4/20/2019",
    status: "pending"
  }).then( ref => {
    res.send(ref.id);
  });
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
