/*
* name;
*/
class MessageCenter extends BaseClass {

    constructor() {
        super();
        this.dict = {};
    }

    /**
     * 清空处理
     */
    clear() {
        this.dict = {};
    }

    /**
     * 添加消息监听
     * @param cmd 消息唯一标识 {string}
     * @param listener 侦听函数 {function}
     * @param listenerObj 侦听函数所属对象 {any}
     */
    addListener(cmd, listener, listenerObj) {
        let arr = this.dict[cmd];
        if (!arr) {
            arr = [];
            this.dict[cmd] = arr;
        }

        //检测是否已经存在
        for (let i = 0, len = arr.length; i < len; i++) {
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
    removeListener(cmd, listener, listenerObj) {
        let arr = this.dict[cmd];
        if (!arr) {
            return;
        }

        for (let i = 0, len = arr.length; i < len; i++) {
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
    dispatch(cmd, param) {
        if (!this.dict[cmd]) { return; }

        let vo = new MessageVo();
        vo.cmd = cmd;
        vo.param = param;
        this.dealMsg(vo);
    }

    /**
     * 处理一条消息
     * @param msgVo {MessageVo}
     */
    dealMsg(msgVo) {
        let cmd = msgVo.cmd;
        let param = App.CommonUtils.copy(msgVo.param);
        let listeners = this.dict[cmd];
        if (!listeners) { return; }

        for (let i = 0, len = listeners.length; i < len; i++) {
            let listener = listeners[i];
            listener[0].apply(listener[1], [param]);
        }
        msgVo.destroy();
    }

}

/**
 * 单挑消息
 */
class MessageVo {

    constructor() {}

    destroy(){
        this._cmd = null;
        this._param = null;
    }

    get cmd() {
        return this._cmd;
    }

    set cmd(value) {
        this._cmd = value;
    }

    get param() {
        return this._param;
    }

    set param(value) {
        this._param = App.CommonUtils.copy(value);
    }

}