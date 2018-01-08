/*
* name;
*/
class DisplayUtils extends BaseClass {

    constructor() {
        super();
        //templet 缓存池
        this._templetCache = {};
    }

    /**
     * 创建一个文本
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {Sprite} parent 父容器
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

    /**
     * 创建一个文本
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {number} size 字号
     * @param {number} width 文本宽度
     * @param {Sprite} parent 父容器
     * @param {string} color 颜色
     * @param {string} align 字体对齐方式
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

    /**
     * 创建一个位图
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {string} textureUrl 纹理地址
     * @param {Sprite} parent 父容器
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

    /**
     * 创建一个ui image
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {string} textureUrl 纹理地址
     * @param {Sprite} parent 父容器
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

    /**
     * 创建一个位图文本
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {string} fontUrl 配置文件
     * @param {string} fontPngUrl 纹理地址
     * @param {string} fontName
     * @param {Sprite} parent 父容器
     * @param {number} width 文本宽度
     * @param {string} textAlign 对齐方式
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
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {string} textureUrl 纹理地址
     * @param {string} text 文本内容
     * @param {number} labelSize 文本size
     * @param {number} width 宽
     * @param {number} height 高
     * @param {Sprite} parent 父容器
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
     * @param {number} xPos x坐标
     * @param {number} yPos y坐标
     * @param {string} skKey 地址key
     * @param {number} type 骨骼类型是否换装：1：换装、0：不换装
     * @param {Sprite} parent 父容器
     */
    createSkeleton(xPos, yPos, skKey, type, parent = null){
        let templet = this.createTemplet(skKey);
        if(templet){
            let skeleton = templet.buildArmature(type);
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
     * @param {string} skKey 地址key
     * @param {number} 骨骼类型是否换装：1：换装、0：不换装
     * @param {Function} 回调函数
     * @param {any} 回调函数this对象
     */
    createAsynSkeleton(skKey, type, callback = null, thisObj = null){
        let templet = this.createTemplet(skKey);
        if(templet){
            compleSk();
        }else{
            let res = [
                {"type": Laya.Loader.BUFFER, "url": skKey + ".sk"},
                {"type": Laya.Loader.IMAGE,  "url": skKey + ".png"}
            ];
            App.ResourceUtils.loadResource(res, compleSk, null, null);
        }

        function compleSk(){
            templet = this.createTemplet(skKey);
            let skeleton = templet.buildArmature(type);
            (callback) && ( callback.apply(thisObj, [skeleton]) );
        }
    }

    /**
     * 获取templet对象
     * @param {string} key
     */
    createTemplet(key) {
        if (!this._templetCache[key]) {
            let templet = new Laya.Templet();
            let pngData = Laya.loader.getRes(key + ".png");
            let skData = Laya.loader.getRes(key + ".sk");
            if (pngData && skData) {
                templet.parseData(pngData, skData);
                this._templetCache[key] = templet;
            }
            else {
                return null;
            }
        }
        return this._templetCache[key];
    }

    /**
     * 地址加载纹理图片
     * @param {string} 纹理地址
     * @param {Function} 回调函数
     * @param {any} 回调函数对象
     */
    imageUrlLoad(url, callback, thisObj){
         let res = [{"url": url, "type": Laya.Loader.IMAGE}];
         App.ResourceUtils.loadResource(res, callback, null, thisObj);
    }

    /**
     * 给image赋值纹理
     * @param {string} 纹理地址
     * @param {Laya.Image|Laya.Sprite} 显示纹理容器对象
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