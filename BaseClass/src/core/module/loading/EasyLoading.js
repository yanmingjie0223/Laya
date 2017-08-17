/*
* name;
*/
var EasyLoading = (function () {

    function EasyLoading() {
        EasyLoading.__super.call(this);
        this._content = null;
        this._uiImageContainer = null;
        this._timeKey = null;
        this.initView();
    }

    Laya.class(EasyLoading, "EasyLoading", BaseClass);
    var _proto_ = EasyLoading.prototype;

    _proto_.initView = function() {
        var self = this;

        self._content = new Laya.Sprite();
        self._content.mouseEnabled = true;
        self._content.alpha = 0.4;

        self._uiImageContainer = new Laya.Sprite();
        self._content.addChild(self._uiImageContainer);

        var url = App.ResourceUtils.getUrl("loading", "load_Reel", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            var img = App.DisplayUtils.createImage(0, 0, url, self._uiImageContainer);
            img.pivot(img.width>>1, img.height>>1);
        }, null);
    }

    /**
     * 更新背景黑色
     */
    _proto_.initBG = function() {
        this._content.graphics.clear();
        this._content.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH, "#000000");
        this._content.size(App.StageUtils.stageW, App.StageUtils.stageH);
    }

    /**
     * 显示加载旋转界面
     */
    _proto_.show = function() {
        App.StageUtils.stage.addChild(this._content);
        this.onResize();
        clearTimeout(this._timeKey);
        this._timeKey = setTimeout(this.enterFrame.bind(this), 200);
        App.StageUtils.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

     /**
     * 关闭加载旋转界面
     */
    _proto_.close = function() {
        App.StageUtils.stage.off(Laya.Event.RESIZE, this, this.onResize);
        if (this._content) {
            this._content.graphics.clear();
            this._content.removeSelf();
            this._uiImageContainer.rotation = 0;
        }
        clearTimeout(this._timeKey);
    }

    /**
     * 旋转
     */
    _proto_.enterFrame = function() {
        var rota = this._uiImageContainer.rotation + 30;
        rota = rota % 360;
        this._uiImageContainer.rotation = rota;
        this._timeKey = setTimeout(this.enterFrame.bind(this), 200);
    }

    /**
     * 适配
     */
    _proto_.onResize = function() {
        this.initBG();
        this._uiImageContainer.pos(this._content.width>>1, this._content.height>>1);
    }

    return EasyLoading;
}());