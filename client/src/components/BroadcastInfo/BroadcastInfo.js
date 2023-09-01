import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string';
import io from "socket.io-client";

import Products from '../Products/Products';

const ENDPOINT = 'http://localhost:5000/';

let socket;

const BroadcastInfo = ({ location }) => {
  const [broadcastId, setBroadcastId] = useState('');
  const [products, setProducts] = useState([]);
  

  useEffect(() => {
    const { broadcastId } = queryString.parse(location.search);
    setBroadcastId(broadcastId);

    socket = io(ENDPOINT);

    socket.emit('join', { broadcastId }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('product', product => {
      setProducts(products => [ ...products, JSON.stringify(product) ]);
    });

  }, []);

  const getProducts = (event) => {
    event.preventDefault();

    socket.emit('products');

  }

  return (
    <div className="outerContainer">
      <div className="container">
          <Products products={products}/>
          
          <button className="sendButton" onClick={e => getProducts(e)}>get Products</button>

          <Link onClick={e => null} to={`/chat?broadcastId=${broadcastId}`}>
            <button className={'sendButton'} type="submit">Next Page</button>
          </Link>
      </div>
    </div>
  );
}

export default BroadcastInfo;
