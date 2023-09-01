import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import QuestionMessage from './Message/QuestionMessage';

import './Messages.css';

function QuestionMessages({ messages, intend, broadcastId }){
  return(
    <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><QuestionMessage message={message} intend = {intend} broadcastId={broadcastId}/></div>)}
    </ScrollToBottom>
  );
}

export default QuestionMessages;