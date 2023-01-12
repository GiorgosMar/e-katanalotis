import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchBar from "./SearchBar";
import { UserContext } from "./UserContext";

export default function ButtonAppBar() {
  //useContext
  const { setIsAuthenticated } = useContext(UserContext);

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <Box sx={{ flexGrow: 1, pb: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#472183", py: 1 }}>
        <Toolbar>
          <ShoppingCartIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            textAlign="center"
            noWrap
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            e-Katanalotis
          </Typography>
          <Typography
            textAlign="center"
            sx={[
              { px: 2 },
              {
                "&:hover": {
                  padding: 2,
                  borderRadius: 1,
                  color: "white",
                  backgroundColor: "#62B6B7",
                },
              },
            ]}
          >
            Υποβολή προσφοράς & Tokens
          </Typography>
          <Typography
            textAlign="center"
            sx={[
              { px: 2, ml: 75 },
              {
                "&:hover": {
                  padding: 2,
                  borderRadius: 1,
                  color: "white",
                  backgroundColor: "#62B6B7",
                },
              },
            ]}
          >
            Επεξεργασία προφίλ
          </Typography>
          <Typography
            align="center"
            sx={[
              { flexGrow: 1 },
              {
                "&:hover": {
                  textAlign: "center",
                  borderRadius: 1,
                  padding: 2,
                  color: "white",
                  backgroundColor: "#62B6B7",
                },
              },
            ]}
            onClick={e => logout(e)}
          >
            Αποσύνδεση
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
