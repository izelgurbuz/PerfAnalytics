import React from "react";
import { Chart } from "react-google-charts";
import CircularProgress from '@material-ui/core/CircularProgress';


const AnalyticsChart = ({ key, chartData, label, color }) => {
  return chartData && chartData.length > 0 ? (
    <div className='chart'>
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
    </div>
  ) : (
    <h3>-</h3>
  );
};

export default AnalyticsChart;
