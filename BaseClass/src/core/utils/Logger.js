/*
* name;
*/
var Logger = (function () {

    function Logger() {}

    Laya.class(Logger, "Logger");

    Logger.trace = function(){
        if (App.DebugUtils.isDebug) {
            console.log.apply(console, arguments);
        }
    }

    return Logger;
}());