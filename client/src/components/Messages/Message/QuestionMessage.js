import React from 'react';

import './Message.css';

function QuestionMessage ({ message: {text}, intend, broadcastId }) {
  const messages = JSON.parse(text);

  const chatList = messages.chat_data.filter(chat_data => 
    chat_data.result === "질문"
  );
  console.log(intend);
  console.log(chatList);

    //broadcastid, 질문 필요함
  function getAnswer(data){
    console.log('broadcast id : ', broadcastId);
    console.log('clinked message: ', data.message);

    const question = data.message;
    const apiUrl = `http://15.164.68.124:8000/${broadcastId}/query?q=${question}`;
    
    fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API 응답 데이터:", data);
      // 여기에서 데이터를 처리하거나 원하는 작업을 수행합니다.
    })
    .catch(error => {
      console.error("API 요청 오류:", error);
    });
    
  }
  
  return (
    <div>
    {chatList.map((data,index) => (
        <div className="messageContainer justifyEnd" key={data.commentNo}>
            <div onClick={()=> getAnswer(data)} className="messageBox backgroundBlue">
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

export default QuestionMessage;