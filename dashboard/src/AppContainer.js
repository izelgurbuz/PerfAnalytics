import React,{createContext, useReducer,} from 'react';

export const AppContext = createContext(null);

const initialState={
  graphToggle : true,
}

const reducer = (state,action)=>{
  switch(action.type){
    case 'TOGGLE_GRAPH_RENDER':
      return {...state, graphToggle: action.payload};
    default:
      return state;
  }
}

export const AppProvider =(props)=>{
  const [state,dispatch]= useReducer(reducer,initialState);
  return (<AppContext.Provider value={{state,dispatch}} >{props.children}</AppContext.Provider>);
}
