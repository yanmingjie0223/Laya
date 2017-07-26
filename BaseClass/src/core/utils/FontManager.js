/*
* name;
*/
var FontManager = (function () {

    function FontManager() {
        FontManager.__super.call(this);
        this._fontCache = null;
    }

    Laya.class(FontManager, "FontManager", BaseClass);
    var _proto_ = FontManager.prototype;

    /**
     * 注册纹理字体
     * @param fontUrl配置文件      {string}
     * @param fontPngUrl纹理地址   {string}
     * @param fontName   {string}
     */
    _proto_.register = function(fontUrl, fontPngUrl, fontName){
        if(this._fontCache && this._fontCache[fontName]){
            return;
        }

        var fontFntData = Laya.Loader.getRes(fontUrl);
        var fontPngData = Laya.Loader.getRes(fontPngUrl);
        if(!fontFntData || !fontPngData){
            Logger.trace("注册纹理字体文件未加载！", fontUrl, fontPngUrl);
        }

        var bitmapFont = new Laya.BitmapFont();
        bitmapFont.parseFont(fontFntData, fontPngData);
        Laya.Text.registerBitmapFont(fontName, bitmapFont);

        if(!this._fontCache){
            this._fontCache = {};
        }
        this._fontCache[fontName] = true;
    }

    /**
     * 注销纹理字体
     * @param fontName   {string}
     */
    _proto_.unregister = function(fontName){
        if(this._fontCache && this._fontCache[fontName]){
            delete this._fontCache[fontName];
        }
    }

    /**
     * 查看是否已经注册该字体
     * @param fontName   {string}
     */
    _proto_.isRegister = function(fontName){
        if(this._fontCache && this._fontCache[fontName]){
            return true;
        }
        return null;
    }

    return FontManager;
}());
