import React from 'react';
import {useState, useEffect} from 'react';
import {API} from '../../config';
import './Message.css';
let socket;

function QuestionMessage ({ message,  broadcastId, setMessage, setMessageNo }) {

  const [answer, setAnswer] = useState([]);

  function getAnswer(data){
    console.log('broadcast id : ', broadcastId);
    console.log('clinked message: ', data.message);

    const question = data.message;

    const QA_URL = `${API.PythonQA_URL}/${broadcastId}/query?q=${question}`
    
    fetch(QA_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API 응답 데이터:", data);
      setAnswer(data.answer);
      setMessage(data.answer);
      setMessageNo(message.commentNo);
    })
    .catch(error => {
      console.error("API 요청 오류:", error);
    });
    
  }

  if (message.result === "질문"){
    message.answer = "답변 예정";
    return (
      <div>
        <div className="messageContainer justifyEnd">
            <div onClick={()=> getAnswer(message)} className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
              id : {message.nickname}<br/>
              message: {message.message}<br />
              result: {message.result}<br />
            </p>
            </div>
        </div>
        <div id={message.commentNo} className="answerContainer justifyEnd">
          <div className="messageBox backgroundLight">
          <p className="messageText colorDark">
            답변 예정
          </p>
          </div>
        </div>
        
      </div>
    );
  } else{
    return (<div></div>);
  }
  
  
}

export default QuestionMessage;