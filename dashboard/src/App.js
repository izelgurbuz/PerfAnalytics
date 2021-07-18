import React, { useEffect, useState, Suspense, lazy } from "react";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import { useAPI } from "./hooks/useApi";
import AddWebsite from "./Components/AddWebsite";
import CircularProgress from '@material-ui/core/CircularProgress';
const WebsiteTable = lazy(() => import('./Components/WebsiteTable'));

function App() {
  const { get } = useAPI();
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [renderToggle, setRenderToggle] = useState(false);

  console.log(searchData, "searchData");

  useEffect(() => {
    get("websites")
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [renderToggle]);

  return (
    <div className="App">
      <AppBar position="static">
        <h2>PerfAnalytics</h2>
      </AppBar>
      <div className="dynamic_content_container">
        <div className="add_website_container">
          <AddWebsite
            data={data}
            setSearchData={setSearchData}
            setRenderToggle={setRenderToggle}
            renderToggle={renderToggle}
          />
        </div>
        <div className="table_container">
        <Suspense fallback={<CircularProgress/>}>
          <WebsiteTable data={searchData || data} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;
