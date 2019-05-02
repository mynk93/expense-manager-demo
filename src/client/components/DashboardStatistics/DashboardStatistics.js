import React, { useState } from "react";
import PieChart from "react-minimal-pie-chart";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import "./DashboardStatistics.css";

const DashboardStatistics = props => {
  const data = [
    { title: "Unpaid", value: props.unpaid || 0, color: "#D11313" },
    { title: "Paid", value: props.paid || 0, color: "#0EC75B" }
  ];

  const total = props.paid + props.unpaid;

  const calcDataPoints = () => {
    let data = [];
    if (props.unpaid)
      data.push({ title: "Unpaid", value: props.unpaid, color: "#D11313" });
    if (props.paid)
      data.push({ title: "Paid", value: props.paid || 0, color: "#0EC75B" });
    return data;
  };

  return total ? (
    <Paper className="dashboard" elevation={1} square={true}>
      <div className="pieChart">
        <PieChart
          data={calcDataPoints(props)}
          lengthAngle={-360}
          animate
          label
          labelStyle={{
            fontSize: "5px",
            fontFamily: "sans-serif"
          }}
          labelPosition={112}
          style={{ maxHeight: "10em", maxWidth: "10em" }}
        />
      </div>
      <div className="dashboardText">
        <div className="dashboardHeading">
          <Typography variant="h5">Total Expense</Typography>
          <Typography variant="h3">{total || 0}</Typography>
        </div>
        <div className="dashboardBottom">
          <div className="dashboardBottomLeft">
            <Typography variant="h5">Unpaid</Typography>
            <Typography variant="h4" style={{ color: "#D11313" }}>
              {props.unpaid || 0}
            </Typography>
          </div>
          <div className="dashboardBottomRight">
            <Typography variant="h5">Paid</Typography>
            <Typography variant="h4" style={{ color: "#0EC75B" }}>
              {props.paid || 0}
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  ) : null;
};

export default DashboardStatistics;
