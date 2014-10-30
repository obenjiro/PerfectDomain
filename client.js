/**
 * Created by alexey.okhrimenko on 13.01.14.
 */
var http = require('http');

var options = {
    host: '127.0.0.1',
    port: 8001,
    path: '/',
    method: 'GET'
};

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/plain'});

    //here we making request to our servers
    var reqToServer = http.request(options, function(resToClient) {
        //and here is response from server
        res.write('STATUS: ' + resToClient.statusCode);
        console.log('request: ' + resToClient.statusCode);
        res.write('\nHEADERS: ' + JSON.stringify(resToClient.headers));
        resToClient.setEncoding('utf8');
        resToClient.on('data', function (chunk) {
            res.write('\nBODY: ' + chunk);
            res.end();
        });
    });

    reqToServer.setTimeout(2000, function(){
        //timeout works, but it's not performance wise solution
        //and t\o is general event
        //we don't know what caused that timeout.
        res.write('\ntimeout');
        res.end();
    });

    reqToServer.on('error', function(e) {
        //ok we get that exception really fast
        //but we have general information for ALL server exceptions
        //we don't know what cause that exception.
        res.write('\nproblem with request: ' + e.message);
        res.end();
    });

    reqToServer.end();


}).listen(8000, '127.0.0.1');


console.log('Client running at http://127.0.0.1:8000/');