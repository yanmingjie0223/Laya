/*
* name;
*/
class ResourceUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 加载资源
     * @param {Array} resource: [{type: , url: }]
     * @param {Function} onResourceLoadComplete
     * @param {Function} onResourceLoadProgress
     * @param {any} onResourceLoadTarget
     */
    loadResource(resource, onResourceLoadComplete, onResourceLoadProgress, onResourceLoadTarget){
        Laya.loader.load(resource, Laya.Handler.create(onResourceLoadTarget, onResourceLoadComplete), Laya.Handler.create(onResourceLoadTarget, onResourceLoadProgress, null, false));
    }

    /**
     * 获取资源加载地址
     * @param {string} host 一类型资源放置位置
     * @param {string} name 资源名字
     * @param {string} resType 资源类型，默认png（png|jpg|sk|fnt|txt|json|mp4|mp3|wav）
     */
    getUrl(host, name, resType = ResourceType.PNG){
        return host + "/" + name + "." + resType;
    }

}
