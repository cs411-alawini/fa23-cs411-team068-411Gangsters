import React, { useState } from "react";
import axios from "axios";
import '../assets/styles/auth.css';
import logo from '../assets/images/logo.png'

// Two default xsrf token headers for axios. 
// These headers are used to protect against CSRF (Cross-Site Request Forgery) attacks.
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// The Login page component
// The onFormSwitch prop is the function used to switch between the login and register pages
export const Login = ({ onFormSwitch }) => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');



    // This function is triggered when the user submits the login form. 
    // This function prevents the default behavior of the form,sends a POST request to the URL "http://127.0.0.1:5000/api/auth/"
    // login, and logs the response to the console. The request includes the values of the "username" and "password" states.
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/login',
            params: {
                username: username,
                password: password
            }
          })
        console.log(response)
    }




    return (
        <div className="auth-form-container">
            <img src={logo} alt="logo" />
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="label-holder">
                    <label htmlFor="username">Username</label>
                </div>
                <input value={username} onChange={(e) => setUser(e.target.value)} type="username" placeholder="Username" id="username" name="username" style={{"marginBottom": "1rem"}}   />
                <div className="label-holder">
                    <label htmlFor="password">Password</label>
                </div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*********" id="password" name="password" style={{"marginBottom": "1rem"}} />
                <button type="submit">LOGIN</button>
            </form>
            <button className="link-btn" onClick={() => onFormSwitch('register')}>Don't have an account? Register Here.</button>
        </div>
    )
}