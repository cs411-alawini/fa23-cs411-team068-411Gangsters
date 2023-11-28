import '../assets/styles/Header.css';
import logo from '../assets/images/logo.png'
import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Header = ({ linkUnderline }) => {
    let mapsAndSchedulesClasses = "header-link";
    let routeRatingClasses = "header-link";

    const navigate = useNavigate();

    const logoutHandler = async () => {
        return await axios({
            method: 'post',
            url: "http://127.0.0.1:2000/logout",
            withCredentials: "include"
        }).then((res) => {
            alert(res.data);
            navigate('/login?action=logout')
        });
    };

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