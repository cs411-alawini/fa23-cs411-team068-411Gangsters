import './assets/styles/index.css';
import React, { useState } from 'react';
import { Login } from './pages/Login';
import { MapsAndSchedules } from './pages/MapsAndSchedules';
import { Register } from './pages/Register';
import { Rating } from './pages/Rating';
import "./assets/styles/App.css";

function App() {

  // State to hold current page (Login/Register)
  const [currentForm, setCurrentForm] = useState('mapsAndSchedules');
  const [authenticated, setAuthenticated] = useState(true);

  const toggleForm = (formName) => {
    setCurrentForm(formName);
    if (formName === 'login' || formName === 'register') {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  }

  return (
    <div className={ authenticated ? "App-auth App" : "App-unauth App" }>
      {
      (() => {
        if (currentForm === "login") {
          return <Login pageSwitch={toggleForm} />;
        } else if (currentForm === "register") {
          return <Register pageSwitch={toggleForm} />;
        } else if (currentForm === "mapsAndSchedules") {
          return <MapsAndSchedules pageSwitch={toggleForm}/>;
        } else if (currentForm === "rating") {
          return <Rating pageSwitch={toggleForm} />;
        }
      })()
      }
        
    </div>
  );
}

export default App;
