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
    Tip.showTip = function(_str, _parent){
        (_parent === void 0) && (_parent = null);
        var tip = new Tip();
        tip.showTip(_str, _parent);
        setTimeout(function(){
            tip.close();
        }, 1200);
    }

    _proto_.showTip = function(_str, _parent){
        this._msgTF.text = _str;
        var w;
        var h;
        if(this._bg.source){
            w = this._bg.width;
            h = this._bg.height;
            this._bg.height = (this._msgTF.y + this._msgTF.height + 20);
        }else{
            w = this._msgTF.width;
            h = 0;
        }
        
        this.x = (App.StageUtils.stageW - w)>>1;
        this.y = (App.StageUtils.stageH - h)>>1;
        if(_parent){
            _parent.addChild(this);
        }else{
            App.StageUtils.getStage().addChild(this);
        }
    }

    _proto_.close = function(){
        App.EffectUtils.flowOut(this, 500);
    }

    _proto_.initView = function(){
        var url = App.ResourceUtils.getUrl("tip", "tipBG", ResourceType.PNG);
        this._bg = App.DisplayUtils.createImage(0, 0, url, this);
        this._bg.sizeGrid = "10,10,10,10";
        this._msgTF = App.DisplayUtils.createText(11, 11, 24, 250, this, 0xffffff);
        this._msgTF.autoSize = true;
    }

    return Tip;
}());