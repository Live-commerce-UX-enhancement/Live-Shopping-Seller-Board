import React from 'react';
import Spinner from '../../icons/Spinner.gif';

import './Loading.css';

export default ({target}) => {
  return (
    <div className='Background'>
      <div className='LoadingText'>{target}를 불러오고 있습니다.</div>
      <div className='LoadingText'>잠시만 기다려주세요.</div>
      <img src={Spinner} alt="로딩중" width="40%" />
    </div>
  );
};