import React, { Fragment, useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";

import AdminNavbar from "./AdminNavbar";

const AdminLeaderboard = () => {
  //useState//
  const [leaderboard, setLeaderboard] = useState([]);

  //User Stats//
  const getLeaderboard = async () => {
    try {
      const getLeaderboard = await fetch(
        "http://localhost:5000/userLeaderBoard"
      );
      const leaderboard = await getLeaderboard.json();
      setLeaderboard(leaderboard);
    } catch (err) {
      console.error(err.message);
    }
  };

  //useEffect//
  useEffect(() => {
    getLeaderboard();
  }, []);

  console.log(leaderboard);

  return (
    <Fragment>
      <Container maxWidth="xl" disableGutters>
        <AdminNavbar />
        <Box
          disableGutters
          mb={1}
          sx={{
            maxWidth: "lg",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.5)",
            color: "#fff",
            borderRadius: "0.5%",
            padding: "20px",
            ml: 18,
          }}
        >
          <Typography component="h1" variant="h5">
            Πίνακας βαθμολογίας
          </Typography>
          <br />
          <TableContainer component={Paper}>
            <Table fullWidth sx={{ minWidth: 560 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Όνομα χρήστη</TableCell>
                  <TableCell align="center">Συνολικό σκορ</TableCell>
                  <TableCell align="center">Συνολικά Tokens</TableCell>
                  <TableCell align="center">Tokens προηγούμενου μήνα</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard &&
                  leaderboard.map((leaderboardIndex) => (
                    <TableRow
                      key={leaderboardIndex.user_name}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {leaderboardIndex.user_name}
                      </TableCell>
                      <TableCell align="center">
                        {leaderboardIndex.score}
                      </TableCell>
                      <TableCell align="center">
                        {leaderboardIndex.total_tokens === null
                          ? 0
                          : leaderboardIndex.total_tokens}
                      </TableCell>
                      <TableCell align="center">
                        {leaderboardIndex.latest_num_tokens_entered === null
                          ? 0
                          : String(leaderboardIndex.latest_num_tokens_entered)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Fragment>
  );
};

export default AdminLeaderboard;
