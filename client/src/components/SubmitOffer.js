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
import { useNavigate } from "react-router-dom";

const SubmitOffer = (store) => {
  //useNavigate//
  const navigate = useNavigate();

  //useContext//
  const { openSub, setOpenSub } = useContext(OpenDialog);
  const { userCredentials } = useContext(UserCredentials);

  //parse float//
  const parseFloatData = (string) => {
    let data = null;
    if (string != null && string !== "") {
      data = parseFloat(string);
    } else {
      data = null;
    }
    return data;
  };

  //useStates//
  const [submitOffer, setSubmitOffer] = useState({
    product_id: null,
    store_id: store.store.id,
    initialPrice: null,
    newPrice: null,
    userId: userCredentials.user_id,
    date: null,
  });

  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [returnCategory, setReturnCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [returnSubategory, setReturnSubcategory] = useState(null);

  // <---------------------- Fetch ---------------------->

  //Get categories//
  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/getCategories");
      const getCategories = await response.json();
      setCategories(getCategories);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get subcategories//
  const getSubcategories = async (category) => {
    try {
      const response = await fetch(
        `http://localhost:5000/getSubcategories?parentCategory=${category}`
      );
      const getSubcategories = await response.json();
      setSubcategories(getSubcategories);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get products//
  const getProducts = async (subcategory) => {
    try {
      const response = await fetch(
        `http://localhost:5000/getProductsFromSubcategory?parentSubcategory=${subcategory}`
      );
      const getProducts = await response.json();
      setProducts(getProducts);
    } catch (err) {
      console.error(err.message);
    }
  };

  // <---------------------- Functions ---------------------->

  //Submit form for offer//
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
          } else if (
            getScore.isGoodDealAverage === true &&
            getScore.isGoodDeal === false
          ) {
            setSuccessMessage(
              "Επιτυχής καταχώρηση προσφοράς. Συγχαρητήρια πήρες 20 πόντους!"
            );
          } else if (
            getScore.isGoodDeal === true &&
            getScore.isGoodDealAverage === false
          ) {
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
          setSuccessMessage("Επιτυχής καταχώρηση προσφοράς!");
        }
      }
    } catch (err) {
      setErrorMessage("Κάτι πήγε στραβά!");
    }
  };

  // <---------------------- Handlers ---------------------->

  //handler Open Dialog//
  const handleClickOpen = () => {
    setOpenSub(true);
  };

  //handler Close Dialog//
  const handleClose = () => {
    setOpenSub(false);
  };

  //Get current date//
  const getToday = () => {
    const current = new Date();
    setSubmitOffer({
      ...submitOffer,
      date: current,
    });
  };

  //useEffects//
  useEffect(() => {
    getCategories();
  }, []);

  //useEffects//
  useEffect(() => {
    getSubcategories(returnCategory);
  }, [returnCategory]);

  //useEffects//
  useEffect(() => {
    getProducts(returnSubategory);
  }, [returnSubategory]);

  //useEffects//
  useEffect(() => {
    getToday();
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
            <Box sx={{ minWidth: 120, m: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="Category">Κατηγορία</InputLabel>
                <Select
                  labelId="Category"
                  id="Category"
                  value={categories.category_id}
                  label="Κατηγορία"
                  onChange={(e) => setReturnCategory(e.target.value)}
                >
                  {categories &&
                    categories.map((categoryIndex) => (
                      <MenuItem value={categoryIndex.category_id}>
                        {categoryIndex.category_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120, m: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="Subcategory">Υποκατηγορία</InputLabel>
                <Select
                  labelId="Subcategory"
                  id="Subcategory"
                  value={subcategories.subcategory_id}
                  label="Υποκατηγορία"
                  onChange={(e) => setReturnSubcategory(e.target.value)}
                >
                  {subcategories &&
                    subcategories.map((subcategoryIndex) => (
                      <MenuItem value={subcategoryIndex.subcategory_id}>
                        {subcategoryIndex.subcategory_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120, m: 2 }}>
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
              sx={{ maxWidth: 500, m: 2 }}
              margin="dense"
              id="initialPrice"
              label="Αρχική τιμή"
              type="text"
              variant="outlined"
              value={submitOffer.initialPrice}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setSubmitOffer({
                  ...submitOffer,
                  initialPrice: parseFloatData(e.target.value),
                })
              }
            />
            <TextField
              sx={{ maxWidth: 500, m: 2 }}
              margin="dense"
              id="newPrice"
              label="Tιμή Προσφοράς"
              type="text"
              variant="outlined"
              value={submitOffer.newPrice}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) =>
                setSubmitOffer({
                  ...submitOffer,
                  newPrice: e.target.value,
                })
              }
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
