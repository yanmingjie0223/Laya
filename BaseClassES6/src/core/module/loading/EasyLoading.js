/*
* name;
*/
class EasyLoading extends BaseClass {
    
    constructor() {
        super();
        this._content = null;
        this._uiBG = null;
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
        Laya.timer.clearAll(this);
        Laya.timer.loop(200, this, this._enterFrame);
        App.StageUtils.stage.on(Laya.Event.RESIZE, this, this._onResize);
    }

    /**
     * 关闭加载旋转界面
     */
    close() {
        App.StageUtils.stage.off(Laya.Event.RESIZE, this, this._onResize);
        Laya.timer.clearAll(this);
        if (this._content) {
            this._uiBG.graphics.clear();
            this._uiImageContainer.rotation = 0;
            this._content.removeSelf();
        }
    }
    
    /**
     * 更新背景黑色
     */
    _initBG() {
        let _width = App.StageUtils.stageW;
        let _height = App.StageUtils.stageH;
        this._uiBG.graphics.clear();
        this._uiBG.graphics.drawRect(0, 0, _width, _height, "#000000");
        this._uiBG.size(_width, _height);
        this._content.size(_width, _height);
    }

    /**
     * 旋转
     */
    _enterFrame() {
        let rota = this._uiImageContainer.rotation + 30;
        rota = rota % 360;
        this._uiImageContainer.rotation = rota;
    }

    /**
     * 适配
     */
    _onResize() {
        this._initBG();
        this._uiImageContainer.pos(this._uiBG.width>>1, this._uiBG.height>>1);
    }

    _initView() {
        let self = this;

        self._content = App.DisplayUtils.createSprite(0, 0, null);
        self._content.mouseEnabled = true;

        self._uiBG = App.DisplayUtils.createSprite(0, 0, self._content);
        self._uiBG.alpha = 0.4;
        self._uiImageContainer = App.DisplayUtils.createSprite(0, 0, self._content);

        let url = App.ResourceUtils.getUrl("res/loading", "load_Reel", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            let img = App.DisplayUtils.createImage(0, 0, url, self._uiImageContainer);
            img.pivot(img.width>>1, img.height>>1);
        }, null);
    }

}