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
        App.ResourceUtils.loadResource([{url: "res/protobuf/user.proto", type: Laya.Loader.TEXT}], this.protoTest, null, this);
    }

    protoTest() {
        let protoInfo = Laya.loader.getRes("res/protobuf/user.proto");
        let message = dcodeIO.ProtoBuf.loadProto(protoInfo);
        let userInfoClass = message.build("userInfo");
        let userInfo = new userInfoClass();
        userInfo.userId = 123;
        userInfo.userName = "peter";
        //转换成二进制
        let bytes = userInfo.toArrayBuffer();

        this.parsing(bytes);
    }

    parsing(bytes) {
        let userInfoStr = bytes.toString();
        let message = dcodeIO.ProtoBuf.loadProto(userInfoStr);
        let userInfoClass = message.build("userInfo");
        let userInfo = new userInfoClass();
    }

}