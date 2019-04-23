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
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Files from "react-files";
import "./ExpenseForm.css";

const ExpenseForm = props => {
  const [expenseData, setExpenseData] = useState({
    name: "",
    desc: "",
    amount: 0
  });

  const [tabValue, setTabValue] = useState(0);
  const [empList, setEmpList] = useState([]);

  const getEmployees = async () => {
    let response = await fetch(`/api/getEmployees/`);
    let employees = await response.json();
    setEmpList(employees);
  };

  const handleChange = name => event => {
    setExpenseData({ ...expenseData, [name]: event.target.value });
  };

  const onFilesChange = files => {
    console.log(files);
  };

  const onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

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
            <div className="singleExpense">
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
              <br />
              <TextField
                margin="dense"
                id="desc"
                label="Description"
                value={expenseData.desc}
                onChange={handleChange("desc")}
                type="text"
                fullWidth
              />
              <br />
              <TextField
                margin="dense"
                id="date"
                label="Date"
                type="date"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <br />
              <TextField
                margin="dense"
                id="amount"
                label="Amount"
                value={expenseData.amount}
                onChange={handleChange("amount")}
                type="number"
                fullWidth
              />
            </div>
          )}
          {tabValue == 1 && (
            <React.Fragment>
              <div className="fileUpload">
                <Files
                  className="filesDropzone"
                  onChange={onFilesChange}
                  onError={onFilesError}
                  accepts={[".csv"]}
                  multiple={false}
                  maxFiles={1}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable
                >
                  Click to add CSV file
                </Files>
              </div>
              <FormControl>
                <InputLabel htmlFor="select-multiple">Name</InputLabel>
                <Select
                  value={[]}
                  // onChange={this.handleChange}
                  input={<Input id="select-multiple" />}
                  MenuProps={MenuProps}
                >
                  {empList.map(name => (
                    <MenuItem
                      key={name}
                      value={name}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </React.Fragment>
          )}
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
