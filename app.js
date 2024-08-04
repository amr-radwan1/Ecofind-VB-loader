"use strict";

const http = require("http");
const port = 3000,
    hostname = "localhost";

const server = http.createServer((req,res) =>{
    console.log(`Received a request from ${req.url}`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("index.html");
});

server.listen(port, () =>{
    console.log(`Server running at http://${hostname}:${port}`)
});