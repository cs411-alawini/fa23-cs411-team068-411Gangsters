import './assets/styles/index.css';
import React, { useState } from 'react';
import { Login } from './pages/Login';
import { MapsAndSchedules } from './pages/MapsAndSchedules';
import { Register } from './pages/Register';
import { Rating } from './pages/Rating';
import "./assets/styles/App.css";

function App() {

  // State to hold current page (Login/Register)
  const [currentForm, setCurrentForm] = useState('login');
  const [authenticated, setAuthenticated] = useState(false);

  const toggleForm = (formName) => {
    setCurrentForm(formName);
    if (formName === 'login' || formName === 'register') {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }

  return (
    <div className={ authenticated ? "App-auth App" : "App-unauth App" }>
      {
      (() => {
        if (currentForm === "login") {
          return <Login onFormSwitch={toggleForm} />;
        } else if (currentForm === "register") {
          return <Register onFormSwitch={toggleForm} />;
        } else if (currentForm === "mapsAndSchedules") {
          return <MapsAndSchedules onFormSwitch={toggleForm}/>;
        } else if (currentForm === "rating") {
          return <Rating onFormSwitch={toggleForm} />;
        }
      })()
      }
        
    </div>
  );
}

export default App;
