/*
* name;
*/
var DisplayUtils = (function () {

    function DisplayUtils() {
        this.__super.call(this);
    }

    Laya.class(DisplayUtils, "DisplayUtils", BaseClass);
    var _proto_ = DisplayUtils.prototype;

    /**创建一个文本
     * @param xPos x坐标     {number}
     * @param yPos y坐标     {number}
     * @param size 字号      {number}
     * @param width 文本宽度 {number}
     * @param parent 父容器  {Sprite}
     * @param color 颜色     {string}
     * @param align 字体对齐方式 {string}
     * @return {Laya.Text}
     * */
    _proto_.createText = function (xPos, yPos, size, width, parent, color, align) {
        (width === void 0) && (width = 0);
        (parent === void 0) && (parent = null);
        (color === void 0) && (color = "#ffffff");
        (align === void 0) && (align = Laya.Stage.ALIGN_CENTER);
        var text = new Laya.Text();
        text.font = "Microsoft YaHei";
        text.fontSize = size;
        text.pos(xPos, yPos);
        text.wordWrap = true;
        if (width != 0) {
            text.width = width;
        }
        text.align = align;
        text.color = color;
        if (parent) {
            parent.addChild(text);
        }
        return text;
    }

    /**创建一个位图
     * @param xPos x坐标    {number}
     * @param yPos y坐标    {number}
     * @param textureUrl 纹理地址  {string}
     * @param parent 父容器 {Sprite}
     * @return {Laya.Sprite}
     * */
    _proto_.createBitmap = function (xPos, yPos, textureUrl, parent) {
        (parent === void 0) && (parent = null);
        var image = new Laya.Sprite();
        if (textureUrl) {
            image.texture = Laya.loader.getRes(textureUrl);
            if (!image.texture) {
                this.imageToTexture(textureUrl, image.texture, image);
            }
        }
        image.pos(xPos, yPos);
        if (image.texture) {
            image.size(image.texture.width, image.texture.height);
        }
        if (parent) {
            parent.addChild(image);
        }
        return image;
    }

    /**创建一个ui image
     * @param xPos x坐标          {number}
     * @param yPos y坐标          {number}
     * @param textureUrl 纹理地址 {string}
     * @param parent 父容器       {Sprite}
     * @return {Laya.Image}
     * */
    _proto_.createImage = function (xPos, yPos, textureUrl, parent) {
        (parent === void 0) && (parent = null);
        var image = new Laya.Image();
        if (textureUrl) {
            image.source = Laya.loader.getRes(textureUrl);
            if(!image.source){
                this.imageToTexture(textureUrl, image.source, image);
            }
        }
        image.pos(xPos, yPos);
        if (image.source) {
            image.size(image.source.width, image.source.height);
        }
        if (parent) {
            parent.addChild(image);
        }
        return image;
    }

    /**创建一个位图文本
     * @param xPos x坐标           {number}
     * @param yPos y坐标           {number}
     * @param fontUrl配置文件      {string}
     * @param fontPngUrl纹理地址   {string}
     * @param parent 父容器        {Sprite}
     * @param width 文本宽度       {number}
     * @param textAlign 对齐方式   {string}
     * @return {Laya.Text}
     * */
    _proto_.createBitmapText = function (xPos, yPos, fontUrl, fontPngUrl, parent, width, align) {
        (parent === void 0) && (parent = null);
        (width === void 0) && (width = 0);
        (align === void 0) && (align = Laya.Stage.ALIGN_CENTER);
        //注册font字体到Text中
        var bitmapFont = new Laya.BitmapFont();
        bitmapFont.parseFont(Laya.Loader.getRes(fontUrl), Laya.Loader.getRes(fontPngUrl));
        Laya.Text.registerBitmapFont(fontName, bitmapFont);

        var tx = new Laya.Text();
        tx.pos(xPos, yPos);
        if (parent) {
            parent.addChild(tx);
        }
        tx.wordWrap = true;
        tx.font = fontName;
        if (width != 0) {
            tx.width = width;
        }
        if (align) {
            tx.align = align;
        }
        return tx;
    }

    /**
     * 创建骨骼动画
     * @param png图片集地址
     * @param sk文件地址
     * @param 骨骼类型是否换装：1：换装、0：不换装
     * @param 回调函数
     * @param 回调函数this对象
     */
    _proto_.createSkeleton = function(pngUrl, skUrl, type, callback, thisObj){
        (thisObj === void 0) && (thisObj = null);
        var templet = new Laya.Templet();
        var skeleton = new Laya.Skeleton();

        var pngData = Laya.loader.getRes(pngUrl);
        var skData = Laya.loader.getRes(skUrl);
        if(pngData && skData){
            compleSk();
        }else{
            var res = [
                {"type":Laya.Loader.BUFFER, "url":skUrl},
                {"type":Laya.Loader.IMAGE, "url":pngUrl}
            ];
            App.ResourceUtils.loadResource(res, compleSk, null, null);
        }

        function compleSk(){
            pngData = Laya.loader.getRes(pngUrl);
            skData = Laya.loader.getRes(skUrl);
            templet.parseData(pngData, skData);
            skeleton = templet.buildArmature(type);
            (callback) && ( callback.apply(thisObj, [skeleton]) );
        }
    }

    /**
     * 地址加载纹理图片
     * @param 纹理地址     {string}
     * @param 回调函数     {function}
     * @param 回调函数对象 {any}
     */
     _proto_.imageUrlLoad = function(url, callback, thisObj){
         var res = [{"url": url, "type": Laya.Loader.IMAGE}];
         App.ResourceUtils.loadResource(res, callback, null, thisObj);
     }

     /**
      * 给image赋值纹理
      * @param 纹理地址
      * @param 赋值纹理对象
      * @param image对象（显示纹理容器）
      */
    _proto_.imageToTexture = function(textureUrl, texture, image){
        texture = Laya.loader.getRes(textureUrl);
        if(!texture){
            this.imageUrlLoad(textureUrl, function(){
                texture = Laya.loader.getRes(textureUrl);
                if (texture && !image.destroyed) {
                    image.size(texture.width, texture.height);
                }
            }, null)
        }
    }

    /**
     * 从父级移除child
     * @param child {Laya.Sprite}
     */
    _proto_.removeFromParent = function(child) {
        if (!child.parent) return;
        child.removeSelf();
    }

    return DisplayUtils;
}());