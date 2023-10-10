import React,{useState} from 'react';
import {API} from '../../../config';
import './Message.css';

function QuestionMessage ({ message,  broadcastId, setMessage, setMessageNo }) {

  const [answer, setAnswer] = useState([]);
  const [clickedDiv, setClickedDiv] = useState(null); // State to keep track of the clicked div

  const handleDivClick = (event, message) => {
    // Check if the clicked div is the one already clicked
    if (clickedDiv === message.commentNo) {
      // If it's the same div, remove the "click" class and reset the state
      setClickedDiv(null);
    } else {
      // Remove the "click" class from the previously clicked div
      if (clickedDiv) {
        const prevDiv = document.getElementById(clickedDiv);
        console.log('prevDiv');
        console.log(prevDiv);
        prevDiv.classList.remove("click");
        prevDiv.classList.add("backgroundBlue");
      }

      // Add the "click" class to the clicked div and update the state
      console.log('event.target');
      console.log(event.target);
      event.target.classList.remove("backgroundBlue");
      event.target.classList.add("click");
      setClickedDiv(message.commentNo);
    }
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
      // setBoxColor('backgroundPurple'); // 원하는 색상으로 변경
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
        handleDivClick(event, message);
      }}>
            <div className="messageBox backgroundBlue" >
              <p className="messageText colorWhite" onClick={(event) => {event.stopPropagation();}}>
                id : {message.nickname}<br/>
                message: {message.message}<br />
                {/* result: {message.result}<br /> */}
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