/*
* name;
*/
var BaseView = (function () {

    /**
     * 构造函数
     * @param controller {BaseController}
     * @param parent {Laya.Sprite}
     */
    function BaseView(controller, parent) {
        this.__super.call(this);
        //父级
        this.myParent = parent;

        this.isInit = false;
        this._controller = controller;
        this._resouce = null;

        App.StageUtils.getStage().on(Laya.Event.RESIZE, this, this.onResize);
    }

    Laya.class(BaseClass, "BaseClass", Laya.Sprite);
    var _proto_ = BaseView.prototype;
    var _super_ = BaseView.__super.prototype;
    var _getset_ = Laya.getset;

    /**
     * 子类继承必须实现，赋值加载资源
     * @param [{url: , type: }]
     */
    _proto_.setResources = function(resource){
        this._resouce = resource;
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.applyFunc = function(key) {
        return this._controller.applyFunc.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识 {number}
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.applyControllerFunc = function(controllerKey, key) {
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    }

    /**
     * 面板是否显示
     * @return {boolen}
     */
    _proto_.isShow = function() {
        return this.stage != null && this.visible;
    }

    /**
     * 添加到父级
     */
    _proto_.addToParent = function() {
        if(this.destroyed) return;
        this.myParent.addChild(this);
    }

    /**
     * 从父级移除
     */
    _proto_.removeFromParent = function() {
        App.DisplayUtils.removeFromParent(this);
    }

    /**
     * 对面板进行显示初始化，用于子类继承
     */
    _proto_.initView = function() {
        this.isInit = true;
    }

    /**
     * 对面板数据的初始化，用于子类继承
     */
    _proto_.initData = function() {

    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param ...param:any[]
     */
    _proto_.open = function(){

    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param ...param:any[]
     */
    _proto_.close = function() {

    }

    /**
     * 屏幕尺寸变化时调用
     */
    _proto_.onResize = function() {

    }

    /**
     * 加载面板所需资源
     * @param loadComplete {function}
     * @param initComplete {function}
     */
    _proto_.loadResource = function(loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            App.ResourceUtils.loadResource(this._resources, function () {
                loadComplete();
                initComplete();
            }, null, this);
        }else {
            loadComplete();
            initComplete();
        }
    }

    /**
     * 摧毁view
     */
    _proto_.destroy = function(){
        this.myParent = null;
        this.isInit = false;
        this._resouce = null;
        this._controller = null;
        App.StageUtils.getStage().off(Laya.Event.RESIZE, this, this.onResize);
        _super_.destroy.call(this);
    }

    /**
     * 添加子对象，如果该view被摧毁不添加
     */
    _proto_.addChild = function(node){
        if(this.destroyed) return;
        _super_.addChild.call(this, node);
    }

    /**
     * 获取设置父级
     */
    _getset_(0, _proto_, "myParent",
        function(){
            return this._myParent;
        },
        function(value){
            this._myParent = value
        }
    );

    /**
     * 获取设置是否初始化
     */
    _getset_(0, _proto_, "isInit",
        function(){
            return this._isInit;
        },
        function(value){
            this._isInit = value
        }
    );

    return BaseView;
}());