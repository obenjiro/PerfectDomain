/**
 * Created by alexey.okhrimenko on 13.01.14.
 */
var http = require('http');
var perfectDomain = require('./perfect-domain').perfectDomain;
var fs = require('fs');


function MethodThatCauseException(res) {
    setTimeout(function(){
        process.nextTick(function(){
            throw new Error('Exception happen. We can\'t handle it');
            res.end('Hello world');
        });
    },100);
}

http.createServer(function (req, res) {

    perfectDomain(function(){

        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;

        fs.readFile('non-existant-file-name', 'utf8', function(err){
            setTimeout(function(){
                throw err;
            }, 200);
        });

        setTimeout(function(){
            MethodThatCauseException(res);
        }, 100);

    }, function(err){

        res.statusCode = 500;
        res.end("Catched Error: " + err.toString());

        return true;

    })

}).listen(8001, '127.0.0.1');



console.log('Server running at http://127.0.0.1:8001/');