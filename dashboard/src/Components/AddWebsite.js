import React, { useEffect, useState, useContext } from "react";
import {AppContext} from "../AppContainer";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import "./style/AddWebsite.css";
import "./style/DarkMode.css";
import { useAPI } from "../hooks/useApi";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

const AddWebsite = ({ data =[], setSearchData, setRenderToggle, renderToggle }) => {
  const { post } = useAPI();
  const {state: {darkMode}}= useContext(AppContext);
  const [searchKey, setSearchKey] = useState(null);
  const [newUrl, setNewUrl] = useState(null);
  const [validUrl, setValidUrl] = useState(true);
  const [searchDisabled, setSearchDisabled]= useState(true);
  const [addDisabled, setAddDisabled]= useState(true);
  const [commonClass, setCommonClass] = useState("");
  
  useEffect(()=>{
    setCommonClass(darkMode ? "darkmode_medium":"");
  },[darkMode]);

  useEffect(() => {
    searchKey?.length === 0 && setSearchData(null);
    setSearchDisabled(!searchKey || searchKey.length <= 0);
  }, [searchKey]);

  useEffect(()=>{
    setAddDisabled(!newUrl || newUrl.length <= 0 || !validURL(newUrl))
  },[newUrl]);

  const handleAddWebsite = () => {
    post("addWebsite", { url: newUrl })
      .then((result) => {
        setNewUrl("");
        setRenderToggle(!renderToggle);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    setSearchData(
      data?.filter((item) => {
        const url = item.url.toLowerCase();
        return url.includes(searchKey);
      })
    );
  };

  const handleRemoveSearch = () => {
    setSearchKey("");
    setSearchData(null);
  };
  const searchKeyPress=(e)=>{
    if(e.keyCode === 13){
      searchKey && handleSearch();
    }
 }
 const addKeyPress=(e)=>{
  if(e.keyCode === 13){
    newUrl && handleAddWebsite();
  }
}
  return (
    <div className="search_add_container">
      <Paper className={ `search_paper ${commonClass}`}>
        <InputBase
          className={`input ${commonClass}`}
          placeholder="Search Url..."
          value={searchKey || ''}
          onChange={(e) => {
            e.preventDefault();
            setSearchKey(e.target.value)}}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onKeyDown={searchKeyPress}
        />
        <div className="button_container">
          <IconButton
            className={`icon_button ${!searchDisabled && commonClass} `}
            aria-label="search"
            onClick={handleSearch}
            disabled={searchDisabled}
          >
            <SearchIcon  />
          </IconButton>
          <IconButton
            className={`icon_button delete ${!searchDisabled && commonClass} `}
            aria-label="search"
            onClick={handleRemoveSearch}
            disabled={searchDisabled}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </Paper>
      <Paper
        className={ `search_paper ${commonClass} ${validUrl ? "": "red_border"}`}
      >
        <InputBase
          className={`input add_url ${commonClass}`}
          placeholder="Add Url..."
          value={newUrl || ''}
          onChange={(e) => {
            e.preventDefault();
            let temp = e.target.value;
            setNewUrl(temp);
            setValidUrl(!temp || temp.length <= 0 || validURL(temp));
          }}
          onSubmit={(e) => {
            e.preventDefault()}
          }
          onKeyDown={addKeyPress}

        />
        <IconButton
          className="icon_button"
          aria-label="search"
          onClick={handleAddWebsite}
          disabled={addDisabled}
        >
          <AddCircleOutlineIcon style={addDisabled ? {}: darkMode? {color:"white"}:{color:"green"} } />
        </IconButton>
      </Paper>
    </div>
  );
};
export default AddWebsite;
