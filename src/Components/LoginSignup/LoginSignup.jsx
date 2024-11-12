import React, { useEffect, useState } from 'react';
import './LoginSignup.css'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import google_icon from '../Assets/google.png'

const LoginSignup = () => {

    const[action,setAction] = useState("Login");

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const email = urlParams.get('email');
    
    if (username && email) {
        // Create a session for the user
        createSession(username, email);
    }
    
    // Function to create a simulated session
    function createSession(username, email) {
        // Store user details in localStorage (or sessionStorage)
        localStorage.setItem('loggedInUser', JSON.stringify({ username, email }));
    }

    function isUserLoggedIn() {
        const user = localStorage.getItem('loggedInUser');
        return user !== null;
    }
    
    function getLoggedInUser() {
        const user = localStorage.getItem('loggedInUser');
        return user ? JSON.parse(user) : null;
    }

    function logout() {
        localStorage.clear();
        window.location.href = '/';
    }

    if (isUserLoggedIn()){
        return (
            <div>
                <h2>Logged in as {getLoggedInUser().username} with email {getLoggedInUser().email}</h2>
                <button onClick={logout}>Logout</button>
            </div>
            
        )
    } else return (
    
    <div>
         <div className="container">
        <div className="header">
            <div className="text">
                {action}
            </div>
            <div className="underline">

            </div>
        </div>
        <a href="https://ticketswap-backend.onrender.com/oauth2/authorization/google" className="submit-container">
            <div className="submit">
                <img src={google_icon} alt="" />
                <div className='intro'>
                    Continue with Googl
                </div>
            </div>
        </a>
    </div>
    </div>
  );
}

export default LoginSignup
