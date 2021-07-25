import React, { useEffect, useState, Suspense, lazy, useContext } from "react";
import { withStyles } from '@material-ui/core/styles';
import { green , red } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import { useAPI } from "./hooks/useApi";
import AddWebsite from "./Components/AddWebsite";
import CircularProgress from '@material-ui/core/CircularProgress';
import {AppContext} from './AppContainer';
const WebsiteTable = lazy(() => import('./Components/WebsiteTable'));



const PurpleSwitch = withStyles({
  switchBase: {
    color: red[300],
    '&$checked': {
      color: green[500],
    },
    '&$checked + $track': {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

function App() {
  const { get } = useAPI();
  const {dispatch} = useContext(AppContext);
  let initialCheck = localStorage.getItem("switch") === "true";
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [renderToggle, setRenderToggle] = useState(false);
  const [graphToggle, setGraphToggle] = useState(false);
  const [checked, setChecked] = useState(initialCheck);
  const [intId, setIntId] = useState(null);
  
    useEffect(()=>{
    if(checked){
      const id = setInterval(()=>{
        setGraphToggle((graphToggle)=> !graphToggle);
      },10000);
      setIntId(id);
    }else
      {intId && clearInterval(intId); 
      setIntId(null);}
    return () => {
        clearInterval(intId);
      };
  },[checked])

  useEffect(()=>{
    dispatch({type:'TOGGLE_GRAPH_RENDER', payload: graphToggle});
  },[graphToggle]);

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
      <AppBar className="appbar" position="static">
        <h2 className="title">PerfAnalytics</h2>
        <FormGroup className="switch_container">
          <FormControlLabel 
            control={<PurpleSwitch checked={checked} onChange={(e)=>{
              localStorage.setItem("switch",e.target.checked);
              setChecked(e.target.checked);}} name="checkedA" />}
            label={checked ? "Live" : "Offline"}
          />
        </FormGroup>
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
