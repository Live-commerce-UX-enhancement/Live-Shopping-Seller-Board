import React from 'react';

import './Product.css';

const Product = ({ product }) => {

  return (
    (
      <div className="messageContainer justifyStart">
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{product}</p>
        </div>
      </div>
    )
  );
}

export default Product;