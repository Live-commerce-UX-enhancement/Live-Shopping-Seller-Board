import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

function Messages({ messages, intend }){
  return(
    <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} intend = {intend}/></div>)}
    </ScrollToBottom>
  );
}

export default Messages;