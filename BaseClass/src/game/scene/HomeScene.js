/*
* name;
*/
var HomeScene = (function () {

    function HomeScene() {
        HomeScene.__super.call(this);
    }

    Laya.class(HomeScene, "HomeScene", BaseScene);
    var _proto_ = HomeScene.prototype;
    var _super_ = HomeScene.__super.prototype;

    /**
     * 进入Scene调用
     */
    _proto_.onEnter = function() {
        _super_.onEnter.call(this);

        //注册控制类
        App.ControllerManager.register(ControllerConst.HOME, new HomeController());

        //控制显示view
        App.ViewManager.show(ViewConst.HOME);
    }

    /**
     * 退出Scene调用
     */
    _proto_.onExit = function() {
        _super_.onExit.call(this);
    }

    return HomeScene;
}());