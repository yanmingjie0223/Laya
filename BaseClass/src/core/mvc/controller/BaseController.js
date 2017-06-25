/*
* name;
*/
var BaseController = (function () {

    function BaseController() {
        this._messages = {};
        this._model = null;
    }

    Laya.class(BaseController, "BaseController");
    var _proto_ = BaseController.prototype;

     /**
     * 注册本模块消息
     * @param key 唯一标识    {any}
     * @param callback 侦听函数  {function}
     * @param thisObj 侦听函数所属对象 {any}
     */
    _proto_.addListener = function(key, callback, thisObj){
        this._messages[key] = [callback, thisObj];
    }

    /**
     * 注销本模块消息
     * @param key 唯一标识    {any}
     */
    _proto_.removeListener = function(key){
        if(this._messages && this._messages[key]){
            delete this._messages[key]
        }
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.dispatch = function(key) {
        var listen = this._messages[key];
        if (listen) {
            var params = [];
            for (var i = 1; i < arguments.length; i++) {
                params[i - 1] = arguments[i];
            }
            return listen[0].apply(listen[1], params);
        } else {
            Logger.trace("消息" + key + "不存在侦听");
            return null;
        }
    }

     /**
     * 触发其他模块消息
     * @param controllerKey 模块标识 {any}
     * @param key 唯一标识  {any}
     * @param ...param:any[]
     */
    _proto_.dispatchController = function(controllerKey, key) {
        return App.ControllerManager.dispatchController.apply(App.ControllerManager, arguments);
    }

    /**
     * 设置该模块使用的Model对象
     * @param model {BaseModel}
     */
    _proto_.setModel = function(model) {
        this._model = model;
    }

    /**
     * 获取该模块的Model对象
     * @returns {BaseModel}
     */
    _proto_.getModel = function() {
        return this._model;
    }

    /**
     * 获取指定Controller的Model对象
     * @param controllerKey Controller唯一标识 {any}
     * @returns {BaseModel}
     */
    _proto_.getControllerModel = function(controllerKey) {
        return App.ControllerManager.getControllerModel(controllerKey);
    }

    return BaseController;
}());