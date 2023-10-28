import React,{useState, useEffect} from 'react';
import {API} from '../../../config';
import './Message.css';

function QuestionMessage ({ message,  broadcastId, setMessage, setMessageNo }) {

  const [clickedDiv, setClickedDiv] = useState(null); // State to keep track of the clicked div

  const handleDivClick = (event, id) => {
    // const id = message.commentNo;
    console.log('classList: ',document.getElementById(id).classList);
    console.log('clickedDiv: ',clickedDiv);
    if (clickedDiv!=null) {
      console.log('클릭한거 있음');
      const prevDiv = document.getElementById(clickedDiv);
      console.log('prevDiv: ', prevDiv);
      prevDiv.classList.remove("click");
      prevDiv.classList.add("backgroundGray");
    }
    // Add the "click" class to the clicked div and update the state
    event.target.classList.remove("backgroundGray");
    event.target.classList.add("click");
    setClickedDiv(id);   

  };

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
        <div className="messageContainer justifyEnd" 
        onClick={(event) => {
        getAnswer(message);
        handleDivClick(event, message.commentNo);
      }}>
            <div id={message.commentNo} className="messageBox backgroundGray" >
              <p className="messageText colorWhite" onClick={(event) => {event.stopPropagation();}}>
                id: {message.nickname}<br />
                message: {message.message}<br />
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