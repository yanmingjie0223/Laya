/*
* name;
*/
var BaseScene = (function () {
    /**
     * 场景类型
     */
    function BaseScene(type) {
        BaseScene.__super.call(this);
        (type === void 0) && (type = SceneManager.BACK);
        this._type = type;
        this._views = [];
    }

    Laya.class(BaseScene, "BaseScene", BaseSprite);
    var _proto_ = BaseScene.prototype;

    /**
     * 进入Scene调用
     */
    _proto_.onEnter = function() {
        App.StageUtils.getStage().addChild(this);
    }

    /**
     * 退出Scene调用
     */
    _proto_.onExit = function() {
        this.removeAllView();
        this.removeSelf();
    }

    /**
     * 添加一个view到舞台
     * @param view {Laya.Sprite}
     */
    _proto_.addView = function(view) {
        if(this.destroyed) return;
        var index = this._views.indexOf(view);
        if(index == -1){
            var layer = view.getLayer();
            var len = this.numChildren;
            var currentView;
            for (var i = 0; i < len; i++) {
                currentView = this.getChildAt(i);
                if (currentView.getLayer() > layer) {
                    this.addChildAt(view, this.getChildIndex(currentView));
                    return;
                }
            }
            this._views.push(view);
            this.addChild(view);
        }
    }

    /**
     * 在舞台移除一个view
     * @param view {Laya.Sprite}
     */
    _proto_.removeView = function(view) {
        var index = this._views.indexOf(view);
        if(index != -1){
            this._views.splice(index, 1);
        }
        view.removeSelf();
    }

    /**
     * 移除所有view
     */
    _proto_.removeAllView = function() {
        while (this.numChildren) {
            this.getChildAt(0).removeSelf();
        }
        this._views = [];
    }

    /**
     * 获取场景类型
     */
    _proto_.getType = function(){
        return this._type;
    }

    return BaseScene;
}());