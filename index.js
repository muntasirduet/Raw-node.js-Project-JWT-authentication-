//dependencies section

const http = require('http');

const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

//module scafolding
const app = {}


app.createServer = () => {
    const server =  http.createServer(app.handleReqRes);
    server.listen(environment.port,() => {
        console.log(`Listening port ${environment.port}`);
    });
}

app.handleReqRes = handleReqRes;

app.createServer();