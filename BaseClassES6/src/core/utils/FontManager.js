/*
* name;
*/
class FontManager extends BaseClass {

    constructor() {
        super();
        //缓存json对象
        this._fontCache = null;
    }

    /**
     * 注册纹理字体
     * @param fontUrl配置文件      {string}
     * @param fontPngUrl纹理地址   {string}
     * @param fontName   {string}
     */
    register(fontUrl, fontPngUrl, fontName) {
        if(this._fontCache && this._fontCache[fontName]){
            return;
        }

        let fontFntData = Laya.Loader.getRes(fontUrl);
        let fontPngData = Laya.Loader.getRes(fontPngUrl);
        if(!fontFntData || !fontPngData){
            Logger.trace("注册纹理字体文件未加载！", fontUrl, fontPngUrl);
        }

        let bitmapFont = new Laya.BitmapFont();
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
    unregister(fontName) {
        if(this._fontCache && this._fontCache[fontName]){
            delete this._fontCache[fontName];
        }
    }

    /**
     * 查看是否已经注册该字体
     * @param fontName   {string}
     */
    isRegister(fontName) {
        if(this._fontCache && this._fontCache[fontName]){
            return true;
        }
        return null;
    }

}
