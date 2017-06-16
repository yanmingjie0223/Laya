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
        self._content.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH);
        self._content.size(App.StageUtils.stageW, App.StageUtils.stageH);

        self._uiImageContainer = new Laya.Sprite();
        self._uiImageContainer.x = self._content.width>>1;
        self._uiImageContainer.y = self._content.height>>1;
        self._content.addChild(self._uiImageContainer);

        var url = App.ResourceUtils.getUrl("loading", "load_Reel", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            var img = App.DisplayUtils.createImage(0, 0, url, self._uiImageContainer);
            img.pivot(img.width>>1, img.height>>1);
            img.pos(-img.width>>1, -img.height>>1);
        }, null)
    }

    _proto_.show = function() {
        App.StageUtils.getStage().addChild(this._content);
        clearTimeout(this._timeKey);
        this._timeKey = setTimeout(this.enterFrame, 500);
    }

    _proto_.close = function() {
        if (this._content && this._content.parent) {
            App.StageUtils.getStage().removeChild(this._content);
            this._uiImageContainer.rotation = 0;
        }
        clearTimeout(this._timeKey);
    }

    _proto_.enterFrame = function() {
        var rota = this._uiImageContainer.rotation + 30;
        rota = rota % 360;
        this._uiImageContainer.rotation = rota;
        this._timeKey = setTimeout(this.enterFrame, 500);
    }

    return EasyLoading;
}());