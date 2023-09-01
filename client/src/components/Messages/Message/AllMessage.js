import React from 'react';

import './Message.css';

const AllMessage = ({ message: {text}, intend }) => {

  const messages = JSON.parse(text);

  const chatList = messages.chat_data.filter(chat_data => 
    chat_data.result === "일반"
  );
  console.log(intend);
  console.log(chatList);

  
  return (
    <div>
      {chatList.map((data,index) => (
              <div className="messageContainer justifyEnd" key={data.commentNo}>
                  <div  className="messageBox backgroundBlue">
                    <p className="messageText colorWhite">
                      message: {data.message}<br />
                      result: {data.result}
                    </p>
                  </div>
                
              </div>
                ))}
    </div>
    
        
  );
}

export default AllMessage;