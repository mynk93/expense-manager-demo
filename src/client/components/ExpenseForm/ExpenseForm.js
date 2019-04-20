import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const ExpenseForm = props => {
  const [expenseData, setExpenseData] = useState({
    name: "",
    desc: "",
    amount: ""
  });

  const handleChange = name => event => {
    setExpenseData({...expenseData,
      [name]: event.target.value
    });
  };

  return (
    <form noValidate autoComplete="off">
      <Dialog
        open={props.expand}
        onClose={() => props.toggle(false)}
        disableBackdropClick={true}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill the form to add an Expense</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            value={expenseData.name}
            onChange={handleChange("name")}
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="desc"
            label="Description"
            value={expenseData.desc}
            onChange={handleChange("desc")}
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="date"
            label="Date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            margin="dense"
            id="amount"
            label="Amount"
            value={expenseData.amount}
            onChange={handleChange("amount")}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.toggle(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => props.addExpense(expenseData)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default ExpenseForm;
