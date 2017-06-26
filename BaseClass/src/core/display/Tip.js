/**
 * 弹出符框
 */
var Tip = (function () {

    function Tip() {
        Tip.__super.call(this);
        this._msgTF = null;
        this._bg = null;
        this.initView();
    }

    Laya.class(Tip, "Tip", Laya.Sprite);
    var _proto_ = Tip.prototype;

    /**
     * 显示tip上移消失
     * @param 弹框显示文字 {string}
     * @param 弹出框父级，默认添加到舞台上 {Laya.Sprite}
     */
    Tip.showTip = function(_str){
        var tip = new Tip();
        tip.showTip(_str);
        setTimeout(tip.close.bind(tip), 1200);
    }

    _proto_.showTip = function(_str){
        this._msgTF.text = _str;
        
        this._bg.height = this._msgTF.y + this._msgTF.height + 20;
        var w = this._bg.width;
        var h = this._bg.height;
        if(this._bg) w = this._msgTF.width;
        
        this.x = (App.StageUtils.stageW - w)>>1;
        this.y = (App.StageUtils.stageH - h)>>1;
        App.StageUtils.getStage().addChild(this);
    }

    _proto_.close = function(){
        App.EffectUtils.flowOut(this, 500);
    }

    _proto_.initView = function(){
        var self = this;

        self._bg = App.DisplayUtils.createImage(0, 0, null, self);
        self._bg.sizeGrid = "10,10,10,10";
        self._msgTF = App.DisplayUtils.createText(11, 11, 24, 250, self, 0xffffff);
        self._msgTF.autoSize = true;

        var url = App.ResourceUtils.getUrl("tip", "tipBG", ResourceType.PNG);
        App.DisplayUtils.imageUrlLoad(url, function(){
            var texture = Laya.loader.getRes(url);
            if(texture){
                self._bg.source = texture;
            }
        }, null);
    }

    return Tip;
}());