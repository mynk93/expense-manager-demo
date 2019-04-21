import React, { useState, useEffect } from "react";
import "./app.css";
import useDarkMode from "use-dark-mode";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Header, Loader, Expenses, ExpenseForm } from "./components";
import { getLightTheme, getDarkTheme } from "./utils/theme";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from "@material-ui/icons/Refresh";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import config from "./config.json";

firebase.initializeApp(config);

const uiConfig = {
  signInFlow: "popup",
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
};

function App() {
  const darkMode = useDarkMode(false);
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [addExpense, setAddExpense] = useState(false);

  const fetchExpenses = async email => {
    setIsLoading(true);
    let response = await fetch(`/api/getExpenses/${email}`);
    let data = await response.json();
    setIsLoading(false);
    console.log(data);
    setExpenseList(data);
  };

  const postAddExpense = async data => {
    let response = await fetch(`/api/addExpense/${user.email}`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    setAddExpense(false);
    fetchExpenses(user.email);
    let id = await response.text();
  };

  const signOut = () => {
    firebase.auth().signOut().then(() => {
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
      } else setIsSignedIn(false);
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
      {!isSignedIn ? (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
      <div className="app">
        <Expenses expenseList={expenseList} user={user} isLoading={setIsLoading}/>
      </div>
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
      />
    </MuiThemeProvider>
  );
}

export default App;
