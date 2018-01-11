/*
* name;
*/
class BaseScene extends BaseSprite {

    constructor(type = SceneManager.BACK) {
        super();

        this._type = type;
        this._views = [];
    }

    /**
     * 进入Scene调用
     */
    onEnter() {
        App.StageUtils.stage.addChild(this);
    }

    /**
     * 退出Scene调用
     */
    onExit() {
        this.removeAllView();
        this.removeSelf();
    }

    /**
     * 添加一个view到舞台
     * @param {Laya.Sprite} view
     */
    addView(view) {
        if (this.destroyed) return;
        let index = this._views.indexOf(view);
        if (index == -1) {
            let layer = view.getLayer();
            let len = this.numChildren;
            let currentView;
            for (let i = 0; i < len; i++) {
                currentView = this.getChildAt(i);
                if (currentView.getLayer() > layer) {
                    this._views.splice(i, 0, view);
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
     * @param {Laya.Sprite} view
     */
    removeView(view) {
        let index = this._views.indexOf(view);
        if (index != -1) {
            this._views.splice(index, 1);
        }
        view.removeSelf();
    }

    /**
     * 移除所有view
     */
    removeAllView() {
        while (this.numChildren) {
            this.getChildAt(0).removeSelf();
        }
        this._views = [];
    }

    /**
     * 获取场景类型
     */
    getType(){
        return this._type;
    }

}