import React, {useState} from 'react'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import google_icon from '../Assets/google.png'

export const CreateTicket = () => {

    const handleSubmit = async () => {
        // Example JSON data to be sent
        const data = {
            "event": {
                "title": "Test Event 2",
                "description": "Event description",
                "eventDate": "2024-11-10T13:17:16.660Z",
                "venue": {
                    "name": "Test Venue 2",
                    "capacity": 10000,
                    "location": {
                        "country": "HR",
                        "city": "Zagreb",
                        "address": "Arena Zagreb"
                    }
                },
                "eventEntity": {
                    "name": "Grse",
                    "type": "musician"
                }
            },
            "status": "SELL",
            "description": "open crowd",
            "price": 50,
            "categories": [
                {
                "name": "Music"
                }
            ]
        };
    
        try {
          const response = await fetch('https://your-api-endpoint.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Send data as JSON
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const responseData = await response.json();
          console.log('Response:', responseData);
    
          // Optionally, handle success or redirect here
        } catch (error) {
          console.error('There was an error!', error);
        }
      };

    return (
        <div className="container">
            <div className="header">
                <div className="text">
                    Login
                </div>
                <div className="underline">
    
                </div>
            </div>
            <a className="submit-container" onClick={handleSubmit}>
                <div className="submit">
                    <img src={google_icon} alt="" />
                    <div className='intro'>
                        Continue with Google
                    </div>
                </div>
            </a>
    
        </div>
      )
}

export default CreateTicket