import React, { Fragment, useState } from "react";
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

const Register = () => {
  //useStates//
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    conf_password: "",
  });
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  //inputs
  const { username, email, password, conf_password } = inputs;

  //Submit form for registration//
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { username, email, password, conf_password };
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setSuccessMessage("Επιτυχής εγγραφή!");
      }
      if (parseRes === "User already exist!") {
        setErrorMessage("Ο χρήστης υπάρχει ήδη!");
      } else if (parseRes === "Missing Credentials") {
        setErrorMessage("Τα πεδία είναι κενά!");
      } else if (parseRes === "Invalid Email") {
        setErrorMessage("Λάθος email!");
      } else if (parseRes === "Οι κωδικοί δεν ταιριάζουν") {
        setErrorMessage("Οι κωδικοί δεν ταιριάζουν");
      } else if (parseRes === "Λάθος κωδίκος") {
        setErrorMessage("Λάθος κωδίκος");
      } else {
        setErrorMessage(null);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <Container disableGutters maxWidth="xl" className="out-box">
        <div className="background-image">
          <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
              <CssBaseline />
              <Box
                disableGutters
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
                  Εγγραφή
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
                      style: { fontFamily: "Arial", color: "white", opacity: "0.7"},
                    }}
                    required
                    fullWidth
                    name="username"
                    label="Όνομα χρήστη"
                    type="username"
                    id="username"
                    value={inputs.username}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        username: e.target.value,
                      })
                    }
                  />
                  <TextField
                    inputProps={{
                      style: {
                        fontFamily: "Arial",
                        color: "white",
                        outlineColor: "white",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        fontFamily: "Arial",
                        color: "white",
                        opacity: "0.7"
                      },
                    }}
                    required
                    fullWidth
                    id="email"
                    label="Email χρήστη"
                    name="email"
                    value={inputs.email}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        email: e.target.value,
                      })
                    }
                    autoComplete="email"
                  />

                  <TextField
                    inputProps={{
                      style: {
                        fontFamily: "Arial",
                        color: "white",
                        outlineColor: "white",
                      },
                    }}
                    InputLabelProps={{
                      style: { fontFamily: "Arial", color: "white", opacity: "0.7"},
                    }}
                    required
                    fullWidth
                    name="password"
                    label="Κωδικός πρόσβασης"
                    type="password"
                    id="password"
                    value={inputs.password}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        password: e.target.value,
                      })
                    }
                    autoComplete="new-password"
                  />

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
                    required
                    fullWidth
                    name="conf_password"
                    label="Επιβεβαίωση κωδικού πρόσβασης"
                    type="password"
                    id="conf_password"
                    value={inputs.conf_password}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        conf_password: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    color="secondary"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Εγγραφή
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link color={"secondary"} href="/login" variant="body2">
                        {"Έχεις ήδη λογαρισμό; Κάνε σύνδεση!"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Grid>
                {errorMessage && (
                  <Alert severity="error"> {errorMessage} </Alert>
                )}
                {successMessage && (
                  <Alert severity="success">{successMessage}</Alert>
                )}
              </Grid>
              <Copyright sx={{ mt: 9, mb: 4 }} />
            </Container>
          </ThemeProvider>
        </div>
      </Container>
    </Fragment>
  );
};

export default Register;
