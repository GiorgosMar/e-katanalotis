import { Box } from "@mui/system";
import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminDeleteProduct = () => {
  //useStates
  const [categories, setCategories] = useState([]);
  const [returnCategory, setReturnCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [returnSubategory, setReturnSubcategory] = useState(null);

  const [products, setProducts] = useState([]);
  const [returnProduct, setReturnProduct] = useState(null);

  const [deleteMessage, setDeleteMessage] = useState(false);
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

  //Delete product//
  const deleteProduct = async (productid) => {
    try {
      if (
        returnCategory !== null &&
        returnCategory !== null &&
        returnProduct !== null
      ) {
        await fetch(
          `http://localhost:5000/deleteProduct?productId=${productid}`,
          {
            method: "DELETE",
          }
        ).then(
          setErrorMessage(false),
          setDeleteMessage("Το προιον έχει διαγραφεί επιτυχώς!")
        );
      } else {
        setErrorMessage("Τα πεδία είναι κενά!");
        setDeleteMessage(false);
      }
    } catch (err) {
      console.error(err.message);
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

  //useEffects//
  useEffect(() => {
    getProducts(returnSubategory);
  }, [returnSubategory]);

  return (
    <Fragment>
      <Box
        disableGutters
        sx={{
          minWidth: 1000,
          mx: 10,
          marginTop: 0,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "flex-start",
          backgroundColor: "rgba(0,0,0,.5)",
          color: "#fff",
          borderRadius: "1%",
          padding: "20px",
          flexGrow: 1,
        }}
      >
        <Typography component="h1" variant="h5">
          Διαγραφή προιόντος
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
          <Box sx={{ minWidth: 120, m: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="product">Προιοντα</InputLabel>
              <Select
                labelId="product"
                id="product"
                value={products.product_id}
                label="Προιοντα"
                onChange={(e) => setReturnProduct(e.target.value)}
              >
                {products &&
                  products.map((productIndex) => (
                    <MenuItem value={productIndex.product_id}>
                      {productIndex.product_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
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
              {deleteMessage && (
                <Alert severity="success">{deleteMessage}</Alert>
              )}
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Grid>
            <Button
              size="medium"
              type="submit"
              color="error"
              variant="contained"
              sx={{ m: 2, ml: 3 }}
              endIcon={<DeleteIcon />}
              onClick={() => deleteProduct(returnProduct)}
            >
              Διαγραφή
            </Button>
          </Box>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default AdminDeleteProduct;
