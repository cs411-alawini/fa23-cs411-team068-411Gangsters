import React, { useEffect, useState } from "react";
import axios from "axios";
import '../assets/styles/auth.css';
import logo from '../assets/images/logo.png'
import { useNavigate, useSearchParams } from "react-router-dom";

// Two default xsrf token headers for axios. 
// These headers are used to protect against CSRF (Cross-Site Request Forgery) attacks.
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// The Login page component
// The onFormSwitch prop is the function used to switch between the login and register pages
export const Login = () => {
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // This function is triggered when the user submits the login form. 
    // This function prevents the default behavior of the form,sends a POST request to the URL "http://127.0.0.1:5000/api/auth/"
    // login, and logs the response to the console. The request includes the values of the "username" and "password" states.
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios({
            method: 'post',
            url: 'http://127.0.0.1:2000/login',
            params: {
                username: username,
                password: password,
            },
            withCredentials: "include"
          }).then((_) => {
            navigate('/mapsAndSchedules')
          }).catch((err) => {
            alert(err.response.data)
          });
    }

    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        document.getElementsByClassName('App')[0].className = "App App-unauth";
        if(searchParams.get('action') === "logout")
            alert("You have been logged out.");
    }, []);

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
            <button className="link-btn" onClick={() => navigate("/register")}>Don't have an account? Register Here.</button>
            {errorMessage && ( <p className="error"> <div style={{ color: 'red' }}> {errorMessage}</div> </p>)}
            {errorMessage && ( <p className="error"> <div style={{ color: 'red' }}> {errorMessage}</div> </p>)}
        </div>
    )
}