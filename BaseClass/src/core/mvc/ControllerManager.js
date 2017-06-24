/*
* name;
*/
var ControllerManager = (function () {

    function ControllerManager() {
        ControllerManager.__super.call(this);
        //BaseController 模块控制类
        this._modules = {};
    }

    Laya.class(ControllerManager, "ControllerManager", BaseClass);
    var _proto_ = ControllerManager.prototype;

    /**
     * 清空处理
     */
    _proto_.clearAll = function(){
        this._modules = {};
    }

    /**
     * 动态添加的Controller
     * @param controllerKey 唯一标识 {any}
     * @param control {BaseController}
     */
    _proto_.register = function(controllerKey, control) {
        if (this.isExists(controllerKey))
            return;
        this._modules[controllerKey] = control;
    }

    /**
     * 动态移除Controller
     * @param controllerKey 唯一标识 {any}
     */
    _proto_.unregister = function(controllerKey){
        if (!this.isExists(controllerKey))
            return;
        this._modules[controllerKey] = null;
        delete this._modules[controllerKey];
    }

    /**
     * 是否已经存在Controller
     * @param controllerKey 唯一标识 {any}
     * @return {Boolean}
     */
    _proto_.isExists = function(controllerKey) {
        return this._modules[controllerKey] != null;
    }

    /**
     * 跨模块消息传递
     * @param controllerKey Controller唯一标识 {any}
     * @param key 消息唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.applyFunc = function(controllerKey, key){
        var manager = this._modules[controllerKey];
        if (manager) {
            var params = [];
            for (var i = 1; i < arguments.length; i++) {
                params[i - 1] = arguments[i];
            }
            return manager.applyFunc.apply(manager, params);
        } else {
            Logger.trace("模块" + controllerKey + "不存在");
            return null;
        }
    }

    /**
     * 获取指定Controller的Model对象
     * @param controllerKey Controller唯一标识 {any}
     * @returns {BaseModel}
     */
    _proto_.getControllerModel = function(controllerKey){
        var manager = this._modules[controllerKey];
        if (manager) {
            return manager.getModel();
        }
        return null;
    }

    /**
     * 获取指定Controller对象
     * @param controllerKey Controller唯一标识 {any}
     * @returns {BaseController}
     */
    _proto_.getController = function(controllerKey){
        var manager = this._modules[controllerKey];
        if (manager) {
            return manager;
        }
        return null;
    }

    return ControllerManager;
}());