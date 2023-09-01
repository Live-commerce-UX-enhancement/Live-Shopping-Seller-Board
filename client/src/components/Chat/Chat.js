import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import AllMessages from '../Messages/AllMessages'
import RequestMessages from '../Messages/RequestMessages'
import QuestionMessages from '../Messages/QuestionMessages'

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';


import './Chat.css';

const ENDPOINT = 'http://localhost:5000/';

let socket;

function Chat({ location }) {

  const { broadcastId } = queryString.parse(location.search);
  const [message, setMessage] = useState('');
  const [messageNo, setMessageNo] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { broadcastId } = queryString.parse(location.search);
    
    socket = io(ENDPOINT);

    socket.emit('join', { broadcastId }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    // event.preventDefault();
    socket.emit('getChats');

    socket.on('message', message => {

      const messageList = JSON.parse(message.text).chat_data; 

      messageList.map((message, idx) => {
        setMessages(messages => [ ...messages, message ]);
      })
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    var answerContainer = document.getElementById(messageNo);
    console.log(answerContainer);
    var answerMessage = answerContainer.getElementsByClassName("messageText")[0];

    console.log(answerMessage);
    console.log('a', answerMessage.value);

    //전송 버튼 눌렀을 때 답변 보이게 하는거, 답변이 '답변 예정'에서 진짜 답변으로 바뀌는거 아직..
    answerMessage.innerText = message; // 여기 안됌
    answerMessage.style.display = 'flex';// 여기 안됌

  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar intend = "일반" />
          <AllMessages messages={messages}  />
      </div>
      <div className="container">
          <InfoBar intend = "질문" />
          <QuestionMessages messages={messages} broadcastId={broadcastId} setMessage={setMessage} setMessageNo={setMessageNo}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
      <div className="container">
          <InfoBar intend = "요청" />
          <RequestMessages messages={messages} />
      </div>
    </div>
  );
}

export default Chat;
