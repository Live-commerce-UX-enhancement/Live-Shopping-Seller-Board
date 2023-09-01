import React from 'react';

import './Message.css';

const AllMessage = ({ message }) => {

  if (message.result === "일반"){
    return (
      <div>
        <div className="messageContainer justifyEnd" key={message.commentNo}>
          <div  className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
              message: {message.message}<br />
              result: {message.result}
            </p>
          </div>
        </div>
      </div> 
    );
  }else {
    return (<div></div>);
  }
}

export default AllMessage;