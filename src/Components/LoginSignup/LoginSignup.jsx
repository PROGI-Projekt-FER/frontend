import React, { useEffect, useState } from 'react';
import './LoginSignup.css'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import google_icon from '../Assets/google.png'

const LoginSignup = () => {

    const[action,setAction] = useState("Login")
    const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Function to get a query parameter by name
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);  // Returns the value of the parameter or null if not found
    }

    // Function to set the session cookie
    function setSessionCookie(sessionId) {
        if (sessionId) {
            // Set the JSESSIONID cookie
            document.cookie = `JSESSIONID=${sessionId}; domain=onrender.com;`;
            console.log('Session cookie set:', sessionId);
        }
    }

    // Get the session ID from the query string
    const sessionId = getQueryParam('JSESSIONID');  // Assuming the query parameter is named "JSESSIONID"

    // Set the session cookie if it exists in the query parameter
    if (sessionId) {
        setSessionCookie(sessionId);
    } else {
        console.log('No session ID found in the URL');
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ticketswap-backend.onrender.com/api/test-user', {
          method: 'GET',
          headers: {
            'Cookie': `JSESSIONID=${getQueryParam('JSESSIONID')}`,  // Manually add the session ID to the header
            'Content-Type': 'application/json'
        },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.text();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    
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
      <h2>{JSON.stringify(data, null, 2)}</h2>
    </div>
  );
}

export default LoginSignup
