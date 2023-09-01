import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import RequestMessage from './Message/RequestMessage';

import './Messages.css';

function RequestMessages({ messages, intend }){
  return(
    <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><RequestMessage message={message} intend = {intend}/></div>)}
    </ScrollToBottom>
  );
}

export default RequestMessages;