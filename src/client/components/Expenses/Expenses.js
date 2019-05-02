import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import ExpenseTile from "../ExpenseTile";
import Typography from "@material-ui/core/Typography";
import SearchBar from "material-ui-search-bar";
import "./Expenses.css";

const Expenses = props => {
  const [expenseList, setExpenseList] = useState(props.expenseList || []);
  const [isSearching, setIsSearching] = useState(false);

  const searchExpense = e => {
    if (e.length) setIsSearching(true);
    else setIsSearching(false);
    setExpenseList(
      props.expenseList.filter(exp =>
        exp.name.toLowerCase().includes(e.toLowerCase())
      )
    );
  };

  const cancelSearch = () => {
    setExpenseList(props.expenseList);
  };

  const parseExpenseList = list => {
    let res = [];
    res = list.map(row => (
      <ExpenseTile
        data={row}
        cancelOnEscape
        key={row.id}
        user={props.user}
        fetchExpenses={props.fetchExpenses}
        isLoading={props.setIsLoading}
      />
    ));
    if (res.length > 0) return res;
    else
      return (
        <Typography className="emptyList">
          No expenses found with given name
        </Typography>
      );
  };

  useEffect(() => {
    setExpenseList(props.expenseList);
  }, [props.expenseList]);

  return (
    <Paper className="expense-list" elevation={1} square={true}>
      {expenseList.length > 0 || isSearching ? (
        <React.Fragment>
          <SearchBar
            onChange={e => searchExpense(e)}
            onCancelSearch={() => cancelSearch()}
            style={{
              marginBottom: 18
            }}
          />
          {parseExpenseList(expenseList)}
        </React.Fragment>
      ) : props.isLoading ? null : (
        <Typography className="emptyList">
          No expenses added. Click + to get started.
        </Typography>
      )}
    </Paper>
  );
};

export default Expenses;
