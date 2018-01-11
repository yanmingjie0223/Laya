/*
* name;
*/
class HomeScene extends BaseScene {

    constructor() {
        super();
    }

    /**
     * 进入Scene调用
     */
    onEnter() {
        super.onEnter();

        //注册控制类
        App.ControllerManager.register(ControllerConst.HOME, new HomeController());

        //控制显示view
        App.ViewManager.show(ViewConst.HOME, this);
    }

    /**
     * 退出Scene调用
     */
    onExit() {
        super.onExit();
    }

}