/*
* name;
*/
class ControllerManager extends BaseClass {

    constructor() {
        super();
        this._modules = {};
    }

    /**
     * 清空处理
     */
    clearAll() {
        this._modules = {};
    }

    /**
     * 动态添加的Controller
     * @param controllerKey 唯一标识 {any}
     * @param controller {BaseController}
     */
    register(controllerKey, controller) {
        if (this.isExists(controllerKey))
            return;
        this._modules[controllerKey] = controller;
    }

    /**
     * 动态移除Controller
     * @param controllerKey 唯一标识 {any}
     */
    unregister(controllerKey) {
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
    isExists(controllerKey) {
        return !!this._modules[controllerKey];
    }

    /**
     * 跨模块消息传递
     * @param controllerKey Controller唯一标识 {any}
     * @param key 消息唯一标识 {any}
     * @param ...param:any[]
     */
    dispatchController(controllerKey, ...args){
        let controller = this._modules[controllerKey];
        if (controller) {
            return controller.dispatch.apply(controller, args);
        }
        else {
            Logger.trace("模块" + controllerKey + "不存在");
            return null;
        }
    }

    /**
     * 获取指定Controller的Model对象
     * @param controllerKey Controller唯一标识 {any}
     * @returns {BaseModel}
     */
    getControllerModel(controllerKey){
        let manager = this._modules[controllerKey];
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
    getController(controllerKey){
        let controller = this._modules[controllerKey];
        if (controller) {
            return controller;
        }
        return null;
    }

}