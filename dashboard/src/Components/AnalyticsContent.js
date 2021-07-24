import 'date-fns';
import React, { useEffect, useState, useContext } from "react";
import { useAPI } from "../hooks/useApi";
import "./style/AnalyticsContent.css";
import AnalyticsChart from "./AnalyticsChart";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CancelIcon from '@material-ui/icons/Cancel';
import {Button} from "@material-ui/core/";
import CircularProgress from '@material-ui/core/CircularProgress';
import {AppContext} from "../index";


const AnalyticsContent = ({ siteId, open }) => {
  const { get } = useAPI();
  const {state}= useContext(AppContext);
  const [analytics, setAnalytics] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const types = [
    { title: "FCP", color: "blue" },
    { title: "TTFB", color: "red" },
    { title: "domLoad", color: "black" },
    { title: "windowLoad", color: "green" },
  ];

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const handleRemoveFilter =()=>{
    setStartDate(null);
    setEndDate(null);
  };
  
  
  useEffect(() => {
    let queryString = (startDate && endDate) ? `startDate=${startDate.toString()}&endDate=${endDate.toString()}`: "";
    open ? 
     ((startDate && endDate) || (!startDate && !endDate)) && get(`website`,siteId, queryString)
        .then((result) => {
          setAnalytics(result?.analytics);
        })
        .catch((err) => {
          console.log(err);
        }) : setAnalytics(null);
  }, [open,startDate,endDate,state.graphToggle]);

  return (
    <>
    <div className="date_filter_container">
      <div className="container_left">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="date_filter">
         <KeyboardDateTimePicker
           value={startDate}
           onChange={handleStartDateChange}
           label="Start Date"
           onError={console.log}
           minDate={new Date("2018-01-01T00:00")}
           format="yyyy/MM/dd hh:mm a"
         />
        </div>
        <div className="date_filter">
          <KeyboardDateTimePicker
           value={endDate}
           onChange={handleEndDateChange}
           label="End Date"
           onError={console.log}
           minDate={new Date("2018-01-01T00:00")}
           format="yyyy/MM/dd hh:mm a"
         />
        </div>
      </MuiPickersUtilsProvider>
        {startDate && endDate ?
        (<div className="info">
            <Button
              style={startDate && endDate ? {color:"red"} : {}}
              onClick={handleRemoveFilter}
              startIcon={<CancelIcon/>}
            >
               Reset
            </Button>
        </div>): 
        (<div className="info"><p>*Displaying last 30 mins </p></div>)}
          </div>  
      </div>
    <div className="analytics_content">
      {analytics ? (
        types?.map((x, index) => (
          <div key={index} className="chart_container">
            <h3>{x.title}</h3>
            <AnalyticsChart
              chartData={analytics?.map((item) => item[x.title] ? [
                new Date(item.createdAt),
                item[x.title],
              ]: null)}
              label={x.title}
              color={x.color}
            />
          </div>
        ))
      ) : (
        <CircularProgress/>
      )}
    </div>
    </>
  );
};

export default AnalyticsContent;
