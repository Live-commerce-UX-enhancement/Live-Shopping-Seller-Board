import React from 'react';

import './Message.css';

const RequestMessage = ({ message }) => {

  
  if(message.result==="요청"){
    return (
      <div>
        
          <div className="messageContainer justifyEnd" key={message.commentNo} >
            <div className="messageBox backgroundBlue">
              <p className="messageText colorWhite">
                message: {message.message}<br />
                result: {message.result}
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