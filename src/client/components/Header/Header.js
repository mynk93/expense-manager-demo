import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const Header = props => {
  useEffect(() => {}, []);

  return (
    <div>
      <AppBar position="fixed" color="secondary" style={{ flexGrow: 1 }}>
        <Toolbar>
          <Typography
            variant="h5"
            color="inherit"
            style={{ flexGrow: 1 }}
            noWrap
          >
            Convergytics Expense Manager
          </Typography>
          <Typography color="inherit">{props.displayName}</Typography>
          <Tooltip title="Toggle light/dark theme">
            <IconButton color="inherit" onClick={props.darkMode.toggle}>
              <i className="material-icons">
                {props.darkMode.value ? "brightness_3" : "brightness_7"}
              </i>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
