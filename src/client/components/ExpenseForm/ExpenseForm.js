import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const ExpenseForm = props => {
  const [expenseData, setExpenseData] = useState({
    name: "",
    desc: "",
    amount: 0
  });
  const [tabValue, setTabValue] = useState(0);

  const handleChange = name => event => {
    setExpenseData({ ...expenseData, [name]: event.target.value });
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
          <Tabs
            value={tabValue}
            variant="fullWidth"
            onChange={(e, v) => setTabValue(v)}
          >
            <Tab label="Single Expense" />
            <Tab label="Bulk Expense" />
          </Tabs>

          {tabValue == 0 && (
            <React.Fragment>
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
            </React.Fragment>
          )}
          {tabValue == 1 && <React.Fragment>
            
          </React.Fragment>}
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
