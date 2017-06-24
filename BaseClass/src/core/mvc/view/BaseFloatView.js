/*
* name;
*/
var BaseFloatView = (function () {

    function BaseFloatView(controller) {
        BaseFloatView.__super.apply(this, arguments);
        this._bg = null;
        this._bgAlpha = 0.3;
    }

    Laya.class(BaseFloatView, "BaseFloatView", BaseView);
    var _proto_ = BaseFloatView.prototype;
    var _super_ = BaseFloatView.__super.prototype;
    var _getset_ = Laya.getset;

    _proto_.show = function(center, scene){
        (center === void 0) && (arguments[0] = true);
        (scene === void 0) && (arguments[1] = null);
        _super_.show.call(this, arguments);
        this.parent.addChildAt(this.bg, this.parent.getChildIndex(this));
        this.bg.pos(0, 0);
        this.bg.size(App.StageUtils.stageW, App.StageUtils.stageH);
    }

    _proto_.close = function(){
        _super_.close.call(this, arguments);
        this.bg.removeSelf();
    }

    _proto_.getLayer = function () {
        return ViewType.LAYER_MWINDOW;
    }

    _proto_.destroy = function(){
        _super_.destroy.call(this);
        this._bg.graphics.clear();
        this._bg = null;
    }

    _getset_(0, _proto_, "bg",
        function(){
            if (!this._bg) {
                this._bg = new Laya.Sprite();
                this._bg.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH, "#000000");
                this._bg.mouseEnabled = true;
                this._bg.alpha = this.bgAlpha;
            }
            return this._bg;
        }
    );

    _getset_(0, _proto_, "bgAlpha",
        function(){
            return this._bgAlpha;
        },
        function(value){
            this.bg.alpha = value;
            this._bgAlpha = value;
        }
    );

    return BaseFloatView;
}());