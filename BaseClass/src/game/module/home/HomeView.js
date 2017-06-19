/*
* name;
*/
var HomeView = (function () {

    function HomeView(controller) {
        HomeView.__super.call(this, controller);
        this.btn = null;
        this.btn2 = null;
        this.btn3 = null;
    }

    Laya.class(HomeView, "HomeView", BaseView);
    var _super_ = HomeView.__super.prototype;
    var _proto_ = HomeView.prototype;

    _proto_.initRes = function(){
        _super_.initRes.call(this);
        var res = [
            {url:"res/atlas/comp.json", type:"atlas"}
        ]
        this.resouce = res;
    }

    _proto_.show = function(scene){
        _super_.show.apply(this, arguments);
        this.loadResource();
    }

    _proto_.initView = function(){
        this.btn = new Laya.Button("comp/button.png", "第一个按钮");
        this.btn2 = new Laya.Button("comp/button.png", "第二个按钮");
        this.btn3 = new Laya.Button("comp/button.png", "第三个按钮");
        this.btn.pos(200, 100);
        this.btn2.pos(200, 300);
        this.btn3.pos(200, 500);
        this.btn.size(200, 100);
        this.btn2.size(200, 100);
        this.btn3.size(200, 100);
        this.btn.labelSize = 30;
        this.btn2.labelSize = 30;
        this.btn3.labelSize = 30;
        this.addChild(this.btn);
        this.addChild(this.btn2);
        this.addChild(this.btn3);
    }

    return HomeView;
}());