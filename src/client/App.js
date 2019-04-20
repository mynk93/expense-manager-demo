import React, { useState, useEffect } from "react";
import "./app.css";
import useDarkMode from "use-dark-mode";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Header, Loader, Expenses, ExpenseForm } from "./components";
import { getLightTheme, getDarkTheme } from "./utils/theme";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";



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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState (false);
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
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        fetchExpenses(user.email);
        setIsSignedIn(true);
        setUser(user);
      }
      console.log(user);
    });
  }, []);

  return (
    <MuiThemeProvider theme={darkMode.value ? getDarkTheme : getLightTheme}>
      <div className="app">
        {isLoading ? <Loader /> : null}
        {/* {isSignedIn ? (
          <p>Welcome! You are now signed-in!</p>
        ) : (
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )} */}
        <Header
          darkMode={darkMode}
          displayName={
            isSignedIn ? firebase.auth().currentUser.displayName : null
          }
        />
        <Fab
          color="primary"
          aria-label="Add"
          className="addBtn"
          onClick={() => setAddExpense(true)}
        >
          <AddIcon />
        </Fab>
        {/* <Button
          variant="outlined"
          style={{ paddingTop: "5em" }}
          }
        >
          Add Expense
        </Button> */}
        <ExpenseForm
          expand={addExpense}
          toggle={setAddExpense}
          addExpense={postAddExpense}
        />
        <Expenses expenseList={expenseList} />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
