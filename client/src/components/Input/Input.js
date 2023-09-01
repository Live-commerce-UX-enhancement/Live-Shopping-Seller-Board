import React from 'react';

import './Input.css';

function Input ({ setMessage, sendMessage, message }) {
  return (
    <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className="sendButton" onClick={e => sendMessage(e)}>전송</button>
  </form>

  );
  
}

export default Input;