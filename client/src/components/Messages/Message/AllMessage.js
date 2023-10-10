import React from 'react';

import './Message.css';

const AllMessage = ({ message }) => {

  if (message.result === "일반"){
    return (
      <div>
        <div className="messageContainer justifyEnd" key={message.commentNo}>
          <div  className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
              id : {message.nickname}<br/>
              message: {message.message}<br />
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