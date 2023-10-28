import React from 'react';

import './InfoInput.css';

const InfoInput = ({ type, setInfo, info }) => {

    const placeholder = `${type}의 정보를 입력해주세요.`
    
    return (
    <textarea
      className="input"
      type="text"
      placeholder={placeholder}
      value={info}
      onChange={({ target: { value } }) => setInfo(value)}
    />
);}

export default InfoInput;