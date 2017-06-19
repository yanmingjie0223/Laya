/*
* name;
*/
var MessageCenter = (function () {

    function MessageCenter() {
        MessageCenter.__super.call(this);
        this.dict = {};
    }

    Laya.class(MessageCenter, "MessageCenter", BaseClass);
    var _proto_ = MessageCenter.prototype;

    /**
     * 清空处理
     */
    _proto_.clear = function() {
        this.dict = {};
    }

    /**
     * 添加消息监听
     * @param cmd 消息唯一标识 {string}
     * @param listener 侦听函数 {function}
     * @param listenerObj 侦听函数所属对象 {any}
     */
    _proto_.addListener = function(cmd, listener, listenerObj) {
        var arr = this.dict[cmd];
        if (!arr) {
            arr = [];
            this.dict[cmd] = arr;
        }

        //检测是否已经存在
        var i = 0;
        var len = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                return;
            }
        }

        arr.push([listener, listenerObj]);
    }

    /**
     * 移除消息监听
     * @param cmd 消息唯一标识 {string}
     * @param listener 侦听函数 {function}
     * @param listenerObj 侦听函数所属对象 {any}
     */
    _proto_.removeListener = function(cmd, listener, listenerObj) {
        var arr = this.dict[cmd];
        if (!arr) {
            return;
        }

        var i = 0;
        var len = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }

        if (arr.length == 0) {
            this.dict[cmd] = null;
            delete this.dict[cmd];
        }
    }

    /**
     * 触发消息
     * @param cmd 消息唯一标识 {string}
     * @param param 消息参数 {any}
     */
    _proto_.dispatch = function(cmd, param) {
        if (this.dict[cmd] == null) {
            return;
        }

        var vo = new MessageVo();
        vo.cmd = cmd;
        vo.param = param;
        this.dealMsg(vo);
    }

    /**
     * 处理一条消息
     * @param msgVo {MessageVo}
     */
    _proto_.dealMsg = function(msgVo) {
        var cmd = msgVo.cmd;
        var param = App.CommonUtils.copy(msgVo.param);
        var listeners = this.dict[cmd];
        var i = 0;
        var len = listeners.length;
        var listener = null;
        while (i < len) {
            listener = listeners[i];
            listener[0].apply(listener[1], [param]);
            if (listeners.length != len) {
                len = listeners.length;
                i--;
            }
            i++;
        }
        msgVo.destroy();
    }

    return MessageCenter;
}());


var MessageVo = (function(){

    function MessageVo(){
        this._cmd = null;
        this._param = null
    }

    Laya.class(MessageVo, "MessageVo");
    var _proto_ = MessageVo.prototype;
    var _getset_ = Laya.getset;

    _proto_.destroy = function(){
        this._cmd = null;
        this._param = null;
    }

    _getset_(0, _proto_, "cmd",
        function(){
            return this._cmd;
        },
        function(value){
            this._cmd = value;
        }
    );

    _getset_(0, _proto_, "param",
        function(){
            return this._param;
        },
        function(value){
            this._param = App.CommonUtils.copy(value);;
        }
    );

    return MessageVo;
}())