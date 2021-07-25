import React,{createContext, useReducer,} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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

const AppContainer =()=>{
  const [state,dispatch]= useReducer(reducer,initialState);
  return (<AppContext.Provider value={{state,dispatch}} ><App /></AppContext.Provider>)
}


ReactDOM.render(
  <React.StrictMode>
    <AppContainer/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();