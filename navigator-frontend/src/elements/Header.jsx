import '../assets/styles/Header.css';
import logo from '../assets/images/logo.png'
import React from 'react';
import { Link } from "react-router-dom";

export const Header = ({ logoutHandler, linkUnderline }) => {
    let mapsAndSchedulesClasses = "header-link";
    let routeRatingClasses = "header-link";
    if(linkUnderline === "mapsAndSchedules")
        mapsAndSchedulesClasses += " underline";
    else if(linkUnderline === "routeRating")
        routeRatingClasses += " underline";
    return (
        <div className="header">
            <img src={logo} width={84} alt="logo" />
            <div className={mapsAndSchedulesClasses}>
                <Link to="/mapsAndSchedules">Maps and Schedules</Link>
            </div>
            <div className={routeRatingClasses}>
                <Link to="/routeRating">Route Rating</Link>
            </div>
            <div className="header-link logout">
                <Link to="/login" onClick={logoutHandler}>Logout</Link>
            </div>
        </div>
    );

};