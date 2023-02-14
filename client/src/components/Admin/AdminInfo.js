import React, { Fragment, useContext, useState } from "react";
import { UserCredentials } from "../UserContext";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import Alert from "@mui/material/Alert";
import AdminNavbar from "./AdminNavbar";
import SaveIcon from "@mui/icons-material/Save";

const AdminInfo = () => {
  //useContext//
  const { userCredentials } = useContext(UserCredentials);

  //useStates//
  const [newUserCreds, setNewUserCreds] = useState({
    newUsername: "",
    newPassword: "",
    newConfPassword: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  //<--------------------------Fecth-------------------------->

  //Update username//
  const updateUsername = async (userId, newUsername, password) => {
    const body = { userId, newUsername, password };
    const updatedUsername = await fetch(
      "http://localhost:5000/updateUsername",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (updatedUsername.status === 404) {
      setSuccessMessage(false);
      setErrorMessage("Λάθος τωρινός κωδικός πρόσβασης!");
    } else {
      setErrorMessage(false);
      setSuccessMessage("Το όνομα χρήστη άλλαξε!");
      initialNewUserCreds();
    }
  };

  //Update password//
  const updatePassword = async (
    userId,
    newPassword,
    newConfPassword,
    password
  ) => {
    const body = { userId, newPassword, newConfPassword, password };
    const updatedPassword = await fetch(
      "http://localhost:5000/updateUserPassword",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (updatedPassword.status === 404) {
      setSuccessMessage(false);
      setErrorMessage("Λάθος τωρινός κωδικός πρόσβασης!");
    } else {
      setErrorMessage(false);
      setSuccessMessage("Ο κωδικός πρόσβασης άλλαξε!");
      initialNewUserCreds();
    }
  };

  //<------------------Functions------------------>

  //initial New user creds//
  const initialNewUserCreds = () => {
    setNewUserCreds({
      newUsername: "",
      newPassword: "",
      newConfPassword: "",
      password: "",
    });
  };

  //Submit form for new user's credentials//
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (
        newUserCreds.newUsername === "" &&
        newUserCreds.newPassword === "" &&
        newUserCreds.newConfPassword === ""
      ) {
        setSuccessMessage(false);
        setErrorMessage("Τα πεδία άδεια!");
      } else if (newUserCreds.password === "") {
        setSuccessMessage(false);
        setErrorMessage("Το πεδίο τωρινού κωδικού είναι κενό!");
      } else if (newUserCreds.password !== "") {
        if (newUserCreds.newUsername === "") {
          updatePassword(
            userCredentials.user_id,
            newUserCreds.newPassword,
            newUserCreds.newConfPassword,
            newUserCreds.password
          );
        } else if (
          newUserCreds.newPassword === "" ||
          newUserCreds.newConfPassword === ""
        ) {
          updateUsername(
            userCredentials.user_id,
            newUserCreds.newUsername,
            newUserCreds.password
          );
        }
      }
    } catch (err) {
      setErrorMessage("Κάτι πήγε στραβά!");
    }
  };

  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters sx={{ p: 1 }}>
        <AdminNavbar />
        <Container maxWidth="xl">
          <CssBaseline />
          <Box
            disableGutters
            sx={{
              ml: 50,
              maxWidth: "sm",
              marginTop: 7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,.5)",
              color: "#fff",
              borderRadius: "10%",
              padding: "20px",
            }}
          >
            <Typography component="h1" variant="h5">
              Ενημέρωση στοιχείων
            </Typography>
            <form onSubmit={onSubmitForm}>
              <Box sx={{ mt: 1 }}>
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
                      opacity: "0.7",
                    },
                  }}
                  margin="normal"
                  color="secondary"
                  fullWidth
                  id="username"
                  label="Εισάγετε νέο όνομα χρήστη"
                  name="username"
                  autoComplete="Όνομα χρήστη"
                  value={newUserCreds.newUsername}
                  autoFocus
                  onChange={(e) =>
                    setNewUserCreds({
                      ...newUserCreds,
                      newUsername: e.target.value,
                    })
                  }
                />
                <TextField
                  inputProps={{
                    style: { fontFamily: "Arial", color: "white" },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Arial",
                      color: "white",
                      opacity: "0.7",
                    },
                  }}
                  style={{ flex: 1, color: "purple" }}
                  margin="normal"
                  color="secondary"
                  fullWidth
                  name="new_password"
                  label="Εισάγετε νέο κωδικό πρόσβασης"
                  type="password"
                  id="new_password"
                  autoComplete="νέος κωδικός πρόσβασης"
                  value={newUserCreds.newPassword}
                  onChange={(e) =>
                    setNewUserCreds({
                      ...newUserCreds,
                      newPassword: e.target.value,
                    })
                  }
                />
                <TextField
                  inputProps={{
                    style: { fontFamily: "Arial", color: "white" },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Arial",
                      color: "white",
                      opacity: "0.7",
                    },
                  }}
                  style={{ flex: 1, color: "purple" }}
                  margin="normal"
                  color="secondary"
                  fullWidth
                  name="conf_password"
                  label="Εισάγετε ξάνα τον νέο κωδικό πρόσβασης"
                  type="password"
                  id="conf_password"
                  autoComplete="Επιβεβαίωση νέου κωδικού πρόσβασης"
                  value={newUserCreds.newConfPassword}
                  onChange={(e) =>
                    setNewUserCreds({
                      ...newUserCreds,
                      newConfPassword: e.target.value,
                    })
                  }
                />
                <TextField
                  inputProps={{
                    style: { fontFamily: "Arial", color: "white" },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Arial",
                      color: "white",
                      opacity: "0.7",
                    },
                  }}
                  style={{ flex: 1, color: "purple" }}
                  margin="normal"
                  color="secondary"
                  fullWidth
                  name="password"
                  label="Εισάγετε τον τωρινό κωδικό πρόσβασης"
                  type="password"
                  id="password"
                  autoComplete="κωδικός πρόσβασης"
                  value={newUserCreds.password}
                  onChange={(e) =>
                    setNewUserCreds({
                      ...newUserCreds,
                      password: e.target.value,
                    })
                  }
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Grid
                    style={{ width: "390px" }}
                    fullWidth
                    sx={{ mt: 3, mb: 2, mr: 3 }}
                  >
                    {errorMessage && (
                      <Alert severity="error"> {errorMessage} </Alert>
                    )}
                    {successMessage && (
                      <Alert severity="success">{successMessage}</Alert>
                    )}
                  </Grid>
                  <Button
                    style={{ width: "150px" }}
                    type="submit"
                    fullWidth
                    color="secondary"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    endIcon={<SaveIcon />}
                  >
                    Αποθήκευση
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Container>
      </Container>
    </Fragment>
  );
};

export default AdminInfo;
