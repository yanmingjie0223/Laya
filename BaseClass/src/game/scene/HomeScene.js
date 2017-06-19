/*
* name;
*/
var HomeScene = (function () {

    function HomeScene() {
        HomeScene.__super.call(this);
    }

    Laya.class(HomeScene, "HomeScene", BaseScene);
    var _proto_ = HomeScene.prototype;

    /**
     * 进入Scene调用
     */
    _proto_.onEnter = function() {
        App.StageUtils.getStage().addChild(this);
        App.ControllerManager.register(ControllerConst.HOME, new HomeController());
    }

    return HomeScene;
}());