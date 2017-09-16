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
     * @param key 唯一标识    {any}
     * @param callback 侦听函数  {function}
     * @param thisObj 侦听函数所属对象 {any}
     */
    addListener(key, callback, thisObj){
        this._messages[key] = [callback, thisObj];
    }

    /**
     * 注销本模块消息
     * @param key 唯一标识    {any}
     */
    removeListener(key){
        if(this._messages && this._messages[key]){
            delete this._messages[key]
        }
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识 {any}
     * @param ...params:any[]
     */
    dispatch(key, ...params) {
        let listen = this._messages[key];
        if (listen) {
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
    dispatchController(controllerKey, key) {
        return App.ControllerManager.dispatchController.apply(App.ControllerManager, arguments);
    }

    /**
     * 设置该模块使用的Model对象
     * @param model {BaseModel}
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
     * @param controllerKey Controller唯一标识 {any}
     * @returns {BaseModel}
     */
    getControllerModel(controllerKey) {
        return App.ControllerManager.getControllerModel(controllerKey);
    }

}