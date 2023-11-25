import '../assets/styles/Header.css';
import logo from '../assets/images/logo.png'
import React from 'react';

export const Header = ({ logoutHandler }) => {
    return (
        <div className="header">
            <img src={logo} width={84} alt="logo" />
            <div className="header-link">
                Maps and Schedules
            </div>
            <div className="header-link">
                Route Rating
            </div>
            <div className="header-link logout">
                <span onClick={logoutHandler}>Logout</span>
            </div>
        </div>
    );

};