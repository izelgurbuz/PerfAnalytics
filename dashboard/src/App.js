import React, { useEffect, useState, useContext } from "react";
import Brightness3RoundedIcon from '@material-ui/icons/Brightness3Rounded';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { withStyles } from '@material-ui/core/styles';
import { green , red, yellow, grey } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import { useAPI } from "./hooks/useApi";
import AddWebsite from "./Components/AddWebsite";
import CircularProgress from '@material-ui/core/CircularProgress';
import {AppContext} from './AppContainer';
import WebsiteTable from './Components/WebsiteTable';

const LiveSwitch = withStyles({
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

const DarkModeSwitch = withStyles({
  switchBase: {
    color: yellow[300],
    '&$checked': {
      color: grey[100],
    },
    '&$checked + $track': {
      backgroundColor: grey[500],
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
  let mode = localStorage.getItem("darkmode") === "true";
  const [darkMode, setDarkMode]= useState(mode);
  const [commonClass, setCommonClass] = useState("");
  
  useEffect(()=>{
    setCommonClass(darkMode ? "darkmode_strong":"");
    darkMode ? 
    document.body.style.backgroundColor = "#242323" : 
    document.body.style.backgroundColor = "white";
  },[darkMode])

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
    <div className={`App ${commonClass}`}>
      <AppBar className={`appbar ${commonClass}`} position="static">
        <h2 className="title">PerfAnalytics</h2>
        <FormGroup className="switch_container">
          <FormControlLabel 
            control={<LiveSwitch checked={checked} onChange={(e)=>{
              localStorage.setItem("switch",e.target.checked);
              setChecked(e.target.checked);}} name="checkedA" />}
            label={checked ? "Live" : "Offline"}
          />
          <FormControlLabel 
            control={<DarkModeSwitch  checkedIcon={<Brightness3RoundedIcon/>} icon={<WbSunnyIcon/>} checked={darkMode} onChange={(e)=>{
              dispatch({type:'TOGGLE_DARK_MODE'});
              setDarkMode(e.target.checked);}} name="checkedA" />}
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
        {searchData || data ? 
        (<WebsiteTable 
          setRenderToggle={setRenderToggle}
          renderToggle={renderToggle} 
          data={searchData || data} />)
        : (<CircularProgress/>)}
          
        </div>
      </div>
    </div>
  );
}

export default App;
