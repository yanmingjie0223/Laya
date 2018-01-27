/*
* name;
*/
class BaseFloatView extends BaseView {

    constructor(controller, scene) {
        super();
        this._bg = null;
        this._bgAlpha = 0.3;
    }

    show(scene = null, center = true){
        super.show(arguments);
        this.parent.addChildAt(this.bg, this.parent.getChildIndex(this));
        this.onResize();
    }

    close(){
        super.close(arguments);
        this.bg.removeSelf();
    }

    /**
     * 重写size方法、添加适配
     * @param {number} _width
     * @param {number} _height
     */
    size(_width, _height) {
        super.size(_width, _height);
    }

    /**
     * 背景适配
     */
    _onResize() {
        this.bg.pos(0, 0);
        this.bg.graphics.clear();
        this.bg.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH);
        this.bg.size(App.StageUtils.stageW, App.StageUtils.stageH);
    }

    /**
     * 重写适配，继承后的类如果有修改就继承重写
     */
    onResize() {
        this._onResize();
        this.x = (App.StageUtils.stageW - this.width) >> 1;
        this.y = (App.StageUtils.stageH - this.height) >> 1;
    }

    /**
     * 重写层级关系、浮层在上面
     */
    getLayer () {
        return ViewType.LAYER_MWINDOW;
    }

    /**
     * 黑色背景底层
     */
    get bg() {
        if (!this._bg) {
            this._bg = new Laya.Sprite();
            this._bg.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH, "#000000");
            this._bg.mouseEnabled = true;
            this._bg.alpha = this.bgAlpha;
        }
        return this._bg;
    }

    /**
     * 黑色背景底层透明度
     */
    set bgAlpha(value) {
        this.bg.alpha = value;
        this._bgAlpha = value;
    }
    get bgAlpha() {
        return this._bgAlpha;
    }

    /**
     * 销毁
     * @param {boolean} isDesChild
     */
    destroy(isDesChild = true){
        super.destroy(isDesChild);
        this._bg.graphics.clear();
        this._bg.destroy(true);
        this._bg = null;
    }

}