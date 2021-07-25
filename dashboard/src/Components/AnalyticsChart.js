import React,{useContext,useState,useEffect} from "react";
import {AppContext} from "../AppContainer";
import { Chart } from "react-google-charts";
import CircularProgress from '@material-ui/core/CircularProgress';
import "./style/DarkMode.css";


const AnalyticsChart = ({ key, chartData, label, color }) => {

  const {state: {darkMode}}= useContext(AppContext);
  const [backColor, setBackColor] = useState("");
  const [textColor, setTextColor] = useState("");
  
  useEffect(()=>{
    setBackColor(darkMode ? "#525151":"white");
    setTextColor(darkMode ? "white":"black")
  },[darkMode]);

  return chartData && chartData.length > 0 ? (
    <div className='chart darkmode_strong'>
    <Chart
      width="100%"
      height="100%"
      chartType={chartData.length === 1 ? "ScatterChart" : "LineChart"}
      loader={<CircularProgress/>}
      data={[["Date", label], ...chartData]}
      options={{
        explorer: { axis: "horizontal" },
        hAxis: {
          format: "dd/MM/YY HH:mm",
          textStyle: {
            fontSize: 10,
            color: textColor
          },
          count: 10,
          //slantedText: true
        },
        areaOpacity: 0.5,
        legend: { position: "none" },

        vAxis: {
          textStyle: { fontSize: 10, fontWeight: 700, color: textColor },
        },
        colors: [color],
        chartArea: {
          backgroundColor: {
              fill: backColor,
              opacity: 0.1
           },
       },
       backgroundColor: {
        fill: backColor,
        opacity: 0.1
     },
      }}
    />
    </div>
  ) : (
    <h3>-</h3>
  );
};

export default AnalyticsChart;
