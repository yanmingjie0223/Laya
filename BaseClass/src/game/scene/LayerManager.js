/*
* name;
*/
var LayerManager = (function () {

    /**
     * 游戏背景层
     * @type {Laya.Sprite}
     */
    LayerManager.Game_BG = new Laya.Sprite();
    
    /**
     * 主游戏层
     * @type {Laya.Sprite}
     */
    LayerManager.Game_MAIN = new Laya.Sprite();

    /**
     * UI主界面
     * @type {Laya.Sprite}
     */
    LayerManager.UI_MAIN = new Laya.Sprite();

    /**
     * UI弹出框层
     * @type {Laya.Sprite}
     */
    LayerManager.UI_POPUP = new Laya.Sprite();

    /**
     * UI警告消息层
     * @type {Laya.Sprite}
     */
    LayerManager.UI_MESSAGE = new Laya.Sprite();

    /**
     * UITips层
     * @type {Laya.Sprite}
     */
    LayerManager.UI_TIPS = new Laya.Sprite();

    return LayerManager;
}());