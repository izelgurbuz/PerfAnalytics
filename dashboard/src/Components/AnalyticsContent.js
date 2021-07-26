import "date-fns";
import React, { useEffect, useState, useContext } from "react";
import { useAPI } from "../hooks/useApi";
import "./style/AnalyticsContent.css";
import "./style/DarkMode.css";
import AnalyticsChart from "./AnalyticsChart";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button } from "@material-ui/core/";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import { FixedSizeList } from "react-window";
import { AppContext } from "../AppContainer";
import Divider from "@material-ui/core/Divider";

const ResourceList = ({ data }) => {
  console.log(data, "data");

  const createRows = ({ index, style }) => (
    <div key={index} style={style} className="resource_container">
      <div className="resource_text first">
        <p>{data[index].name}</p>
      </div>
      <div className="resource_text second">
        <p>{data[index].duration}</p>
      </div>
    </div>
  );

  return data && data.length > 0 ? (
    <FixedSizeList
      width="100%"
      height={300}
      itemCount={data.length}
      itemSize={50}
    >
      {createRows}
    </FixedSizeList>
  ) : (
    <div className="no_list">
      <h3>-</h3>
    </div>
  );
};

const AnalyticsContent = ({ siteId, open }) => {
  const { get } = useAPI();
  const {
    state: { darkMode, graphToggle },
  } = useContext(AppContext);
  const [analytics, setAnalytics] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [commonClass, setCommonClass] = useState("");
  const [value, setValue] = useState(0);
  const [resourceMetrics, setResourceMetrics] = useState([]);

  useEffect(() => {
    setCommonClass(darkMode ? "dark_filter" : "");
  }, [darkMode]);

  useEffect(() => {
    let temp = [];
    analytics?.map((item) => {
      temp = [...temp, ...item.resourceLoadTimes];
    });
    setResourceMetrics(temp);
  }, [analytics]);

  const types = [
    { title: "FCP", color: "blue" },
    { title: "TTFB", color: "red" },
    { title: "domLoad", color: "yellow" },
    { title: "windowLoad", color: "green" },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const handleRemoveFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    let queryString =
      startDate && endDate
        ? `startDate=${encodeURIComponent(
            startDate.toString()
          )}&endDate=${encodeURIComponent(endDate.toString())}`
        : "";
    open
      ? ((startDate && endDate) || (!startDate && !endDate)) &&
        get(`website`, siteId, queryString)
          .then((result) => {
            setAnalytics(result?.analytics);
          })
          .catch((err) => {
            console.log(err);
          })
      : setAnalytics(null);
  }, [open, startDate, endDate, graphToggle]);

  const tabContent = () =>
    value === 0 ? (
      types?.map((x, index) => (
        <div key={index} className="chart_container">
          <h3>{x.title}</h3>
          <AnalyticsChart
            chartData={analytics?.map((item) => [
              new Date(item.createdAt),
              item[x.title] || 0,
            ])}
            label={x.title}
            color={x.color}
          />
        </div>
      ))
    ) : (
      <ResourceList data={resourceMetrics} />
    );

  return (
    <>
      <Paper className={darkMode ? "darkmode_medium" : ""} square>
        <Tabs
          value={value}
          indicatorColor="secondary"
          onChange={handleChange}
          className={darkMode ? "darkmode_medium" : ""}
          variant="fullWidth"
          centered
        >
          <Tab label="Graphs" />
          <Tab label="Resource Timings" />
        </Tabs>
      </Paper>
      <div className="date_filter_container">
        <div className="container_left">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="date_filter">
              <KeyboardDateTimePicker
                className={`start_filter ${commonClass}`}
                value={startDate}
                onChange={handleStartDateChange}
                label="Start Date"
                onError={console.log}
                minDate={new Date("2018-01-01T00:00")}
                format="yyyy/MM/dd hh:mm a"
                style={{ color: "white" }}
              />
            </div>
            <div className="date_filter">
              <KeyboardDateTimePicker
                className={`end_filter ${commonClass}`}
                value={endDate}
                onChange={handleEndDateChange}
                label="End Date"
                onError={console.log}
                minDate={new Date("2018-01-01T00:00")}
                format="yyyy/MM/dd hh:mm a"
              />
            </div>
          </MuiPickersUtilsProvider>
          {startDate && endDate ? (
            <div className="info">
              <Button
                className="reset_button"
                style={startDate && endDate ? { color: "red" } : {}}
                onClick={handleRemoveFilter}
                startIcon={<CancelIcon />}
              >
                Reset
              </Button>
            </div>
          ) : (
            <div className="info">
              <p>*Displaying last 30 mins </p>
            </div>
          )}
        </div>
      </div>
      <div className="analytics_content">
        {analytics ? tabContent() : <CircularProgress />}
      </div>
    </>
  );
};

export default AnalyticsContent;
