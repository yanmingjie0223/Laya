/*
* name;
*/
var ResourceUtils = (function () {

    function ResourceUtils() {
        ResourceUtils.__super.call(this);
    }

    Laya.class(ResourceUtils, "ResourceUtils", BaseClass);
    var _proto_ = ResourceUtils.prototype;

    /**
     * 加载资源
     * @param resource: [{type: , url: }] {Array}
     * @param onResourceLoadComplete      {function}
     * @param onResourceLoadProgress      {function}
     * @param onResourceLoadTarget        {any}
     */
    _proto_.loadResource = function(resource, onResourceLoadComplete, onResourceLoadProgress, onResourceLoadTarget){
        Laya.loader.load(resource, Laya.Handler.create(onResourceLoadTarget, onResourceLoadComplete), Laya.Handler.create(onResourceLoadTarget, onResourceLoadProgress));
    }

    /**
     * 获取资源加载地址
     * @param 一类型资源放置位置 {string}
     * @param 资源名字 {string}
     * @param 资源类型，默认png（png|jpg|） {string}
     */
    _proto_.getUrl = function(host, name, resType){
        (resType === void 0) && (resType = ResourceType.PNG);
        return host + "/" + name + "." + resType;
    }

    return ResourceUtils;
}());