/*
* name;
*/
class EasyLoading extends BaseClass {
    
    constructor() {
        super();
        this._content = null;
        this._uiImageContainer = null;
        this._timeKey = null;
        this._initView();
    }

    /**
     * 显示加载旋转界面
     */
    show() {
        App.StageUtils.stage.addChild(this._content);
        this._onResize();
        clearTimeout(this._timeKey);
        this._timeKey = setTimeout(this._enterFrame.bind(this), 200);
        App.StageUtils.stage.on(Laya.Event.RESIZE, this, this._onResize);
    }

    /**
     * 关闭加载旋转界面
     */
    close() {
        App.StageUtils.stage.off(Laya.Event.RESIZE, this, this._onResize);
        if (this._content) {
            this._content.graphics.clear();
            this._content.removeSelf();
            this._uiImageContainer.rotation = 0;
        }
        clearTimeout(this._timeKey);
    }
    
    /**
     * 更新背景黑色
     */
    _initBG() {
        this._content.graphics.clear();
        this._content.graphics.drawRect(0, 0, App.StageUtils.stageW, App.StageUtils.stageH, "#000000");
        this._content.size(App.StageUtils.stageW, App.StageUtils.stageH);
    }

    /**
     * 旋转
     */
    _enterFrame() {
        let rota = this._uiImageContainer.rotation + 30;
        rota = rota % 360;
        this._uiImageContainer.rotation = rota;
        this._timeKey = setTimeout(this._enterFrame.bind(this), 200);
    }

    /**
     * 适配
     */
    _onResize() {
        this._initBG();
        this._uiImageContainer.pos(this._content.width>>1, this._content.height>>1);
    }

    _initView() {
        let self = this;

        self._content = new Laya.Sprite();
        self._content.mouseEnabled = true;
        self._content.alpha = 0.4;

        self._uiImageContainer = new Laya.Sprite();
        self._content.addChild(self._uiImageContainer);

        let url = App.ResourceUtils.getUrl("loading", "load_Reel", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            let img = App.DisplayUtils.createImage(0, 0, url, self._uiImageContainer);
            img.pivot(img.width>>1, img.height>>1);
        }, null);
    }

}