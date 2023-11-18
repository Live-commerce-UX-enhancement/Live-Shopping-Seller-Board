# Live Shopping Seller Board

1. AWS EC2 인스턴스 생성
2. 생성한 EC2 인스턴스 접속 후 repository git clone 
3. Live-Shopping-Seller-Board/client/src/config.js 파일 수정
    - NodeJS_URL : {해당 EC2 인스턴스 주소}
    - PythonQA_URL : {자동 답변 생성 프로젝트의 EC2 인스턴스 주소}
4. Live-Shopping-Seller-Board/client/src/components/Chat/Chat.js 파일 수정
    - 43번째줄 : `const pythonWs = new WebSocket(’{자동 답변 생성 프로젝트의 EC2 인스턴스 주소}/ws/’+ boradcastId);`
5. server 실행
    
    ```bash
    $ cd server
    $ npm start 
    ```
    
6. client 실행
    
    ```bash
    $ cd client
    $ npm start
    ```
