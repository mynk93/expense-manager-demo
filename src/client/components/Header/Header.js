import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const Header = props => {
  useEffect(() => {}, []);

  const [anchor, setAnchor] = useState();

  const handleClose = () => {
    setAnchor(null);
  };

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
            Expense Split
          </Typography>
          <Button
            color="inherit"
            aria-owns={anchor ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={e => setAnchor(e.currentTarget)}
          >
            {props.displayName || ""}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={handleClose}
          >
            <MenuItem onClick={props.logOut}>Logout</MenuItem>
          </Menu>
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
