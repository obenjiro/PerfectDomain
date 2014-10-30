PerfectDomain
=============

A domain that works in any situation

Tested on Node 0.11.12 only! ( use nvm )

Execute `npm i; sh run.sh` to start


    perfectDomain(function(){

        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 200;


        // notice? no domain.bind :) or anything, just works
        fs.readFile('non-existent-file-name', 'utf8', function(err){
            setTimeout(function(){
                throw err;
            }, 200);
        });

    }, function(err){

        res.statusCode = 500;
        res.end("Catched Error: " + err.toString());

        // return true if we want Node.js process continue to work
        return true;

    })
