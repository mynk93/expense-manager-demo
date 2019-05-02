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
import ModalImage from "react-modal-image";
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
  const updateStatus = async (action, id, amount) => {
    props.isLoading(true);
    try {
      let response = await fetch(`/api/updateStatus/${props.user.email}`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: action, id: id, amount: amount })
      });
    } catch (err) {
      console.log(err);
      return;
    }
    props.fetchExpenses(props.user.email);
    setStatus(action);
  };

  const getImages = () => {
    if (props.data.reciepts && props.data.reciepts.length > 0) {
      let imageList = props.data.reciepts.map(reciept => (
        <ModalImage
          key={reciept}
          small={`/img/${reciept}`}
          large={`/img/${reciept}`}
          alt="Image"
        />
      ));
      return (
        <React.Fragment>
          <Typography className="expenseImagesText">Images : </Typography>
          <div className="imagesPanel">{imageList}</div>
        </React.Fragment>
      );
    } else return null;
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
              Status : <span style={styleStatus(status)}>{status}</span>
            </Typography>
          </div>
          <div style={{ textAlign: "right" }}>
            <Typography>Amount : {data.amount}</Typography>
          </div>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className="panelBody">
          <Typography className="description">
            Description : {data.desc}
          </Typography>
          {getImages()}
        </div>
      </ExpansionPanelDetails>
      {status === "pending" ? (
        <ExpansionPanelActions>
          <IconButton
            onClick={() => updateStatus("reimbursed", data.id, data.amount)}
          >
            <ApproveIcon style={{ color: "#0EC75B" }} />
          </IconButton>
          <IconButton
            onClick={() => updateStatus("rejected", data.id, data.amount)}
          >
            <RejectIcon style={{ color: "#D11313" }} />
          </IconButton>
        </ExpansionPanelActions>
      ) : null}
    </ExpansionPanel>
  );
};

export default ExpenseTile;
