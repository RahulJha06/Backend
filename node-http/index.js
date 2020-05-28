const http = require('http');
const port = 3000;
const hostname = "localhost";

const server = http.createServer((req,res) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type','text/html');
  res.end('Hello World.');
})

server.listen(port,hostname,()=>{
    console.log(`server listening at http://${hostname}:${port}`)
});
