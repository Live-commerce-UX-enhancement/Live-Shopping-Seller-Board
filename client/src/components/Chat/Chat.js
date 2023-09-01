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
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });

  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

      socket.emit('getChats');
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar intend = "일반" />
          <AllMessages messages={messages} intend = "일반" />
      </div>
      <div className="container">
          <InfoBar intend = "질문" />
          <QuestionMessages messages={messages} intend = "질문" broadcastId={broadcastId}/>
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <div className="container">
          <InfoBar intend = "요청" />
          <RequestMessages messages={messages} intend = "요청" />
      </div>
    </div>
  );
}

export default Chat;
