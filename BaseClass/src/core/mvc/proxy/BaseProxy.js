/*
* name;
*/
var BaseProxy = (function () {

    /**
     * 构造函数
     * @param controller {BaseController}
     */
    function BaseProxy(controller) {
        this._controller = controller;
    }

    Laya.class(BaseProxy, "BaseProxy");
    var _proto_ = BaseProxy.prototype;

    /**
     * 触发本模块消息
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.dispatch = function(key) {
        return this._controller.dispatch.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识 {number}
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.dispatchController = function(controllerKey, key) {
        return this._controller.dispatchController.apply(this._controller, arguments);
    }

    /**
     * 注册从服务器返回消息的监听
     * @param cmd 消息标识 {any}
     * @param callback 处理函数 {function}
     * @param thisObj 处理函数所属对象 {any}
     */
    _proto_.addListener = function(cmd, callback, thisObj) {
        App.MessageCenter.addListener(cmd, callback, thisObj);
    }

    /**
     * 注册从服务器返回消息的监听，仅一次，执行完成后删除
     * @param cmd 消息标识 {string}
     * @param callbackFunc 处理函数 {function}
     * @param callbackObj 处理函数所属对象 {any}
     */
    _proto_.addListenerOnce = function(cmd, callbackFunc, callbackObj) {
        var callback = function() {
            this.removeListener(cmd, callback, this);
            callbackFunc.apply(callbackObj, arguments);
        }
        this.addListener(cmd, callback, this);
    }

    /**
     * 移除服务端返回消息的监听
     * @param cmd 消息标识 {string}
     * @param callbackFunc 处理函数 {function}
     * @param callbackObj 处理函数所属对象 {any}
     */
    _proto_.removeListener = function(cmd, callbackFunc, callbackObj) {
        App.MessageCenter.removeListener(cmd, callbackFunc, callbackObj);
    }

    /**
     * 发送消息到Socket服务器
     * @param cmd指令 {string}
     * @param 消息参数内容 {Object}
     */
    _proto_.sendSocketMsg = function(cmd, msg) {
        App.Socket.post(cmd, msg);
    }

    /**
     * 发送消息到Http服务端
     * @param cmd 消息标识 例如: User.login {string}
     * @param msg 消息参数 例如: var msg:any = {"uName":uName, "uPass":uPass}; {Object}
     */
    _proto_.sendHttpMsg = function(cmd, msg) {

    }

    return BaseProxy;
}());