# node-file-sharing-api
Node.js file sharing api server.

Installation
Required: NodeJS >= 10.15.3

1. create new mysql database
2. cd into project root
3. copy .env.example to .env and set PORT & NET_INTERFACE and database credentials.
4. update the .env variables like, PORT and NET_INTERFACE for running the server. to connect Db update DB_HOST, DB_PORT, DB_USER, DB_USER_PASSWORD, DB_NAME 
5. run sql schema from project_root/schema/files.sql to your database
6. open terminal or command prompt from root folder
7. npm install
8. npm start
