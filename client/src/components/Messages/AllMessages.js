import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import AllMessage from './Message/AllMessage';

import './Messages.css';

function AllMessages({ messages, intend }){
  return(
    <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><AllMessage message={message} intend = {intend}/></div>)}
    </ScrollToBottom>
  );
}

export default AllMessages;