/**
 * 此类不需要改动，如要做添加处理（例如：参数）继承此类拓展
 */
class BaseSocket extends BaseEventDispatcher {

    constructor() {
        super();
        this.primus = null;
        this.data = {
            _commKey       : null,  //res加密公钥所用到的key
            token          : null,  //玩家token，在连接初始化时用于res生成公钥
            jwtToken       : null,  //res加密之后的玩家token，数据交互以此token为主
            publicKey      : null,  //res公钥
            connectionUrl  : null,  //连接url
            encryptedString: null,  //res加密后的验证字符串
            isOpened       : false  //连接是否已经初始化过
        };
        Object.assign(this.data, options);
        this.init();
    }

    init() {
        let self = this;
        if (self.inited) { return; }
        self.generateCommKey();
        self.generateEncryptedString();
        self.inited = true;
    }

    setUrl(url) {
        this.data.connectionUrl = url;
    }

    connect() {
        let self = this;
        let primus;
        try {
            primus = this.primus = Primus.connect(self.data.connectionUrl);
            primus.on('outgoing::url', function (url) {
                url.query = 'login=' + self.data.encryptedString;
            });
            primus.on('open', function () {
                Logger.trace("连接成功", self.data.connectionUrl);
                self.event("onOpen");
                
                if (self.initedCont) { return; }
                self.initedCont = true;

                primus.on('data', function (data) {
                    self.onData(data);
                });
                primus.on('error', function (data) {
                    Logger.trace("连接出错", self.data.connectionUrl);
                    self.event("onError", data);
                });
                primus.on('reconnect', function () {
                    Logger.trace("重连中", self.data.connectionUrl);
                    self.event("onReconnect");
                });
                primus.on('disconnect', function () {
                    Logger.trace("连接断开", self.data.connectionUrl);
                    self.event("onDisconnect");
                });
                primus.on('end', function () {
                    Logger.trace("连接已关闭", self.data.connectionUrl);
                    self.event("onEnd");
                });
            });
        } 
        catch (e) {
            self.primus = null;
            Logger.trace(e);
        }

        self.primus = primus;
    }

    onData(data) {
        let self = this;
        //解密
        let decryptstr = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(self.data._commKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        let dataString = decryptstr.toString(CryptoJS.enc.Utf8);
        let parsedData;
        try {
            parsedData = JSON.parse(dataString);
        } 
        catch(e) {
            Logger.trace(data);
            Logger.trace(dataString);
            throw e;
        }
        Logger.trace("%c 接收到数据：", parsedData.cmd, parsedData);
        //更新jwt token
        if (parsedData.cmd == "conn:init") {
            self.data.jwtToken = parsedData.rep;
        } 
        else {
            self.event(parsedData.cmd, parsedData.rep);
        }

    }

    emit(data) {
        let self = this;
        //为data增加token
        if (data.params) {
            data.params.token = self.data.jwtToken;
        } 
        else {
            data.params = {token: self.data.jwtToken};
        }
        data.status = {time: new Date().getTime()};
        Logger.trace("%c 发送数据：", "color:blue", JSON.stringify(data));
        //加密
        let encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(self.data._commKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        //发送加密数据
        self.primus.write(encryptData.toString());
    }

    post (cmd, params) {
        this.emit({cmd: cmd, params: params});
    }

    onAction(cmd, listener, caller) {
        caller = caller || this;
        this.on(cmd, caller, listener);
        return {
            'cmd' : cmd,
            'caller' : caller,
            'listener' : listener
        }; 
    }

    offAction (object){
        if(typeof object === "string"){
            this.offAll(object);
        }
        else if( object && Object.keys(object).length!=0 ){
            this.off(object.cmd, object.caller, object.listener);
        }
    }

    on(cmd, caller, listener) {
        let listenerSign = {cmd:cmd, caller: caller, listener: listener};
        super.on.apply(this, arguments);
        return listenerSign;
    }

    disconnect() {
        this.primus && this.primus.end();
    }

    //生成commkey
    generateCommKey () {
        try {
            this.keyCount = this.keyCount? this.keyCount+1: 0;
            // Logger.trace("初始化可以次数", this.keyCount);
            this.data._commKey = Date.parse(new Date()).toString() + Date.parse(new Date()).toString() + Date.parse(new Date()).toString().substring(0, 6);
        } 
        catch (e) {
            Logger.trace("初始化commKey失败", e);
        }
    }

    //生成encryptedString
    generateEncryptedString () {
        let self = this;
        try {
            let params = "jwt=" + self.data.token + "&commKey=" + self.data._commKey;
            let jsencrypt = new JSEncrypt();
            jsencrypt.setPublicKey(self.data.publicKey);
            self.data.encryptedString = jsencrypt.encrypt(params);
        } 
        catch (e) {
            Logger.trace("初始化encryptedString失败", e);
        }
    }

}