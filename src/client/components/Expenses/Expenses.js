import React from "react";
import Paper from "@material-ui/core/Paper";
import ExpenseTile from '../ExpenseTile'
import "./Expenses.css";

const Expenses = props => {
  return (
    <Paper className="expense-list" elevation={0} square={true}>
      {props.expenseList.map(row => (
        <ExpenseTile data={row} key={row.id} user={props.user} isLoading={props.isLoading}/>
      ))}
    </Paper>
  );
};

export default Expenses;
