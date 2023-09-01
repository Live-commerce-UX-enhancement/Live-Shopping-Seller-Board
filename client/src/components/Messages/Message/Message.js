import React from 'react';

import './Message.css';

const Message = ({ message: {text}, intend }) => {

  const messages = JSON.parse(text);

  const chatList = messages.chat_data.filter(chat_data => 
    chat_data.result === intend
  );
  console.log(intend);
  console.log(chatList);

  
  return (
    
        <div className="messageContainer justifyEnd">
          {messages.chat_data.map((data,index) => (
            <div key={index} className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
              message: {data.message}<br />
              result: {data.result}
            </p>
            </div>
          ))}
          
        </div>
        
  );
}

export default Message;