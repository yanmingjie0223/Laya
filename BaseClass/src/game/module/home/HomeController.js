/*
* name;
*/
var HomeController = (function () {

    function HomeController() {
        HomeController.__super.call(this);
        this.homeView = null;
        this.homeProxy = null;
        this.homeScene = null;

        this.init();
    }

    Laya.class(HomeController, "HomeController", BaseController);
    var _super_ = HomeController.__super.prototype;
    var _proto_ = HomeController.prototype;

    _proto_.init = function(){
        this.homeScene = App.SceneManager.getScene(SceneConst.HOME);
        this.homeView = new HomeView(this, this.homeScene);
        this.homeProxy = new BaseProxy(this);
    }

    _proto_.show = function(){
        this.homeView.show();
    }

    return HomeController;
}());