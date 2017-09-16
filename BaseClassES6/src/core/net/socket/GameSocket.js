/*
* name;
*/
class GameSocket extends BaseSocket {

    constructor() {
        super();
    }

    /**
     * 继承重写发送类，改为向消息中心发送消息
     * cmd, data
     */
    event(...args){
        super.event.apply(this, args);
        App.MessageCenter.dispatch.apply(App.MessageCenter, args);
    }

}