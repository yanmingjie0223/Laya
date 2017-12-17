/*
* name;
*/
class HomeView extends BaseView {

    constructor(controller, scene) {
        super(controller, scene);

        this._btn = null;
        this._btn2 = null;
        this._btn3 = null;
    }

    show() {
        super.show();
        this.loadResource();
    }

    initRes() {
        this.resouce = [
            { url : "res/comp.json", type : Laya.Loader.ATLAS },
            { url : "res/switchButton.json", type : Laya.Loader.ATLAS },
        ]
        super.initRes();
    }

    initView() {
        this._btn = new Laya.Button("res/comp/button.png", "第一个按钮");
        this._btn2 = new Laya.Button("res/comp/button.png", "第二个按钮");
        this._btn3 = new Laya.Button("res/comp/button.png", "第三个按钮");
        this._btn.pos(200, 100);
        this._btn2.pos(200, 300);
        this._btn3.pos(200, 500);
        this._btn.size(200, 100);
        this._btn2.size(200, 100);
        this._btn3.size(200, 100);
        this._btn.labelSize = 30;
        this._btn2.labelSize = 30;
        this._btn3.labelSize = 30;
        this.addChild(this._btn);
        this.addChild(this._btn2);
        this.addChild(this._btn3);
    }

}