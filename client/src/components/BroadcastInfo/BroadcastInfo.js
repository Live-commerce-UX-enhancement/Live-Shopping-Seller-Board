import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import queryString from 'query-string';
import io from "socket.io-client";

import Products from '../Products/Products';
import InfoInput from './InfoInput/InfoInput';

import Loading from '../Loading/Loading';

import './BroadcastInfo.css';

const ENDPOINT = 'http://13.251.142.57:5000/';
// const ENDPOINT = 'http://localhost:5000/';
const QASERVER = 'http://18.141.54.174/:8000/'

let socket;

const BroadcastInfo = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState('');
  const [detail, setDetail] = useState(false);

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
      setLoading(false);
    })

  }, []);

  const getProducts = () => {
    setLoadingInfo('제품 정보를 불러오는 중 입니다.');
    socket.emit('products');
    setLoading(true);
  }

  const sendBroadcastInfo = (event) => {
    setLoadingInfo('정보를 등록하는 중 입니다.');
    event.preventDefault();
    setLoading(true);

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
        setLoading(false);
        setDetail(true);
      })
      .catch((error) => console.log(error));

  }

  return (
    <div>
      {loading ? <Loading info={loadingInfo}/> : 
        <div className="outerContainer">
        <div className="container">
  
            <form>
  
              <div className="infoContainer justifyStart">
                <div className="infoBox backgroundLight">
                  <p className="infoName colorDark">방송 정보</p>
                  <InfoInput type={"방송"} setInfo={setBroadcastInfo} info={broadcastInfo} />
                </div>
              </div>

              <div className="infoContainer justifyStart">
                <div className="infoBox backgroundLight">
                  <p className="infoName colorDark">이벤트 정보</p>
                  <InfoInput type={"이벤트"} setInfo={setEventInfo} info={eventInfo} />
                </div>
              </div>
  
              <Products products={products}/>
  
              <div className="containerBottom">
                <button className={'broadcastInfoButton'} type="submit" onClick={e => sendBroadcastInfo(e)}>상품 정보 저장</button>
  
                <Link onClick={e => {if (!detail) {
                  e.preventDefault();
                  alert("상품 정보를 입력해주세요.");
                }}} to={detail ? `/chat?broadcastId=${broadcastId}` : '#'}>
                  <button className={'broadcastInfoButton'} type="submit" >Next Page</button>
                </Link>
              </div>
            </form>
  
          </div>
        </div> 
      }
    </div>
    
  );
}

export default BroadcastInfo;
