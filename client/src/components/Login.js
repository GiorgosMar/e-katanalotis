import React, { Fragment, useContext, useState } from "react";
import { UserContext } from "./UserContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Login = () => {
  const { setIsAuthenticated } = useContext(UserContext);
  const { setRole } = useContext(UserContext);
  const [check, setCheck] = useState(false);

  const isDesktop = useMediaQuery("(min-width:1280px)");

  return (
    <Fragment>
      <div
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "../images/bg.png"})`,
          backgroundRepeat: "no-repeat",
          width: "250px",
        }}
      >
        {/*<Dialog open={true}>
          <Grid style={{ display: "flex", justifyContent: "center" }}>
            <DialogContent>
              <Typography variant="h5" align="center" marginBottom="30px">
                Login
              </Typography>
              {isDesktop ? (
                <>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="email"
                    type="email"
                  >
                    Email
                  </TextField>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="password"
                    type="password"
                  >
                    Password
                  </TextField>
                </>
              ) : (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="email"
                  type="email"
                >
                  Email
                </TextField>
              )}
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => setIsAuthenticated(true) + setRole(0)}
                >
                  Authenticate
                </Button>
                <Button variant="contained" onClick={() => setCheck(!check)}>
                  Check
                </Button>
              </DialogActions>
            </DialogContent>
          </Grid>
              </Dialog>*/}
      </div>
    </Fragment>
  );
};

export default Login;
