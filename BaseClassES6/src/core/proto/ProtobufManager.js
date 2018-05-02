/*
* name;
*/
class ProtobufManager extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 获取message类
     * @param {string} protoUrl proto文件地址
     * @param {string} messageName 消息类名
     * @param {Funtion} callback 回调函数
     * @param {any} thisObj this对象
     * for example:
     * let MessageClass = App.ProtobufManager.getMessageClass(protoUrl, messageName, callback, thisObj);
     * let message = MessageClass.create({
     *      name: "",
     *      age : 10
     * });
     */
    getMessageClass(protoUrl, messageName, callback, thisObj = null) {
        let protobuf = Laya.Browser.window.protobuf;
        protobuf.load(protoUrl, (err, root) => {
            if (err) throw err;
            let messageClass = root.lookup(messageName);
            callback && callback.apply(thisObj, [messageClass]);
        });
    }

    /**
     * 消息验证
     * @param {message} messageClass message类
     * @param {object} message 验证消息
     * for example:
     * App.ProtobufManager.verify(MessageClass, message);
     */
    verify(messageClass, message) {
        var errMsg = messageClass.verify(message);
		if (errMsg) throw Error(errMsg);
    }

    /**
     * 序列化
     * @param {message} messageClass message类
     * @param {object} message 验证消息
     * @return {Buffer} 二进制序列化数据
     * for example:
     * let messageBuffer = App.ProtobufManager.encode(MessageClass, message);
     */
    encode(messageClass, message) {
        return messageClass.encode(message).finish();
    }

    /**
     * 反序列化
     * @param {message} messageClass message类
     * @param {object} message  验证消息
     * @return {object} 数据对象
     * for example:
     * let message = App.ProtobufManager.encode(MessageClass, messageBuffer);
     */
    decode(messageClass, buffer) {
        return messageClass.decode(buffer).finish();
    }

}