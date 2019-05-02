const express = require("express");
var admin = require("firebase-admin");
const csvtojson = require("csvtojson");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

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

const app = express();

app.use(express.static("dist"));
app.use("/img", express.static("uploads"));
app.use(express.json());

app.get("/api/getExpenses/:email", async (req, res) => {
  let email = req.params.email;
  let userRef = db.doc(`users/${email}`);
  let expenseList = [];
  let totalAmount = {};

  const initializeNewUser = () => {
    userRef.set(totalAmount);
  };

  const getExpenseList = async () => {
    const data = await userRef.collection("expenses").get();
    data.forEach(doc => {
      expenseList.push({ ...doc.data(), id: doc.id });
    });
  };

  const getTotalAmount = async () => {
    const data = await userRef.get();
    if (!data.exists) {
      totalAmount = { total: 0, unpaid: 0 };
      initializeNewUser();
    } else totalAmount = data.data();
  };
  try {
    await Promise.all([getExpenseList(), getTotalAmount()]);
  } catch (err) {
    console.log(err);
    res.sendStatus(503);
    return;
  }
  res.send({ expenseList: expenseList, totalAmount: totalAmount });
  
});

app.get("/api/getEmployees", async (req, res) => {
  let ref = db.collection("users");
  let data = [];
  try {
    let allEmps = await ref.get();
    allEmps.forEach(emp => data.push(emp.id));
    res.send(data);
  } catch (err) {
    console.log("Error getting documents", err);
    res.status(400).json(err);
  }
});

app.post("/api/addExpense/:email", upload.array("reciepts", 3), (req, res) => {
  let email = req.params.email;
  let data = JSON.parse(req.body.expenseData);
  let files = req.files.map(file => file.filename);
  console.log(req.files);
  console.log(data);
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
          status: "pending",
          reciepts: files
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

app.post("/api/addBulkExpense/", upload.single("csv"), async (req, res) => {
  let emailList = req.body.emailList.split(",");
  let csv = req.file.path;

  let csvConfig = {
    noheader: true,
    headers: ["name", "desc", "date", "amount"],
    trim: true
  };
  let expenseList;
  try {
    expenseList = await csvtojson(csvConfig).fromFile(csv);
  } catch (err) {
    console.log(`error trying to read csv: ${err}`);
    res.sendStatus(400);
    return;
  }

  try {
    await db.runTransaction(async transaction => {
      let userRef = db.collection("users");
      let userData = [];
      let N = emailList.length;

      const getUserDataPromises = emailList.map(async email => {
        try {
          let userDataRef = await transaction.get(userRef.doc(email));
          userData[email] = userDataRef.data();
        } catch (err) {
          console.log(`inside get loop ${err}`);
        }
      });

      await Promise.all(getUserDataPromises);

      const setNewExpensesPromises = emailList.map(email => {
        return Promise.all(
          expenseList.map(async expense => {
            try {
              await transaction.set(
                userRef
                  .doc(email)
                  .collection("expenses")
                  .doc(),
                {
                  ...expense,
                  amount: parseInt(expense.amount / N),
                  date: "4/20/2019",
                  status: "pending"
                }
              );
            } catch (err) {
              console.log(`inside set loop ${err}`);
            }
          })
        );
      });

      await Promise.all(setNewExpensesPromises);

      const updateTotalExpensesValues = emailList.map(async email => {
        let newTotal = parseInt(userData[email].total);
        let newUnpaid = parseInt(userData[email].unpaid);
        expenseList.map(expense => {
          newTotal += parseInt(expense.amount / N);
          newUnpaid += parseInt(expense.amount / N);
        });
        try {
          await transaction.update(userRef.doc(email), {
            total: newTotal,
            unpaid: newUnpaid
          });
        } catch (err) {
          console.log(`inside update loop ${err}`);
        }
      });

      await Promise.all(updateTotalExpensesValues);
    });
  } catch (err) {
    console.log(`transaction failed: ${err}`);
    res.sendStatus(503);
    return;
  }
  console.log(`transaction success`);
  res.sendStatus(200);
});

app.post("/api/updateStatus/:email", async (req, res) => {
  let email = req.params.email;
  let { action, id, amount } = req.body;

  try {
    let userRef = db.doc(`users/${email}`);

    await db.runTransaction(async transaction => {
      const totalExpenseRef = await transaction.get(userRef);
      let totalUnpaid = totalExpenseRef.data().unpaid;

      const updateExpense = await transaction.update(
        userRef.collection("expenses").doc(id),
        { status: action }
      );

      const updateUnpaid = await transaction.update(userRef, {
        unpaid: totalUnpaid - amount
      });

      await Promise.all([updateExpense, updateUnpaid]);
    });
  } catch (err) {
    console.log(`transaction failed: ${err}`);
    res.sendStatus(503);
    return;
  }
  console.log(`transaction success`);
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
