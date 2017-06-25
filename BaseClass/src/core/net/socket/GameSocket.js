/*
* name;
*/
var GameSocket = (function () {

    function GameSocket(options) {
        GameSocket.__super.call(this, options);
    }

    Laya.class(GameSocket, "GameSocket", BaseSocket);
    var _proto_ = GameSocket.prototype;
    var _super_ = GameSocket.__super.prototype;

    /**
     * 继承重写发送类，改为向消息中心发送消息
     */
    _proto_.event = function(cmd, data){
        _super_.event.apply(this, arguments);
        App.MessageCenter.dispatch.apply(App.MessageCenter, arguments);
    }

    return GameSocket;
}());