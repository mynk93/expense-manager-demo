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
import MenuItem from "@material-ui/core/MenuItem";
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
  const [empListChips, updateEmpListChips] = useState([]);
  const [selectedEmpList, updateSelectedEmpList] = useState(new Set([]));
  const [fileUploadText, setFileUploadText] = useState("Click to add Reciepts");

  const getEmployees = async () => {
    let response = await fetch(`/api/getEmployees/`);
    let employees = await response.json();
    setEmpList(employees);
  };

  const addExpense = () => {
    switch (tabValue) {
      case 0:
        props.addExpense(expenseData, "Single_Expense");
        break;
      case 1:
        props.addExpense(expenseData, "Bulk_Expense");
        break;
    }
  };

  const handleChange = name => event => {
    switch (tabValue) {
      case 0:
        setExpenseData({ ...expenseData, [name]: event.target.value });
        break;
      case 1:
        updateSelectedEmpList(selectedEmpList.add(event.target.value));
        getEmpChips();
        setExpenseData({ ...expenseData, emailList: [...selectedEmpList] });
        break;
    }
  };

  const onFilesChange = files => {
    console.log(files);
    if (files.length == 1) setFileUploadText(`Added ${files[0].name}`);
    else
      setFileUploadText(
        `Added ${files[0].name} and ${files.length - 1} others`
      );
    setExpenseData({ ...expenseData, file: files });
  };

  const onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  const getEmpChips = () => {
    const itr = selectedEmpList.entries();
    let chipList = [];
    for (let emp of itr) {
      chipList.push(
        <Chip key={emp[0]} label={emp[0]} onDelete={() => removeChip(emp[0])} />
      );
    }
    updateEmpListChips(chipList);
  };

  const removeChip = emp => {
    selectedEmpList.delete(emp);
    updateSelectedEmpList(selectedEmpList);
    getEmpChips();
  };

  const getFileUploadText = val => {
    switch (val) {
      case 0:
        setFileUploadText("Click to add Reciepts");
        break;
      case 1:
        setFileUploadText("Click to add CSV file");
        break;
    }
  };

  const clearForm = () => {
    getFileUploadText(tabValue);
    setExpenseData({
      name: "",
      desc: "",
      amount: 0
    });
    updateEmpListChips([]);
    props.toggle(false);
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
            onChange={(e, v) => {
              setTabValue(v);
              getFileUploadText(v);
              getEmployees();
            }}
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
                id="amount"
                label="Amount"
                value={expenseData.amount}
                onChange={handleChange("amount")}
                type="number"
                fullWidth
              />
              <br />
              <Files
                className="filesDropzone"
                onChange={onFilesChange}
                onError={onFilesError}
                accepts={["image/*"]}
                multiple={true}
                maxFiles={3}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
              >
                {fileUploadText}
              </Files>
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
                  {fileUploadText}
                </Files>
              </div>
              <FormControl fullWidth>
                <InputLabel htmlFor="emp-select">
                  Add Colleagues To Expense
                </InputLabel>
                <Select
                  value={[]}
                  onChange={handleChange()}
                  input={<Input id="emp-select" />}
                  MenuProps={MenuProps}
                  autoWidth
                >
                  {empList.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="chipList">{empListChips}</div>
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => clearForm()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => addExpense()} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default ExpenseForm;
