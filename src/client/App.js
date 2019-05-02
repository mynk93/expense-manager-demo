import React, { useState, useEffect } from "react";
import "./app.css";
import useDarkMode from "use-dark-mode";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { getLightTheme, getDarkTheme } from "./utils/theme";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import config from "./config.json";
import {
  Header,
  Loader,
  Expenses,
  ExpenseForm,
  DashboardStatistics
} from "./components";

firebase.initializeApp(config);

const uiConfig = {
  signInFlow: "popup",
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

function App() {
  const darkMode = useDarkMode(false);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [totalAmount, setTotalAmount] = useState({});
  const [addExpense, setAddExpense] = useState(false);

  const fetchExpenses = async email => {
    setIsLoading(true);
    let response = await fetch(`/api/getExpenses/${email}`);
    let data = await response.json();
    setIsLoading(false);
    console.log(data);
    setExpenseList(data.expenseList);
    setTotalAmount(data.totalAmount);
  };

  const postAddExpense = async (data, type) => {
    let { file, ...rest } = data;
    console.log(rest);
    if(file && file.length)
      file.map(x => console.log(x));
    setIsLoading(true);
    let response;
    switch (type) {
      case "Single_Expense": {
        let form = new FormData();
        form.append("expenseData", JSON.stringify(rest));
        if (file && file.length > 0) file.map(x => form.append("reciepts", x));
        response = await fetch(`/api/addExpense/${user.email}`, {
          method: "post",
          body: form
        });
        break;
      }
      case "Bulk_Expense": {
        let form = new FormData();
        form.append("csv", data.file);
        form.append("emailList", data.emailList);
        response = await fetch(`/api/addBulkExpense/`, {
          method: "post",
          body: form
        });
        break;
      }
    }
    setAddExpense(false);
    let id = await response.text();
    fetchExpenses(user.email);
    setIsLoading(false);
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser({});
        setExpenseList([]);
        setIsSignedIn(false);
      });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        fetchExpenses(user.email);
        setUser(user);
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
  }, []);

  return (
    <MuiThemeProvider theme={darkMode.value ? getDarkTheme : getLightTheme}>
      <Header
        darkMode={darkMode}
        displayName={user.displayName}
        logOut={isSignedIn ? signOut : null}
      />
      {isLoading ? <Loader /> : null}
      {isSignedIn ? (
        <Paper
          className="app"
          elevation={0}
          square={true}
        >
          <DashboardStatistics
            unpaid={totalAmount.unpaid}
            paid={totalAmount.total - totalAmount.unpaid}
          />
          <Expenses
            expenseList={expenseList}
            user={user}
            isLoading={isLoading}
            fetchExpenses={fetchExpenses}
            setIsLoading={setIsLoading}
          />
          <div className="fabBtns">
            <Fab
              color="secondary"
              aria-label="Refresh"
              className="refreshBtn"
              onClick={() => fetchExpenses(user.email)}
            >
              <RefreshIcon />
            </Fab>
            <Fab
              color="primary"
              aria-label="Add"
              className="addBtn"
              style={{ marginTop: 12 }}
              onClick={() => setAddExpense(true)}
            >
              <AddIcon />
            </Fab>
          </div>
          <ExpenseForm
            expand={addExpense}
            toggle={setAddExpense}
            addExpense={postAddExpense}
            email={user.email}
          />
        </Paper>
      ) : (
        <div
          className="loginOptions"
        >
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      )}
    </MuiThemeProvider>
  );
}

export default App;
