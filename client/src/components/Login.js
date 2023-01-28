import React, { Fragment, useContext, useState, useEffect } from "react";
import { UserContext, UserCredentials } from "./UserContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import "../css/styles.css";



function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Login = () => {
  const { setIsAuthenticated } = useContext(UserContext);
  const { setRole } = useContext(UserContext);
  const { setUserCredentials } = useContext(UserCredentials);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState();
  const { email, password } = inputs;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      console.log(parseRes);

      if (parseRes === "Λάθος στοιχεία!") {
        setErrorMessage("Λάθος στοιχεία!");
      } else if (parseRes === "Missing Credentials") {
        setErrorMessage("Συμπληρώστε τα πεδία!");
      } else if (parseRes === "Invalid Email") {
        setErrorMessage("Λάθος email!");
      } else if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setIsAuthenticated(true);
        setRole(parseRes.user_credentials.user_role);
        setUserCredentials(parseRes.user_credentials);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };



  return (
    <Fragment>
      <Container disableGutters={true} maxWidth="xl" className="out-box">
        <div className="background-image">
          <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
              <CssBaseline />
              <Box
                disableGutters={true}
                sx={{
                  marginTop: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,.5)",
                  color: "#fff",
                  borderRadius: "10%",
                  padding: "20px",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Είσοδος
                </Typography>
                <Box
                  component="form"
                  onSubmit={onSubmitForm}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    inputProps={{
                      style: {
                        fontFamily: "Arial",
                        color: "white",
                        outlineColor: "white",
                      },
                    }}
                    InputLabelProps={{
                      style: { fontFamily: "Arial", color: "white", opacity: "0.7" },
                    }}
                    margin="normal"
                    color="secondary"
                    required
                    fullWidth
                    id="email"
                    label="Εισάγετε Email"
                    name="email"
                    autoComplete="email"
                    value={inputs.email}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        email: e.target.value,
                      })
                    }
                    autoFocus
                  />
                  <TextField
                    inputProps={{
                      style: { fontFamily: "Arial", color: "white" },
                    }}
                    InputLabelProps={{
                      style: { fontFamily: "Arial", color: "white" , opacity: "0.7"},
                    }}
                    style={{ flex: 1, margin: "0 20px 0 0", color: "purple" }}
                    margin="normal"
                    color="secondary"
                    required
                    fullWidth
                    name="password"
                    label="Εισάγετε κωδικό"
                    type="password"
                    id="password"
                    value={inputs.password}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        password: e.target.value,
                      })
                    }
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    color="secondary"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Σύνδεση
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link
                        color={"secondary"}
                        href="/register"
                        variant="body2"
                      >
                        {"Δεν έχεις λογαρισμό; Κάνε εγγραφή!"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Grid>
                {errorMessage && (
                  <Alert severity="error"> {errorMessage} </Alert>
                )}
              </Grid>
              <Copyright sx={{ mt: 20, mb: 4 }} />
            </Container>
          </ThemeProvider>
        </div>
      </Container>
    </Fragment>
  );
};
export default Login;
