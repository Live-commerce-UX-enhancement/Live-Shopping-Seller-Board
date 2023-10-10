import React from 'react';

import './Message.css';

const RequestMessage = ({ message }) => {

  
  if(message.result==="요청"){
    return (
      <div>
        
          <div className="messageContainer justifyEnd" key={message.commentNo} >
            <div className="messageBox backgroundBlue">
              <p className="messageText colorWhite">
                id : {message.nickname}<br/>
                message: {message.message}<br />
              </p>
              </div>
          </div>
      </div>  
    );
  }else{
    return (<div></div>);
  }
  
}

export default RequestMessage;