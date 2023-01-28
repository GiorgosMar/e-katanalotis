import React, { Fragment, useContext, useState, useEffect } from "react";
import { UserCredentials } from "./UserContext";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import "../css/styles.css";
import Navbar from "./Navbar";
import SaveIcon from "@mui/icons-material/Save";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const theme = createTheme();

const InfoUser = () => {
  //useContext
  const { userCredentials } = useContext(UserCredentials);

  //useState
  const [newUserCreds, setNewUserCreds] = useState({
    newUsername: "",
    newPassword: "",
    newConfPassword: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [userStats, setUserStats] = useState([]);

  //<--------------------------Fecth-------------------------->

  //Update username
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
      setErrorMessage("Λάθος τωρινός κωδικός πρόσβασης!");
    } else {
      setErrorMessage(false);
      setSuccessMessage("Το όνομα χρήστη άλλαξε!");
      initialNewUserCreds();
    }
  };

  //Update password
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
      setErrorMessage("Λάθος τωρινός κωδικός πρόσβασης!");
    } else {
      setErrorMessage(false);
      setSuccessMessage("Ο κωδικός πρόσβασης άλλαξε!");
      initialNewUserCreds();
    }
  };

  //User Stats
  const getUserStats = async () => {
    try {
      const getUserStats = await fetch(
        `http://localhost:5000/showStats?userid=${userCredentials.user_id}`
      );
      const userStats = await getUserStats.json();
      setUserStats(userStats);
    } catch (err) {
      console.error(err.message);
    }
  };

  //<------------------Functions------------------>

  //initial New user creds
  const initialNewUserCreds = () => {
    setNewUserCreds({
      newUsername: "",
      newPassword: "",
      newConfPassword: "",
      password: "",
    });
  };

  //Submit form for new user's credentials
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (
        newUserCreds.newUsername === "" &&
        newUserCreds.newPassword === "" &&
        newUserCreds.newConfPassword === "" &&
        newUserCreds.password === ""
      ) {
        setSuccessMessage(false);
        setErrorMessage("Τα πεδία άδεια!");
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

  //format date
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA");
  };

  //useEffect
  useEffect(() => {
    getUserStats();
  }, []);

  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters sx={{ p: 1 }}>
        <Fragment>
          <Navbar />
          <ThemeProvider theme={theme}>
            <Container maxWidth="xl" disableGutters>
              <CssBaseline />
              <Box
                component="span"
                mx={10}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Για στοιχεια χρηστη */}
                <Box
                  disableGutters
                  mb={1}
                  sx={{
                    maxWidth: "sm",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,.5)",
                    color: "#fff",
                    borderRadius: "2%",
                    padding: "20px",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    Στατιστικά χρήστη
                  </Typography>
                  {/*Πληροφορια*/}
                  Αντιδράσεις
                  {userStats.reactions && (
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Όνομα προιόντος</TableCell>
                            <TableCell align="center">Ημερομηνία</TableCell>
                            <TableCell align="center">Αντίδραση</TableCell>
                            <TableCell align="center">
                              Όνομα καταστήματος
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userStats.reactions &&
                            userStats.reactions.map((index) => (
                              <TableRow
                                key={index.product_name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {index.product_name}
                                </TableCell>
                                <TableCell align="center">
                                  {getFormattedDate(index.react_date)}
                                </TableCell>
                                <TableCell align="center">
                                  {index.r_type === true
                                    ? "Μου αρέσει"
                                    : "Δεν μου αρέσει"}
                                </TableCell>
                                <TableCell align="center">
                                  {index.name}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <br />
                  {/* offer του χρηστη */}
                  Οι προσφορές μου
                  {userStats.offers && (
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 400 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Όνομα προιόντος</TableCell>
                            <TableCell align="center">Ημερομηνία</TableCell>
                            <TableCell align="center">Μου αρέσει</TableCell>
                            <TableCell align="center">Δεν μου αρέσει</TableCell>
                            <TableCell align="center">
                              Όνομα καταστήματος
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userStats.offers &&
                            userStats.offers.map((offerIndex) => (
                              <TableRow
                                key={offerIndex.product_name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {offerIndex.product_name}
                                </TableCell>
                                <TableCell align="center">
                                  {getFormattedDate(offerIndex.entry_date)}
                                </TableCell>
                                <TableCell align="center">
                                  {offerIndex.likes}
                                </TableCell>
                                <TableCell align="center">
                                  {offerIndex.dislikes}
                                </TableCell>
                                <TableCell align="center">
                                  {offerIndex.name}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
                <Box
                  disableGutters
                  justify-content="normal"
                  sx={{
                    maxWidth: "sm",
                    marginTop: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "white",
                    color: "#fff",
                    borderRadius: "2%",
                    padding: "20px",
                  }}
                >
                  <Box
                    disableGutters
                    sx={{
                      minWidth: 600,
                      mb: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,.5)",
                      color: "#fff",
                      borderRadius: "1%",
                      padding: "20px",
                    }}
                  >
                    <Typography component="h1" variant="h5">
                      Tokens
                    </Typography>
                    {userStats.tokens && userStats.tokens.length === 0 ? (
                      <p>{"0"}</p>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table
                          fullWidth
                          sx={{ minWidth: 560 }}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Συνολικό Σκορ</TableCell>
                              <TableCell align="center">Σκορ μήνα</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userStats.tokens &&
                              userStats.tokens.map((tokensIndex) => (
                                <TableRow
                                  key={tokensIndex.total_tokens}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {tokensIndex.total_tokens}
                                  </TableCell>
                                  <TableCell align="center">
                                    {tokensIndex.num_tokens_entered}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                  <Box
                    disableGutters
                    sx={{
                      maxWidth: "sm",
                      mb: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,.5)",
                      color: "#fff",
                      borderRadius: "1%",
                      padding: "20px",
                    }}
                  >
                    <Typography component="h1" variant="h5">
                      Σκορ χρήστη
                    </Typography>
                    <br />
                    {userStats.score && (
                      <TableContainer component={Paper}>
                        <Table
                          fullWidth
                          sx={{ minWidth: 560 }}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Συνολικό Σκορ</TableCell>
                              <TableCell align="center">Σκορ μήνα</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userStats.score &&
                              userStats.score.map((scoreIndex) => (
                                <TableRow
                                  key={scoreIndex.score}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {scoreIndex.score}
                                  </TableCell>
                                  <TableCell align="center">
                                    {scoreIndex.score_month}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                  <Box
                    disableGutters
                    sx={{
                      maxWidth: "sm",
                      marginTop: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,.5)",
                      color: "#fff",
                      borderRadius: "2%",
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
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Fragment>
      </Container>
    </Fragment>
  );
};

export default InfoUser;
