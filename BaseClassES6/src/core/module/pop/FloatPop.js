/**
 * 弹出符框
 */
class FloatPop extends BaseSprite {
    constructor() {
        super();
        this._msgTF = null;
        this._bg = null;
        this._initView();
    }

    /**
     * 显示tip上移消失
     * @param {string} 弹框显示文字
     * @param {Laya.Sprite} 弹出框父级，默认添加到舞台上
     */
    static showTip(_str, _parent = App.StageUtils.stage) {
        let tip = new FloatPop();
        tip.showTip(_str, _parent);
        setTimeout(tip.close.bind(tip), 1200);
    }

    showTip(_str, _parent) {
        this._msgTF.text = _str;

        let txWidth = this._msgTF.textWidth + 60;
        let txHeight = this._msgTF.textHeight + 60;
        if (txWidth < 300) {
            txWidth = 300;
        }

        this._bg.size(txWidth, txHeight);
        this._bg.pos(-txWidth/2, -txHeight/2);
        this._msgTF.x = -this._msgTF.textWidth/2;
        this._msgTF.y = -this._msgTF.textHeight/2;
        this.pos(_parent.width/2, _parent.height/2);
        _parent.addChild(this);
    }

    close() {
        App.EffectUtils.flowOut(this, 500);
    }

    _initView() {
        let self = this;

        self._bg = App.DisplayUtils.createImage(0, 0, null, self);
        self._bg.sizeGrid = "10,10,10,10";
        self._msgTF = App.DisplayUtils.createText(0, 0, 24, 0, self, 0xffffff);
        self._msgTF.wordWrap = false;
        self._msgTF.autoSize = true;

        let url = App.ResourceUtils.getUrl("res/tip", "tipBG", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            App.DisplayUtils.imageToTexture(url, self._bg);
        }, null);
    }

}