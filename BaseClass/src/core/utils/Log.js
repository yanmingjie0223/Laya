/*
* name;
*/
var Log = (function () {

    function Log() {}

    Laya.class(Log, "Log");

    Log.trace = function(){
        if (App.DebugUtils.isDebug) {
            console.log.apply(console, arguments);
        }
    }

    return Log;
}());