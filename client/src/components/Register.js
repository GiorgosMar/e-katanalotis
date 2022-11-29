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
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";


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
  //navigate//
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    conf_password: "",
  });
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const { username, email, password, conf_password } = inputs;

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
        //navigate("/login");
      } 
      if (parseRes === "User already exist!") {
        setErrorMessage("User already exist!");
      } else if (parseRes === "Missing Credentials") {
        setErrorMessage("Missing Credentials");
      } else if (parseRes === "Invalid Email") {
        setErrorMessage("Invalid Email");
      } else if (parseRes === "Οι κωδικοί δεν ταιριάζουν") {
        setErrorMessage("Οι κωδικοί δεν ταιριάζουν");
      } else if (parseRes === "Λάθος κωδίκος") {
        setErrorMessage("Λάθος κωδίκος");
      }else{
        setErrorMessage(null);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={onSubmitForm}
              noValidate
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="name"
                    label="Username"
                    value={inputs.username}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        username: e.target.value
                      })
                    }
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={inputs.email}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        email: e.target.value
                      })
                    }
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={inputs.password}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        password: e.target.value
                      })
                    }
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="conf_password"
                    label="Confirm Password"
                    type="password"
                    id="conf_password"
                    value={inputs.conf_password}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        conf_password: e.target.value
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Grid>
            {errorMessage && <Alert severity="error"> {errorMessage} </Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
          </Grid>
          <Copyright sx={{ mt: 20 }} />
        </Container>
      </ThemeProvider>
      {console.log(inputs)}
    </Fragment>
  );
};

export default Register;
