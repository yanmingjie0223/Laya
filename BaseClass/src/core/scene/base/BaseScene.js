/*
* name;
*/
var BaseScene = (function () {

    function BaseScene() {
        this._layers = [];
    }

    Laya.class(BaseScene, "BaseScene");
    var _proto_ = BaseScene.prototype;

    /**
     * 进入Scene调用
     */
    _proto_.onEnter = function() {

    }

    /**
     * 退出Scene调用
     */
    _proto_.onExit = function() {
        App.ViewManager.closeAll();
        this.removeAllLayer();
    }

    /**
     * 添加一个Layer到舞台
     * @param layer {Laya.Sprite}
     */
    _proto_.addLayer = function(layer) {
        App.StageUtils.getStage().addChild(layer);
        this._layers.push(layer);
    }

    /**
     * 添加一个Layer到舞台
     * @param layer {Laya.Sprite}
     * @param index {number}
     */
    _proto_.addLayerAt = function(layer, index) {
        App.StageUtils.getStage().addChildAt(layer, index);
        this._layers.push(layer);
    }

    /**
     * 在舞台移除一个Layer
     * @param layer {Laya.Sprite}
     */
    _proto_.removeLayer = function(layer) {
        layer.removeSelf();
        this._layers.splice(this._layers.indexOf(layer), 1);
    }

    /**
     * Layer中移除所有
     * @param layer {Laya.Sprite}
     */
    _proto_.layerRemoveAllChild = function(layer) {
        while (layer.numChildren) {
            layer.removeChildAt(0);
        }
    }

    /**
     * 移除所有Layer
     */
    _proto_.removeAllLayer = function() {
        while (this._layers.length) {
            var layer = this._layers[0];
            this.layerRemoveAllChild(layer);
            this.removeLayer(layer);
        }
    }

    return BaseScene;
}());