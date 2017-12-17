/**
 * 弹出符框
 */
class Tip extends BaseSprite {
    constructor() {
        super();
        this._msgTF = null;
        this._bg = null;
        this._initView();
    }

    /**
     * 显示tip上移消失
     * @param 弹框显示文字 {string}
     * @param 弹出框父级，默认添加到舞台上 {Laya.Sprite}
     */
    static showTip(_str) {
        let tip = new Tip();
        tip.showTip(_str);
        setTimeout(tip.close.bind(tip), 1200);
    }

    showTip(_str) {
        this._msgTF.text = _str;
        
        this._bg.height = this._msgTF.y + this._msgTF.height + 20;
        let w = this._bg.width;
        let h = this._bg.height;
        if(this._bg) w = this._msgTF.width;
        
        this.x = (App.StageUtils.stageW - w)>>1;
        this.y = (App.StageUtils.stageH - h)>>1;
        App.StageUtils.stage.addChild(this);
    }

    close() {
        App.EffectUtils.flowOut(this, 500);
    }

    _initView() {
        let self = this;

        self._bg = App.DisplayUtils.createImage(0, 0, null, self);
        self._bg.sizeGrid = "10,10,10,10";
        self._msgTF = App.DisplayUtils.createText(11, 11, 24, 250, self, 0xffffff);
        self._msgTF.autoSize = true;

        let url = App.ResourceUtils.getUrl("res/tip", "tipBG", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            let texture = Laya.loader.getRes(url);
            if(texture){
                self._bg.source = texture;
            }
        }, null);
    }

}