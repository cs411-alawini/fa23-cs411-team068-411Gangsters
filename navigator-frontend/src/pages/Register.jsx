import React, { useState, useEffect } from "react"
import axios from "axios"
import '../assets/styles/auth.css';
import logo from '../assets/images/logo.png'
import { useNavigate } from "react-router-dom";

// Two default xsrf token headers for axios. 
// These headers are used to protect against CSRF (Cross-Site Request Forgery) attacks.
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// The Register page component
// The onFormSwitch prop is the function used to switch between the login and register pages
export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // This function is called and an HTTP POST request is made to the server's API endpoint
    // with the user's information. The API endpoint URL is hardcoded to 
    // http://127.0.0.1:5000/api/auth/register
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios({
            method: 'post',
            url: 'http://127.0.0.1:2000/register',
            params: {
                username: username,
                password: password
            }
          })
          if (response.status === 200) {
            navigate('/login');
          } else if (response.status === 201) {
            setErrorMessage("You are already registered, please head to login page");
          } else if (response.status === 202) {
            setErrorMessage("Your username contains inappropriate words");
          }
    }

    useEffect(() => {
        document.getElementsByClassName('App')[0].className = "App App-unauth"
    }, []);

    return (
        <div className="auth-form-container">
            <img src={logo} alt="logo" />
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="label-holder">  
                    <label htmlFor="email">Email</label>
                </div>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" id="email" name="email" style={{"marginBottom": "1rem"}}  />
                <div className="label-holder">
                    <label htmlFor="username">Username</label>
                </div>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="Username" id="username" name="username" style={{"marginBottom": "1rem"}} />
                <div className="label-holder">
                    <label htmlFor="password">Password</label>
                </div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*********" id="password" name="password" style={{"marginBottom": "1rem"}} />
                <button type="submit">REGISTER</button>

            </form>
            <button className="link-btn" onClick={() => navigate('/login')}>Already have an account? Login here.</button>
            {errorMessage && ( <p className="error"> <div style={{ color: 'red' }}> {errorMessage}</div> </p>)}
        </div>
    )
}