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
    }

}