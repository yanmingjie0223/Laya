/*
* name;
*/
class DisplayUtils extends BaseClass {

    constructor() {
        super();
    }

    /**创建一个文本
     * @param xPos x坐标     {number}
     * @param yPos y坐标     {number}
     * @param parent 父容器  {Sprite}
     * @return {Laya.Sprite}
     * */
    createSprite(xPos, yPos, parent = null) {
        let sprite = new Laya.Sprite();
        sprite.pos(xPos, yPos);
        if (parent) {
            parent.addChild(sprite);
        }
        return sprite;
    }

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
    createText(xPos, yPos, size, width = 0, parent = null , color = "#ffffff", align = Laya.Stage.ALIGN_CENTER) {
        let text = new Laya.Text();
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
    createBitmap(xPos, yPos, textureUrl, parent = null) {
        let image = new Laya.Sprite();
        if (textureUrl) {
            this.imageToTexture(textureUrl, image);
        }
        image.pos(xPos, yPos);
        if (image.texture) {
            image.size(image.texture.sourceWidth, image.texture.sourceHeight);
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
    createImage(xPos, yPos, textureUrl, parent = null) {
        let image = new Laya.Image();
        if (textureUrl) {
            this.imageToTexture(textureUrl, image);
        }
        image.pos(xPos, yPos);
        if (image.source) {
            image.size(image.source.sourceWidth, image.source.sourceHeight);
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
     * @param fontName   {string}
     * @param parent 父容器        {Sprite}
     * @param width 文本宽度       {number}
     * @param textAlign 对齐方式   {string}
     * @return {Laya.Text}
     * */
    createBitmapText(xPos, yPos, fontUrl, fontPngUrl, fontName, parent = null, width = 0, align = Laya.Stage.ALIGN_CENTER) {
        //注册font字体到Text中
        App.FontManager.register(fontUrl, fontPngUrl, fontName);

        let tx = new Laya.Text();
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

    /**创建一个按钮
     * @param xPos x坐标     {number}
     * @param yPos y坐标     {number}
     * @param textureUrl 纹理地址  {string}
     * @param text 文本内容 {string}
     * @param labelSize 文本size  {number}
     * @param width 宽     {number}
     * @param height 高    {number}
     * @param parent 父容器   {Sprite}
     * @return {Laya.Button}
     * */
    createButton(xPos, yPos, textureUrl, text = "", labelSize = null, width = null, height = null, parent = null){
        let btn = new Laya.Button(textureUrl, text);
        (height != null) && (btn.height = height);
        (width != null) && (btn.width = width);
        (labelSize != null) && (btn.labelSize = labelSize);
        btn.label = text;
        btn.pos(xPos, yPos);
        if(parent){
            parent.addChild(btn);
        }
        return btn;
    }

    /**
     * 创建骨骼动画
     * @param xPos x坐标     {number}
     * @param yPos y坐标     {number}
     * @param png图片集地址
     * @param sk文件地址
     * @param 骨骼类型是否换装：1：换装、0：不换装
     * @param parent 父容器   {Sprite}
     */
    createSkeleton(xPos, yPos, pngUrl, skUrl, type, parent = null){
        let templet = new Laya.Templet();
        let skeleton = new Laya.Skeleton();

        let pngData = Laya.loader.getRes(pngUrl);
        let skData = Laya.loader.getRes(skUrl);
        if(pngData && skData){
            templet.parseData(pngData, skData);
            skeleton = templet.buildArmature(type);
            skeleton.pos(xPos, yPos);
            if(parent) {
                parent.addChild(skeleton);
            }
            return skeleton;
        }
        else {
            console.warn("动画资源未提前加载！");
        }
        return null;
    }

    /**
     * 创建骨骼动画
     * @param png图片集地址
     * @param sk文件地址
     * @param 骨骼类型是否换装：1：换装、0：不换装
     * @param 回调函数
     * @param 回调函数this对象
     */
    createAsynSkeleton(pngUrl, skUrl, type, callback = null, thisObj = null){
        let templet = new Laya.Templet();
        let skeleton = new Laya.Skeleton();

        let pngData = Laya.loader.getRes(pngUrl);
        let skData = Laya.loader.getRes(skUrl);
        if(pngData && skData){
            compleSk();
        }else{
            let res = [
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
     imageUrlLoad(url, callback, thisObj){
         let res = [{"url": url, "type": Laya.Loader.IMAGE}];
         App.ResourceUtils.loadResource(res, callback, null, thisObj);
     }

     /**
      * 给image赋值纹理
      * @param 纹理地址
      * @param 赋值纹理对象
      * @param image对象（显示纹理容器）
      */
    imageToTexture(textureUrl, image){
        if(image instanceof Laya.Image){
            image.source = Laya.loader.getRes(textureUrl);
            if(!image.source){
                this.imageUrlLoad(textureUrl, function(){
                    image.source = Laya.loader.getRes(textureUrl);
                    if (!image.destroyed && image.source) {
                        image.size(image.source.sourceWidth, image.source.sourceHeight);
                    }
                }, null);
            }
        }
        else if(image instanceof Laya.Sprite){
            image.texture = Laya.loader.getRes(textureUrl);
            if(!image.texture) {
                this.imageUrlLoad(textureUrl, function(){
                    image.texture = Laya.loader.getRes(textureUrl);
                    if (!image.destroyed && image.texture) {
                        image.size(image.texture.sourceWidth, image.texture.sourceHeight);
                    }
                }, null);
            }
        }
    }

}