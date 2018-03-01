/*
* name;
*/
class BaseController {

    constructor() {
        this._messages = {};
        this._model = null;
    }

    /**
     * 注册本模块消息
     * @param {any} key 唯一标识
     * @param {Function} callback 侦听函数
     * @param {any} thisObj 侦听函数所属对象
     */
    addListener(key, callback, thisObj){
        this._messages[key] = [callback, thisObj];
    }

    /**
     * 注销本模块消息
     * @param {any} key 唯一标识
     */
    removeListener(key){
        if(this._messages && this._messages[key]){
            delete this._messages[key]
        }
    }

    /**
     * 触发本模块消息
     * @param {any} key 唯一标识
     * @param ...args:any[]
     */
    dispatch(key, ...args) {
        let listen = this._messages[key];
        if (listen) {
            return listen[0].apply(listen[1], args);
        } 
        else {
            Logger.trace("消息" + key + "不存在侦听");
            return null;
        }
    }

     /**
     * 触发其他模块消息
     * @param {any} controllerKey 模块标识
     * @param {any} key 唯一标识
     * @param ...param:any[]
     */
    dispatchController(controllerKey, key) {
        return App.ControllerManager.dispatchController.apply(App.ControllerManager, arguments);
    }

    /**
     * 设置该模块使用的Model对象
     * @param {BaseModel} model
     */
    setModel(model) {
        this._model = model;
    }

    /**
     * 获取该模块的Model对象
     * @returns {BaseModel}
     */
    getModel() {
        return this._model;
    }

    /**
     * 获取指定Controller的Model对象
     * @param {any} controllerKey Controller唯一标识
     * @returns {BaseModel}
     */
    getControllerModel(controllerKey) {
        return App.ControllerManager.getControllerModel(controllerKey);
    }

}