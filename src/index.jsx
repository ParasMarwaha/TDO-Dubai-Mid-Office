import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import  ThemeContext  from "./context/ThemeContext"; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <BrowserRouter basename='/react/demo'>
        <ThemeContext>          
          <App />          
        </ThemeContext>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
