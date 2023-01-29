import { Box } from "https://cdn.skypack.dev/@mui/system@5.11.5";
import React, { Fragment, useState, useEffect } from "https://cdn.skypack.dev/react@17.0.1";
import { Button, Typography, TextField } from "https://cdn.skypack.dev/@mui/material@5.11.6";
import InputLabel from "https://cdn.skypack.dev/@mui/material@5.11.6";
import MenuItem from "https://cdn.skypack.dev/@mui/material@5.11.6";
import FormControl from "https://cdn.skypack.dev/@mui/material@5.11.6";
import Select from "https://cdn.skypack.dev/@mui/material@5.11.6";
import SaveIcon from "https://cdn.skypack.dev/@mui/icons-material/Save";
import Grid from "https://cdn.skypack.dev/@mui/material@5.11.6";
import Alert from "https://cdn.skypack.dev/@mui/material@5.11.6";
//import React from "https://cdn.skypack.dev/react@17.0.1";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "https://cdn.skypack.dev/chart.js@4.2.0";
import { Line } from "https://cdn.skypack.dev/react-chartjs-2@5.2.0";
import faker from "https://cdn.skypack.dev/faker";

const AdminChart = () => {
    const [offerNum, setOfferNum] = useState(null);
    const [daysNum, setDaysNum] = useState(null);
    
  
//<------------------------ Fetch ---------------------------->
//get the number of offers for a specific day (date)
const getOfferNumber = async (offer_date) => {
    try {
      const response = await fetch(`http://localhost:5000/numOfOffers offerdate=${offer_date}`);
      const getOfferNum = await response.json();
      setOfferNum(getOfferNum);
    } catch (err) {
      console.error(err.message);
    }
  };
  
//how many days the month has
const getDaysNumber = (month) => {
    if (month === 2) {
              const getDaysNum = 28;
              setDaysNum(getDaysNum);
    }else if (month === 4 || month === 6 || month === 9 || month === 11) {
              const getDaysNum = 30;
              setDaysNum(getDaysNum);
    }else {
              const getDaysNum = 31;
              setDaysNum(getDaysNum);
    }
};
  
  useEffect(() => {
    getOfferNumber();
    getDaysNumber(); // ???????? το input ????????
  }, []);
  
//αυτο μηπως θα γινει με usestate?
let labels = [];
const setxAxis = () => {
  for (let i = 1; i <= daysNum; i++) {
    labels.push("Day " + i);
}
    
const data = {
    labels: labels,
    datasets: [{
        label: 'Number of Offers',
        data: [72, 75, 78], // getOfferNumber for EACH day
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
};

const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};
  
const myChart = new Chart("myChart", {
  type: "line",
  data: {data},
  options: {options}
});
  
  
//εδω δεν ξερω τι παιζει αλλα αυτο <canvas id="myChart" style="width:100%;max-width:700px"></canvas> ειναι το τσαρτ
  return(
    <Fragment>
        <Container maxWidth="xl" disableGutters>
            <canvas id="myChart" style="width:100%;max-width:700px"></canvas>

        <Line options={options} data={data} />
        </Container>

    </Fragment>

  )
}

//και αυτο δεν ξερω τι φαση 
 const root = ReactDOM.createRoot(document.getElementById('root')); 
 //const ctx = document.getElementById('myChart').getContext('2d');
 root.render(<AdminChart />);

}
