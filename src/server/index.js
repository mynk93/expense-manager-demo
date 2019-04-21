const express = require("express");
var admin = require("firebase-admin");
const csvtojson = require("csvtojson");

if (process.env.NODE_ENV == "production") {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.projectId,
      private_key: process.env.private_key.replace(/\\n/g, "\n"),
      client_email: process.env.client_email
    }),
    databaseURL: "https://convergytics-challenge.firebaseio.com",
    storageBucket: "convergytics-challenge.appspot.com/"
  });
} else {
  var serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://convergytics-challenge.firebaseio.com",
    storageBucket: "convergytics-challenge.appspot.com/"
  });
}

var db = admin.firestore();

var bucket = admin.storage().bucket();

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.get("/api/getExpenses/:email", (req, res) => {
  let email = req.params.email;
  let ref = db.collection(`users/${email}/expenses`);
  let data = [];
  let allExpenses = ref
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id });
      });
      res.send(data);
    })
    .catch(err => {
      console.log("Error getting documents", err);
      res.status(400).json(err);
    });
});

app.get("/api/getEmployees", (req, res) => {
  let ref = db.collection("users");
  let data = [];
  let allEmps = ref
    .get()
    .then(snapshot => {
      snapshot.forEach(emp => {
        data.push(emp.id);
      });
      res.send(data);
    })
    .catch(err => {
      console.log("Error getting documents", err);
      res.status(400).json(err);
    });
});

app.post("/api/addExpense/:email", (req, res) => {
  let email = req.params.email;
  let data = req.body;
  let userRef = db.collection("users").doc(email);
  let newExpenseRef = db.collection(`users/${email}/expenses`).doc();
  return db
    .runTransaction(transaction => {
      return transaction.get(userRef).then(userDoc => {
        if (!userDoc.exists) {
          throw "Document does not exist!";
        }
        let newTotal = parseInt(userDoc.data().total) + parseInt(data.amount);
        let newUnpaid = parseInt(userDoc.data().unpaid) + parseInt(data.amount);
        transaction.update(userRef, { total: newTotal, unpaid: newUnpaid });
        transaction.set(newExpenseRef, {
          ...data,
          amount: parseInt(data.amount),
          date: "4/20/2019",
          status: "pending"
        });
      });
    })
    .then(function() {
      console.log("Transaction successfully committed!");
      res.sendStatus(200);
    })
    .catch(function(error) {
      console.log("Transaction failed: ", error);
    });
});

app.post("/api/addBulkExpense/", (req, res) => {
  let { emailList } = req.body;
  let csv = req.body.file;
  let expenseList = [];
  csvtojson({
    noheader: true,
    headers: ["name", "desc", "date", "status", "amount"],
    trim: true
  })
    .fromFile(csv)
    .then(jsonObj => {
      expenseList = jsonObj;
    });

  let userRef = db.collection("users");
  return db
    .runTransaction(transaction => {
      return Promise.all(emailList.forEach(email => {
        expenseList.forEach(expense => {
          return transaction.get(userRef.doc(email)).then(userDoc => {
            let newTotal =
              parseInt(userDoc.data().total) +
              parseInt(data.amount / emailList.length);
            let newUnpaid =
              parseInt(userDoc.data().unpaid) +
              parseInt(data.amount / emailList.length);
            transaction.update(userRef.doc(email), {
              total: newTotal,
              unpaid: newUnpaid
            });
            transaction.set(
              userRef
                .doc(email)
                .collection("expenses")
                .doc(),
              {
                ...expense,
                amount: parseInt(expense.amount / emailList.length),
                date: "4/20/2019",
                status: "pending"
              }
            );
          });
        });
      }));
    })
    .then(function() {
      console.log("Transaction successfully committed!");
      res.sendStatus(200);
    })
    .catch(function(error) {
      console.log("Transaction failed: ", error);
    });
});

app.post("/api/updateStatus/:email", (req, res) => {
  let email = req.params.email;
  let { action, id } = req.body;
  let expenseRef = db.collection(`users/${email}/expenses`).doc(id);
  expenseRef.update({ status: action }).then(() => {
    res.sendStatus(200);
  });
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
