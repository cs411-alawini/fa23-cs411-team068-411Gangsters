import React, { useState } from "react"
import axios from "axios"
import '../assets/styles/auth.css';

// Two default xsrf token headers for axios. 
// These headers are used to protect against CSRF (Cross-Site Request Forgery) attacks.
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// The Register page component
// The onFormSwitch prop is the function used to switch between the login and register pages
export const Register = ({ onFormSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    // This function is called and an HTTP POST request is made to the server's API endpoint
    // with the user's information. The API endpoint URL is hardcoded to 
    // http://127.0.0.1:5000/api/auth/register
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post("http://127.0.0.1:8000/api/auth/register", {
            email: email,
            username: username,
            password: password
        })
        console.log(response)
    }

    return (
        <div className="auth-form-container">
            <h1>Navigator</h1>
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
                <button type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => onFormSwitch('login')}>Already have an account? Login here.</button>
        </div>
    )
}