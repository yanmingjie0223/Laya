/*
* name;
*/
class BaseFloatView extends BaseView {

    constructor(controller, scene) {
        super();
        this._bg = null;
        this._bgAlpha = 0.3;
    }

    show(center = true, scene = null){
        super.show(arguments);
        this.parent.addChildAt(this.bg, this.parent.getChildIndex(this));
        this.bg.pos(0, 0);
        this.bg.size(App.StageUtils.stageW, App.StageUtils.stageH);
    }

    close(){
        super.close(arguments);
        this.bg.removeSelf();
    }

    getLayer () {
        return ViewType.LAYER_MWINDOW;
    }

    destroy(isDesChild = true){
        super.destroy(isDesChild);
        this._bg.graphics.clear();
        this._bg = null;
    }

    get bg() {
        if (!this._bg) {
            this._bg = new Laya.Sprite();
            this._bg.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH, "#000000");
            this._bg.mouseEnabled = true;
            this._bg.alpha = this.bgAlpha;
        }
        return this._bg;
    }

    set bgAlpha(value) {
        this.bg.alpha = value;
        this._bgAlpha = value;
    }

    get bgAlpha() {
        return this._bgAlpha;
    }

}