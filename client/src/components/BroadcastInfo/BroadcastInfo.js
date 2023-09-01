import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string';
import io from "socket.io-client";

import Products from '../Products/Products';
import InfoInput from './InfoInput/InfoInput'

import './BroadcastInfo.css';

const ENDPOINT = 'http://localhost:5000/';
const QASERVER = 'http://15.164.68.124:8000/'

let socket;

const BroadcastInfo = ({ location }) => {
  const [broadcastId, setBroadcastId] = useState('');
  const [products, setProducts] = useState([]);

  const [broadcastInfo, setBroadcastInfo] = useState('');
  const [eventInfo, setEventInfo] = useState('');
  

  useEffect(() => {
    const { broadcastId } = queryString.parse(location.search);
    setBroadcastId(broadcastId)

    socket = io(ENDPOINT);

    socket.emit('join', { broadcastId }, (error) => {
      if(error) {
        alert(error);
      }
    });

    getProducts();

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('product', product => {
      product.info = "";
      setProducts(products => [ ...products, product ]);
    });

    socket.on('product-end', () => {
      socket.emit('disconnect');
    })

  }, []);

  const getProducts = () => {
    socket.emit('products');
  }

  const sendBroadcastInfo = (event) => {
    event.preventDefault();

    var detail = {};
    
    detail.broadcast = [
      {"type" : "broadcast", "texts" : broadcastInfo.split("\n")}, 
      {"type" : "event", "texts" : eventInfo.split("\n")}
    ];

    detail.product = [];

    products.forEach(product => {
      detail.product.push({
        "id" : product.id,
        "name" : product.name,
        "texts" : product.info.split("\n")
      });
    })

    const jsonData = JSON.stringify(detail);

    const othePram = {
      headers: {
        'content-type': 'application/json',
      },
      body: jsonData,
      method: 'POST',
    };

    fetch(QASERVER + broadcastId + "/detail", othePram)
      .then((data) => {return data.json()})
      .then((res) => {
        console.log("response");
        console.log(res);
      })
      .catch((error) => console.log(error));

  }

  return (
    <div className="outerContainer">
      <div className="container">

          <form>

            <InfoInput type={"방송"} setInfo={setBroadcastInfo} info={broadcastInfo} />

            <InfoInput type={"이벤트"} setInfo={setEventInfo} info={eventInfo} />

            <Products products={products}/>

            <div className="containerBottom">
              <button className={'broadcastInfoButton'} type="submit" onClick={e => sendBroadcastInfo(e)}>상품 정보 저장</button>

              <Link onClick={e => null} to={`/chat?broadcastId=${broadcastId}`}>
                <button className={'broadcastInfoButton'} type="submit">Next Page</button>
              </Link>
            </div>
          </form>

      </div>
    </div>
  );
}

export default BroadcastInfo;
