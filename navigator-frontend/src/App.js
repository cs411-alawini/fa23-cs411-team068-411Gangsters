import './assets/styles/index.css';
import React, { useState } from 'react';
import { Login } from './pages/Login';
import { MapsAndSchedules } from './pages/MapsAndSchedules';
import { Register } from './pages/Register';
import { RouteRating } from './pages/RouteRating';
import "./assets/styles/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

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
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mapsAndSchedules" element={<MapsAndSchedules />} />
          <Route path="/routeRating" element={<RouteRating />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
