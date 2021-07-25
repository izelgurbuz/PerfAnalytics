import React,{createContext, useReducer,} from 'react';

export const AppContext = createContext(null);

const initialState={
  graphToggle : true,
  darkMode: localStorage.getItem("darkmode") === "true"
}

const reducer = (state,action)=>{
  switch(action.type){
    case 'TOGGLE_GRAPH_RENDER':
      return {...state, graphToggle: action.payload};
    case 'TOGGLE_DARK_MODE':
      let newMode = !(localStorage.getItem("darkmode") === "true");
      localStorage.setItem("darkmode",newMode);
      return {...state, darkMode: newMode};
    default:
      return state;
  }
}

export const AppProvider =(props)=>{
  const [state,dispatch]= useReducer(reducer,initialState);
  return (<AppContext.Provider value={{state,dispatch}} >{props.children}</AppContext.Provider>);
}
