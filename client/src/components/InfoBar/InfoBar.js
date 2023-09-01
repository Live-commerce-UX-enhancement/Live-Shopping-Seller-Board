import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ intend }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <h3>{intend}</h3>
    </div>
  </div>
);

export default InfoBar;