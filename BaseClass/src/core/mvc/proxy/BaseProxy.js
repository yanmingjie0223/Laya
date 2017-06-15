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
    _proto_.applyFunc = function(key) {
        return this._controller.applyFunc.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识 {number}
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.applyControllerFunc = function(controllerKey, key) {
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    }

    /**
     * 注册从服务器返回消息的监听
     * @param key 消息标识 {any}
     * @param callback 处理函数 {function}
     * @param thisObj 处理函数所属对象 {any}
     */
    _proto_.receiveServerMsg = function(key, callback, thisObj) {
        // App.MessageCenter.addListener(key, callback, thisObj);
    }

    return BaseProxy;
}());