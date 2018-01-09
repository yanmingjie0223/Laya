/*
* name;
*/
class HomeController extends BaseController {

    constructor() {
        super();
        this.homeView = null;
        this.homeProxy = null;
        this.homeScene = null;

        this._init();
    }

    _init() {
        this.homeScene = App.SceneManager.getScene(SceneConst.HOME);

        this.homeView = new HomeView(this, this.homeScene);
        App.ViewManager.register(ViewConst.HOME, this.homeView);

        this.homeProxy = new BaseProxy(this);

        Laya.Browser.window.protobuf.load("res/protobuf/user.proto", this.protoTest);
    }

    protoTest(err, root) {
        if (err) throw err;
        
		var AwesomeMessage = root.lookup("userInfo");
        // create a object
        var message = {
            userId: 1,
            userName: "kjk"
        }

		// Verify the message if necessary (i.e. when possibly incomplete or invalid)
		var errMsg = AwesomeMessage.verify(message);
		if (errMsg) throw Error(errMsg);

		// Encode a message to an Uint8Array (browser) or Buffer (node)
        // 编码message一定是proto文件中都存在的字段
		var buffer = AwesomeMessage.encode(message).finish();
		
		// Decode an Uint8Array (browser) or Buffer (node) to a message
		var message = AwesomeMessage.decode(buffer);
		// ... do something with message
    }

}