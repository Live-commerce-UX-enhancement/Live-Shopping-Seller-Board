import React, {useState} from 'react';


function Pong({  }){

    const [message, setMessage] = useState('');

    const ENDPOINT = 'http://ec2-52-55-180-73.compute-1.amazonaws.com:5000/ping';

    fetch(ENDPOINT)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);
      
      return response.json();
    })
    .then(data => {
        console.log(data);
        setMessage(data["response"]);
    })
    .catch(error => {
      console.error("API 요청 오류:", error);
    });

    return(<div><div>{message}</div></div>);

}

export default Pong;