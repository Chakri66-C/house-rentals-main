import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';// visual stability and laoding performance

 // prepares the app to render with React's new Concurrent Mode features, like automatic batching and smoother updates.
const root = ReactDOM.createRoot(document.getElementById('root')); //getE_the container where React renders the entire application & 
root.render(  //root_renders the React component tree into the root element of the DOM.
  <React.StrictMode>
    <App />   
  </React.StrictMode>  // app/_All other components are nested inside
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
