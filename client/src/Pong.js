import React, {useState} from 'react';

import config from '../../config';

function Pong({  }){

    const [message, setMessage] = useState('');

    const ENDPOINT = `${config.NodeJS_URL}/ping`

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
