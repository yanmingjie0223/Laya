/*
* name;
*/
class ResourceUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 加载资源
     * @param resource: [{type: , url: }] {Array}
     * @param onResourceLoadComplete      {function}
     * @param onResourceLoadProgress      {function}
     * @param onResourceLoadTarget        {any}
     */
    loadResource(resource, onResourceLoadComplete, onResourceLoadProgress, onResourceLoadTarget){
        Laya.loader.load(resource, Laya.Handler.create(onResourceLoadTarget, onResourceLoadComplete), Laya.Handler.create(onResourceLoadTarget, onResourceLoadProgress, null, false));
    }

    /**
     * 获取资源加载地址
     * @param 一类型资源放置位置 {string}
     * @param 资源名字 {string}
     * @param 资源类型，默认png（png|jpg|） {string}
     */
    getUrl(host, name, resType = ResourceType.PNG){
        return host + "/" + name + "." + resType;
    }

}
