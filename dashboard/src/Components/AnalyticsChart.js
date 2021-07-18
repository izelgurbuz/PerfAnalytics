import React from "react";
import { Chart } from "react-google-charts";
import CircularProgress from '@material-ui/core/CircularProgress';


const AnalyticsChart = ({ key, chartData, label, color }) => {
  return chartData.length > 0 ? (
    <Chart
      width="100%"
      height="100%"
      chartType={chartData.length === 1 ? "ScatterChart" : "Line"}
      loader={<CircularProgress/>}
      data={[["Date", label], ...chartData]}
      options={{
        explorer: { axis: "horizontal" },
        hAxis: {
          format: "dd/MM/YY HH:mm",
          textStyle: {
            fontSize: 10,
          },
          count: 10,
          //slantedText: true
        },
        areaOpacity: 0.5,
        legend: { position: "none" },

        vAxis: {
          textStyle: { fontSize: 10, fontWeight: 700 },
        },
        colors: [color],
      }}
    />
  ) : (
    <h3>No data</h3>
  );
};

export default AnalyticsChart;
