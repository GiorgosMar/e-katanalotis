import { Container } from "@mui/system";
import React, { Fragment } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AdminNavbar from "./AdminNavbar";

import AdminInsertStore from "./AdminInsertStore";
import AdminEditStores from "./AdminEditStore";
import AdminDeleteStore from "./AdminDeleteStore";

const AdminStores = () => {
  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters sx={{ p: 1 }}>
        <AdminNavbar />
        <Container maxWidth="xl">
          <CssBaseline />
          {/*Προσθήκη*/}
          <AdminInsertStore />
          {/*Επεξεργασία*/}
          <AdminEditStores />
          {/*Διαγραφη*/}
          <AdminDeleteStore />
        </Container>
      </Container>
    </Fragment>
  );
};

export default AdminStores;
