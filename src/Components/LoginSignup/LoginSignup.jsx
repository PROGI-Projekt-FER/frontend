import React, {useState} from 'react'
import './LoginSignup.css'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import google_icon from '../Assets/google.png'

export const LoginSignup = () => {

    const[action,setAction] = useState("Login")

  return (
    <div className="container">
        <div className="header">
            <div className="text">
                {action}
            </div>
            <div className="underline">

            </div>
        </div>
        <a href="https://your-link-here.com" className="submit-container">
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

export default LoginSignup
