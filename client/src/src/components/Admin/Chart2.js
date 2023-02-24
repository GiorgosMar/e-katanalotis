import React, { Fragment, useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/system";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Typography from "@material-ui/core/Typography";
import Button from "@mui/material/Button";

const Chart2 = () => {
  //useStates//
  const [returnMonth, setReturnMonth] = useState(null);
  const [returnYear, setReturnYear] = useState(null);

  const [categories, setCategories] = useState([]);
  const [returnCategory, setReturnCategory] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [returnSubategory, setReturnSubcategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [countPages, setCountPages] = useState();
  const [disableNextButton, setDisableNextButton] = useState(false);
  const [disablePrevButton, setDisablePrevButton] = useState(false);
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

  //handler next page//
  const handlerNextPage = () => {
    if (currentPage < countPages) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
    }
  };

  //handler next button//
  const handlerNextButton = () => {
    if (currentPage >= countPages) {
      setDisableNextButton(true);
    } else {
      setDisableNextButton(false);
    }
  };

  //handler prev page//
  const handlerPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage - 1);
    }
  };

  //handler prev button//
  const handlerPrevButton = () => {
    if (currentPage == 1) {
      setDisablePrevButton(true);
    } else {
      setDisablePrevButton(false);
    }
  };

  //get data//
  const getData = async (month, year) => {
    try {
      if (year !== null && month !== null && returnCategory !== null) {
        const response = await fetch(
          `http://localhost:5000/getProductOffersFromCategories?month=${month}&year=${year}&page=${currentPage}&categoryId=${returnCategory}`
        );
        const data = await response.json();
        if (response.status === 200) {
          setErrorMessage(false);
          setChartData({
            ...chartData,
            datasets: [
              {
                ...chartData.datasets[0],
                data: data.dataformchart,
              },
            ],
          });
          getDays(month, year);
          setCountPages(data.countPages);
        } else if (response.status === 400) {
          initialChart();
          setErrorMessage("Error message!");
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  //get categories//
  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/getCategories");
      const getCategories = await response.json();
      setCategories(getCategories);
    } catch (err) {
      console.error(err.message);
    }
  };

  //get subcategories//
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

  //useEffect second chart//
  useEffect(() => {
    getData(returnMonth, returnYear);
    handlerNextButton();
  }, [currentPage, returnYear, returnMonth, returnCategory]);

  //useEffects//
  useEffect(() => {
    handlerNextButton();
    handlerPrevButton();
  }, [chartData.datasets.data]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getSubcategories(returnCategory);
  }, [returnCategory]);

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ minWidth: 150, m: 2 }}>
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
        <Box sx={{ minWidth: 150, m: 2 }}>
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
        <Box sx={{ minWidth: 150, m: 2 }}>
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
        <Box sx={{ minWidth: 150, m: 2 }}>
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
            text: "Monthly Sales",
            fontSize: 25,
          },

          legend: {
            display: true,
            position: "top",
          },
        }}
      />
      <Typography align="right">
        <span>Σελίδα {currentPage}η</span>
        <Button
          disabled={disablePrevButton}
          variant="raised"
          style={{ backgroundColor: "transparent" }}
          onClick={() => handlerPrevPage()}
        >
          <NavigateBeforeIcon />
        </Button>
        <Button
          disabled={disableNextButton}
          variant="raised"
          style={{ backgroundColor: "transparent" }}
          onClick={() => handlerNextPage()}
        >
          <NavigateNextIcon />
        </Button>
      </Typography>
    </Fragment>
  );
};

export default Chart2;
