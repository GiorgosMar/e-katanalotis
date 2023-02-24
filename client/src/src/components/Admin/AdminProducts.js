import React, { Fragment } from "react";
import { Container } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";
import AdminNavbar from "./AdminNavbar";

import AdminDeleteProduct from "./AdminDeleteProduct";
import AdminInsertProduct from "./AdminInsertProduct";

const AdminProducts = () => {
  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters sx={{ p: 1 }}>
        <AdminNavbar />
        <Container maxWidth="xl">
          <CssBaseline />
          {/*Προσθήκη*/}
          <AdminInsertProduct />
          {/*Διαγραφή*/}
          <AdminDeleteProduct />
        </Container>
      </Container>
    </Fragment>
  );
};

export default AdminProducts;
