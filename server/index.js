const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addRoom, removeRoom, getRoom } = require('./rooms');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const puppeteer = require('puppeteer');
const classifierUrl = "https://03u09n51hb.execute-api.ap-northeast-2.amazonaws.com/classifier_api/classify";

app.use(cors());
app.use(router);

io.on('connect', (socket) => {

  socket.on('join', ({ broadcastId }, callback) => {

    const broadcastUrl = `https://view.shoppinglive.naver.com/lives/${broadcastId}?tr=lim&fm=shoppinglive&sn=home`

    const { error, room } = addRoom({ id: socket.id, broadcastUrl: broadcastUrl, broadcastId: broadcastId });

    if(error) return callback(error);

    socket.join(room);

    callback();
  });

  // socket.on('disconnect', () => {
  //   const user = removeUser(socket.id);

  //   if(user) {
  //     io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
  //     io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
  //   }
  // })

  socket.on('products', () => {

    const room = getRoom(socket.id);

    (async() => {
      const browser = await puppeteer.launch({args : [
        '--no-sandbox',
        '--disable-background-networking',
        '--disable-client-side-phishing-detection',
        '--disable-default-apps',
        '--disable-features=site-per-process',
        '--disable-hang-monitor',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--disable-web-security',
        '--enable-automation',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--single-process',
        '--no-zygote',
        '--no-first-run',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-skip-list',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--hide-scrollbars',
        '--disable-notifications',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-extensions',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--mute-audio'], autoClose : false});
        const page = await browser.newPage();

        await page.goto(room.broadcastUrl);

        const session_for_products = await page.target().createCDPSession();
        await session_for_products.send('Network.enable');

        session_for_products.on('Network.webSocketFrameReceived', (Network) => {
            var payloadData = Network.response.payloadData;
            payloadData = payloadData.replace(/^\d+/, '');
            if (payloadData != 'probe' & payloadData != '') {
            
                var data_list = JSON.parse(payloadData);

                if (data_list[0] == 'broadcast_shopping_product') {
                    var product_list = JSON.parse(data_list[1]);
                    var product_name_list = [];
                    
                    product_list.forEach(product => {
                      var product_item = JSON.stringify({'id' : product["key"],'name' : product["name"]});
                      socket.emit('product', { product: `${product_item}`});
                    })

                    session_for_products.detach();
                    page.close();
                    browser.close();

                }
            }
        });
    })();
  })

  socket.on('getChats', () => {
    const room = getRoom(socket.id);

    (async() => {
      const browser = await puppeteer.launch({args : [
        '--no-sandbox',
        '--disable-background-networking',
        '--disable-client-side-phishing-detection',
        '--disable-default-apps',
        '--disable-features=site-per-process',
        '--disable-hang-monitor',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--disable-web-security',
        '--enable-automation',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--single-process',
        '--no-zygote',
        '--no-first-run',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-skip-list',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--hide-scrollbars',
        '--disable-notifications',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-extensions',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--mute-audio'], autoClose : false});
        const page = await browser.newPage();

        await page.goto(room.broadcastUrl);

        var broadcastId = room.broadcastId;

        const session_for_chat = await page.target().createCDPSession();
        const session_for_time = await page.target().createCDPSession();
        await session_for_chat.send('Network.enable');
        await session_for_time.send('Network.enable');

        var last_comment_no = 0;

        // Live shopping 채팅 받아오는 곳
        session_for_chat.on('Network.webSocketFrameReceived', (Network) => {

          var payloadData = Network.response.payloadData;
          payloadData = payloadData.replace(/^\d+/, '');
          if (payloadData != 'probe' & payloadData != '') {
            var data_list = JSON.parse(payloadData);

            if (data_list[0] == 'broadcast') {
              // Loading 시, 이전 채팅 불러오기
              const chat_url = `https://apis.naver.com/live_commerce_web/live_commerce_web/v1/broadcast/${broadcastId}/recent-comments?next=${last_comment_no}&size=20`

              fetch(chat_url)
              .then((response) => response.json())
              .then((data) => {
                // python 의도 분류 모델 서버에 전송
                // ws.send(JSON.stringify(request_data));
                // 파라미터
                const othePram = {
                  headers: {
                    'content-type': 'application/json',
                  },
                  body: JSON.stringify(data),
                  method: 'POST',
                };

                fetch(classifierUrl, othePram)
                  .then((data) => {return data.json()})
                  .then((res) => {
                    console.log("response");

                    res = JSON.stringify(res);

                    socket.emit('message', { user: 'admin', text: `${res}`});

                  })
                  .catch((error) => console.log(error));
              });
            }
            
            if (data_list[0] == 'broadcast_chat') {
              var request_data = JSON.parse(data_list[1]);
              // python 의도 분류 모델 서버에 전송
              console.log("request");
              console.log(request_data);

              // 파라미터
              const othePram = {
                headers: {
                  'content-type': 'application/json',
                },
                body: JSON.stringify(request_data),
                method: 'POST',
              };

                fetch(classifierUrl, othePram)
                  .then((data) => {return data.json()})
                  .then((res) => {
                    console.log("response");

                    res = JSON.stringify(res);

                    socket.emit('message', { user: 'admin', text: `${res}`});
                  })
                  .catch((error) => console.log(error));

              // ws.send(JSON.stringify(request_data));
              last_comment_no = request_data['next'];
            }
          }
        });

        // 방송 지연 시간 확인 및 새로고침
        session_for_time.on('Network.responseReceived', (Network) => {
          if (typeof Network.response.headers.date !== 'undefined') {
            var page_time = new Date(Network.response.headers.date);
            page_time = page_time.getTime();

            var diff_time = new Date(Date.now() - page_time);
            
            // console.log(`방송 지연 시간 : ${diff_time.getMinutes()}분, ${diff_time.getSeconds()}초, ${diff_time.getMilliseconds()}밀리초`);
            
            if (3000 <= diff_time.getTime() && diff_time.getTime() <= 30000){
              // 방송 화면 새로고침
              page.reload();
            }
          }
        })

    })();
  })

});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));