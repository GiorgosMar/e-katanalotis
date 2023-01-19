import React, { Fragment, useContext, useState, useEffect } from "react";
import { UserCredentials, OpenDialog } from "./UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { Container } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";

const SubmitOffer = (store) => {
  //useNavigate
  const navigate = useNavigate();

  //useContext
  const { openSub, setOpenSub } = useContext(OpenDialog);
  const { userCredentials } = useContext(UserCredentials);

  //useStates//
  const [submitOffer, setSubmitOffer] = useState({
    product_id: null,
    store_id: store.store.id,
    initialPrice: null,
    newPrice: null,
    userId: userCredentials.user_id,
    date: null,
  });
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const getProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/productsForSubmitOffer"
      );
      const getOfferProducts = await response.json();
      setProducts(getOfferProducts);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = submitOffer;
      const addOffer = await fetch("http://localhost:5000/addOffer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const offerStatus = await addOffer.json();
      if (offerStatus === "Bad offer") {
        setErrorMessage("Η προσφαρά υπάρχει ήδη!");
      } else {
        const setScore = await fetch(
          "http://localhost:5000/updateUserScoreOnNewOffer",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
        const getScore = await setScore.json();
        console.log(getScore.message);
        if (setScore.status === 200) {
          if (
            getScore.isGoodDeal === true &&
            getScore.isGoodDealAverage === true
          ) {
            setSuccessMessage(
              "Επιτυχής καταχώρηση προσφοράς. Συγχαρητήρια πήρες 70 πόντους!"
            );
          } else if (setScore.isGoodDealAverage === true && getScore.isGoodDeal === false ) {
            setSuccessMessage(
              "Επιτυχής καταχώρηση προσφοράς. Συγχαρητήρια πήρες 20 πόντους!"
            );
          } else if (getScore.isGoodDeal === true && getScore.isGoodDealAverage === false) {
            setSuccessMessage(
              "Επιτυχής καταχώρηση προσφοράς. Συγχαρητήρια πήρες 50 πόντους!"
            );
          } else {
            setSuccessMessage(
              "Επιτυχής καταχώρηση προσφοράς. Πήρες 0 πόντους!"
            );
          }
        } else if (setScore.status === 404) {
          setErrorMessage("Δεν υπάρχει ιστορικό τίμων για αυτό το προιον!");
        }
      }
    } catch (err) {
      setErrorMessage("Κάτι πήγε στραβά!");
    }
  };

  const handleClickOpen = () => {
    setOpenSub(true);
  };

  const handleClose = () => {
    setOpenSub(false);
  };

  //format date
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA");
  };

  //useEffects
  useEffect(() => {
    getProducts();
    console.log(submitOffer);
  }, []);

  return (
    <Fragment>
      <Button
        size="small"
        variant="outlined"
        sx={{ height: 40 }}
        onClick={handleClickOpen}
      >
        Υποβόλη Προσφοράς
      </Button>
      <Dialog
        maxWidth="400"
        open={openSub}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle align="center">Υποβολή Προσφοράς</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{ minWidth: 120 }}>
              <FormControl
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              >
                <InputLabel id="demo-simple-select-label">Προιον</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={submitOffer.product_id}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Προιον"
                  onChange={(e) =>
                    setSubmitOffer({
                      ...submitOffer,
                      product_id: e.target.value,
                    })
                  }
                >
                  {products &&
                    products.map((product) => (
                      <MenuItem value={product.product_id}>
                        {product.product_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              margin="dense"
              id="initialPrice"
              label="Αρχική τιμή"
              type="text"
              fullWidth
              variant="outlined"
              value={submitOffer.initialPrice}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setSubmitOffer({
                  ...submitOffer,
                  initialPrice: parseFloat(e.target.value),
                })
              }
            />
            <TextField
              margin="dense"
              id="newPrice"
              label="Tιμή Προσφοράς"
              type="text"
              fullWidth
              variant="outlined"
              value={submitOffer.newPrice}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setSubmitOffer({
                  ...submitOffer,
                  newPrice: parseFloat(e.target.value),
                })
              }
            />
            <DatePicker
              inputFormat="dd/MM/yyyy"
              label="Ημερομηνία Προσφοράς"
              value={new Date(submitOffer.date)}
              onChange={(formatDate) => {
                setSubmitOffer({
                  ...submitOffer,
                  date: getFormattedDate(formatDate),
                });
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </DialogContentText>
        </DialogContent>
        <Container>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Container>
        <DialogActions>
          <Button onClick={() => navigate("/")} autoFocus color="error">
            Έξοδος
          </Button>
          <Button autoFocus onClick={onSubmitForm} color="success">
            Υποβολή
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default SubmitOffer;
