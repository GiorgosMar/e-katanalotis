import React, { Fragment, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/system";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

const Chart1 = () => {
  //useStates//
  const [returnMonth, setReturnMonth] = useState(null);
  const [returnYear, setReturnYear] = useState(null);

  const [errorMessage, setErrorMessage] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Προσφορές",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
      },
    ],
  });

  //Αρχικοποίηση Chart//
  const initialChart = () => {
    setChartData({
      datasets: [
        {
          label: "Προσφορές",
          data: "",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 1,
        },
      ],
    });
  };

  //Get offers//
  const getOffers = async (month, year) => {
    try {
      if (year !== null && month !== null) {
        const response = await fetch(
          `http://localhost:5000/numOfOffers?month=${month}&year=${year}`
        );
        const offers = await response.json();
        if (response.status === 200) {
          setErrorMessage(false);
          setChartData({
            ...chartData,
            datasets: [
              {
                ...chartData.datasets[0],
                data: offers,
              },
            ],
          });
          getDays(month, year);
        } else if (response.status === 400) {
          initialChart();
          setErrorMessage(
            "Δεν υπάρχουν προσφορές για αυτόν τον μήνα και αυτό το έτος!"
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  //Get days//
  const getDays = (month, year) => {
    if (year !== null && month !== null) {
      if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        setChartData({
          ...chartData,
          labels: Array.from({ length: 31 }, (_, i) => i + 1),
        });
      } else if (month === 2 && year % 4 !== 0) {
        setChartData({
          ...chartData,
          labels: Array.from({ length: 28 }, (_, i) => i + 1),
        });
      } else if (month === 2) {
        setChartData({
          ...chartData,
          labels: Array.from({ length: 29 }, (_, i) => i + 1),
        });
      } else {
        setChartData({
          ...chartData,
          labels: Array.from({ length: 30 }, (_, i) => i + 1),
        });
      }
    }
  };

  //useEffects//
  useEffect(() => {
    getOffers(returnMonth, returnYear);
  }, [returnMonth, returnYear]);

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ minWidth: 200, m: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="month">Μήνας</InputLabel>
            <Select
              labelId="month"
              id="month"
              value={returnMonth}
              label="Μήνας"
              onChange={(e) => setReturnMonth(e.target.value)}
            >
              <MenuItem value={1}>Ιανουάριος</MenuItem>
              <MenuItem value={2}>Φεβρουάριος</MenuItem>
              <MenuItem value={3}>Μάρτιος</MenuItem>
              <MenuItem value={4}>Απρίλιος</MenuItem>
              <MenuItem value={5}>Μάιος</MenuItem>
              <MenuItem value={6}>Ιούνιος</MenuItem>
              <MenuItem value={7}>Ιούλιος</MenuItem>
              <MenuItem value={8}>Αύγουστος</MenuItem>
              <MenuItem value={9}>Σεπτέμβριος</MenuItem>
              <MenuItem value={10}>Οκτώβριος</MenuItem>
              <MenuItem value={11}>Νοέμβριος</MenuItem>
              <MenuItem value={12}>Δεκέμβριος</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 200, m: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="year">Έτος</InputLabel>
            <Select
              labelId="year"
              id="year"
              value={returnYear}
              label="Χρόνος"
              onChange={(e) => setReturnYear(e.target.value)}
            >
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Grid style={{ width: "500px" }} fullWidth sx={{ ml: 21 }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Grid>
      <Bar
        data={chartData}
        maxWidth={400}
        options={{
          title: {
            display: true,
            text: "Μηνιαίες προσφορές",
            fontSize: 25,
          },

          legend: {
            display: true,
            position: "top",
          },
        }}
      />
    </Fragment>
  );
};

export default Chart1;
