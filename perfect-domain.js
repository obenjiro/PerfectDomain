require('trace');
var setFunctionName = require('function-name');

// There is no limit for the size of the stack trace (v8 default is 10)
Error.stackTraceLimit = Infinity;

var perfectDomainIndex = 0;
var perfectDomainFailCallbackHash = {};

var KEY_STATICK_PART = "!!!perfectDomain_magic_keyword!!!";
var TIME_TILL_SHUTDOWN = 5000;

process.on('uncaughtException', function (err) {

    console.log(err.stack);

    var key = perfectDomainKeyFromString(err.stack);
    var failCallback = perfectDomainFailCallbackHash[key];

    if (failCallback) {
        var shouldContinueRunning = failCallback(err);
        if (shouldContinueRunning) {

            //well let's swallow this exception

        } else {
            //if we don't rethrow here or exit from process we have even more problems
            //connection will hang until timeout will be fired
            setTimeout(function(){
                process.exit(1);
            }, TIME_TILL_SHUTDOWN);
        }
    }

});

function perfectDomain(successCallback, failCallback){

    perfectDomainIndex++;
    perfectDomainFailCallbackHash[KEY_STATICK_PART + perfectDomainIndex] = failCallback;

    setFunctionName(successCallback, KEY_STATICK_PART + perfectDomainIndex);
    successCallback();
    //var temp = {};
    //temp[KEY_STATICK_PART + perfectDomainIndex] = successCallback;
    //temp[KEY_STATICK_PART + perfectDomainIndex]();
}

function perfectDomainKeyFromString( value ){

    var regexp = new RegExp(KEY_STATICK_PART + "(\\d)+");
    if (regexp.test(value)){
        return value.match(regexp)[0];
    } else {
        return '';
    }

}

exports.perfectDomain = perfectDomain;