import React, { useEffect, useState } from "react";


const Test = () => {

    const [result, setResult] = useState("");

    useEffect(() => {
        const apiCall = async () => {
          try {
            const response = await fetch(
              "https://ticketswap-backend.onrender.com/api/user/info",
              { credentials: 'include' }
            );
            const responseText = await response.text()
            setResult(responseText)
            console.log(responseText)
          } catch (error) {
            console.log(error)
          }
        };
        apiCall();
      }, []);

    

    return (
        <>

        </>
    )
};

export default Test;