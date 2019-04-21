import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import ApproveIcon from "@material-ui/icons/Done";
import RejectIcon from "@material-ui/icons/Clear";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./ExpenseTile.css";

const ExpenseTile = props => {

  const [status, setStatus] = useState(props.data.status);

  const styleStatus = state => {
    switch (state) {
      case "rejected":
        return { color: "#D11313" };
      case "pending":
        return { color: "#EEAC38" };
      case "reimbursed":
        return { color: "#0EC75B" };
    }
  };
  const updateStatus = async (action, id) => {
    props.isLoading(true);
    let response = await fetch(`/api/updateStatus/${props.user.email}`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action: action, id: id })
    });
    props.isLoading(false);
    setStatus(action);
  };

  useEffect(() => {
    setStatus(props.data.status);
  }, []);

  const { data } = props;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className="panelHeader">
          <div>
            <Typography>Name : {data.name}</Typography>
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography>
              Status :{" "}
              <span style={styleStatus(status)}>{status}</span>
            </Typography>
          </div>
          <div style={{ textAlign: "right" }}>
            <Typography>Amount : {data.amount}</Typography>
          </div>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>{data.desc}</Typography>
      </ExpansionPanelDetails>
      {status === "pending" ? (
        <ExpansionPanelActions>
          <IconButton onClick={() => updateStatus("reimbursed", data.id)}>
            <ApproveIcon />
          </IconButton>
          <IconButton onClick={() => updateStatus("rejected", data.id)}>
            <RejectIcon />
          </IconButton>
        </ExpansionPanelActions>
      ) : null}
    </ExpansionPanel>
  );
};

export default ExpenseTile;
