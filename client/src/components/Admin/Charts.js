import React, { Fragment } from "react";
import { Container } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";

import AdminNavbar from "./AdminNavbar";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";

const Charts = () => {
  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters sx={{ p: 1 }}>
        <AdminNavbar />
        <CssBaseline />
        <Container maxWidth="md">
          {/* Bar Chart 1 */}
          <Chart1 />
          {/* Bar Chart 2 
          <Chart2 />*/}
        </Container>
      </Container>
    </Fragment>
  );
};

export default Charts;
