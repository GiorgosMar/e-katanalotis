import { Box, Container } from "@mui/system";
import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography, TextField } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import AdminNavbar from "./AdminNavbar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";

const AdminProducts = () => {
  //useState
  const [categories, setCategories] = useState([]);
  const [returnCategory, setReturnCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [returnSubategory, setReturnSubcategory] = useState(null);

  const [products, setProducts] = useState([]);
  const [returnProduct, setReturnProduct] = useState(null);
  const [returnInsertProduct, setReturnInsertProduct] = useState(null);

  const [deleteMessage, setDeleteMessage] = useState(false);
  const [insertMessage, setInsertMessage] = useState(false);

  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/getCategories");
      const getCategories = await response.json();
      setCategories(getCategories);
    } catch (err) {
      console.error(err.message);
    }
  };

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

  const deleteProduct = async (productid) => {
    try {
      await fetch(
        `http://localhost:5000/deleteProduct?productId=${productid}`,
        {
          method: "DELETE",
        }
      );
      setDeleteMessage("Το προιον έχει διαγραφεί επιτυχώς!");
    } catch (err) {
      console.error(err.message);
    }
  };

  const insertProduct = async (productName, category, subcategory) => {
    const body = { productName, category, subcategory };
    await fetch("http://localhost:5000/insertProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setInsertMessage("Το προιον έχει εγγραφεί επιτυχώς!");
  };

  //useEffects
  useEffect(() => {
    getCategories();
  }, []);

  //useEffects
  useEffect(() => {
    getSubcategories(returnCategory);
  }, [returnCategory]);

  //useEffects
  useEffect(() => {
    getProducts(returnSubategory);
  }, [returnSubategory]);

  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters sx={{ p: 1 }}>
        <AdminNavbar />
        <Container maxWidth="lg">
        <CssBaseline />
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
                required
                name="product"
                label="Προιον"
                type="text"
                id="product"
                value={returnInsertProduct}
                onChange={(e) => setReturnInsertProduct(e.target.value)}
              />
              <Button
                size="medium"
                type="submit"
                color="warning"
                variant="contained"
                sx={{ m: 2, ml: 3 }}
                endIcon={<AddIcon />}
                onClick={() => insertProduct(returnInsertProduct, returnCategory, returnSubategory)}
              >
                Υποβολή
              </Button>
            </Box>
            <Grid
              style={{ width: "390px" }}
              fullWidth
              sx={{ mt: 3, mb: 2, mr: 3 }}
            >
              {insertMessage && (
                <Alert severity="success">{insertMessage}</Alert>
              )}
            </Grid>
          </Box>
          <Box
            disableGutters
            sx={{
              minWidth: 800,
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
                    value={categories.category_name}
                    label="Κατηγορία"
                    onChange={(e) => setReturnCategory(e.target.value)}
                  >
                    {categories &&
                      categories.map((categoryIndex) => (
                        <MenuItem value={categoryIndex.category_name}>
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
            <Grid
              style={{ width: "390px" }}
              fullWidth
              sx={{ mt: 3, mb: 2, mr: 3 }}
            >
              {deleteMessage && (
                <Alert severity="success">{deleteMessage}</Alert>
              )}
            </Grid>
          </Box>
        </Container>
      </Container>
    </Fragment>
  );
};

export default AdminProducts;
