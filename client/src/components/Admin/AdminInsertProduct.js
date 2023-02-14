import { Box } from "@mui/system";
import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";

const AdminInsertProduct = () => {
  //useStates//
  const [categories, setCategories] = useState([]);
  const [returnCategory, setReturnCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [returnSubategory, setReturnSubcategory] = useState(null);

  const [returnInsertProduct, setReturnInsertProduct] = useState("");

  const [insertMessage, setInsertMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  //<------------------------ Fetch ---------------------------->

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

  //Add product//
  const insertProduct = async (productName, category, subcategory) => {
    if (
      returnCategory !== null &&
      returnCategory !== null &&
      returnInsertProduct !== ""
    ) {
      const body = { productName, category, subcategory };
      await fetch("http://localhost:5000/insertProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(
        setErrorMessage(false),
        setInsertMessage("Το προιον έχει εγγραφεί επιτυχώς!")
      );
    } else {
      setErrorMessage("Τα πεδία είναι κενά!");
      setInsertMessage(false);
    }
  };

  //useEffects//
  useEffect(() => {
    getCategories();
  }, []);

  //useEffects//
  useEffect(() => {
    getSubcategories(returnCategory);
  }, [returnCategory]);

  return (
    <Fragment>
      <Box
        disableGutters
        sx={{
          minWidth: 800,
          mx: 10,
          marginBottom: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          backgroundColor: "rgba(0,0,0,.5)",
          color: "#fff",
          borderRadius: "1%",
          padding: "20px",
        }}
      >
        <Typography component="h1" variant="h5">
          Εισαγωγή προιόντος
        </Typography>
        <br />
        <Box
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
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
                color: "black",
                opacity: "0.7",
              },
            }}
            sx={{ minWidth: 120, m: 2 }}
            name="product"
            label="Προιον"
            type="text"
            id="productInsert"
            value={returnInsertProduct}
            onChange={(e) => setReturnInsertProduct(e.target.value)}
          />
        </Box>
        <Grid
          sx={{
            ml: 50,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Grid style={{ width: "500px" }} fullWidth sx={{ mr: 20 }}>
              {insertMessage && (
                <Alert severity="success">{insertMessage}</Alert>
              )}
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Grid>
            <Button
              size="medium"
              type="submit"
              color="success"
              variant="contained"
              sx={{ m: 2, ml: 3 }}
              endIcon={<AddIcon />}
              onClick={() =>
                insertProduct(
                  returnInsertProduct,
                  returnCategory,
                  returnSubategory
                )
              }
            >
              Προσθήκη
            </Button>
          </Box>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default AdminInsertProduct;
