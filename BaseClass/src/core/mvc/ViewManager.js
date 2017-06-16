/*
* name;
*/
var ViewManager = (function () {

    function ViewManager() {
        ViewManager.__super.call(this);
        this._views = {};
        this._opens = {};
    }

    Laya.class(ViewManager, "ViewManager", BaseClass);
    var _proto_ = ViewManager.prototype;

    /**
     * 清空处理
     */
    _proto_.clear = function() {
        this.closeAll();
        this._views = {};
    }

    /**
     * 面板注册
     * @param key 面板唯一标识 {any}
     * @param view 面板 {BaseView}
     */
    _proto_.register = function(key, view) {
        if (view == null) {
            return;
        }
        if (this._views[key]) {
            return;
        }
        this._views[key] = view;
    }

    /**
     * 面板解除注册
     * @param key {any}
     */
    _proto_.unregister = function(key) {
        if (!this._views[key]) {
            return;
        }
        this._views[key] = null;
        delete this._views[key];
    }

    /**
     * 销毁一个面板
     * @param key 唯一标识 {any}
     * @param newView 新面板 {BaseView}
     */
    _proto_.destroy = function(key, newView) {
        (newView === void 0) && (newView = null);
        var oldView = this.getView(key);
        if (oldView) {
            this.unregister(key);
            oldView.destroy();
        }
        this.register(key, newView);
    }

    /**
     * 开启面板
     * @param key 面板唯一标识 {any}
     * @param ...param:any[]
     *
     */
    _proto_.open = function(key) {
        var param = [];
        for (var i = 1; i < arguments.length; i++) {
            param[i - 1] = arguments[i];
        }
        var view = this.getView(key);
        if (view == null) {
            Logger.trace("UI_" + key + "不存在");
            return;
        }

        if (view.isShow()) {
            view.open.apply(view, param);
            return view;
        }

        if (view.isInit) {
            view.addToParent();
            view.open.apply(view, param);
        }else {
            App.EasyLoading.show();
            view.loadResource(
                function () {
                    view.setVisible(false);
                    view.addToParent();
                }.bind(this), 
                function () {
                    view.initView();
                    view.initData();
                    view.open.apply(view, param);
                    view.setVisible(true);
                    App.EasyLoading.close();
                }.bind(this)
            );
        }

        this._opens.push(key);
        return view;
    }

    /**
     * 关闭面板
     * @param key 面板唯一标识 {any}
     * @param ...param:any[]
     *
     */
    _proto_.close = function(key) {
        var param = [];
        for (var i = 1; i < arguments.length; i++) {
            param[i - 1] = arguments[i];
        }
        if (!this.isShow(key)) {
            return;
        }

        var view = this.getView(key);
        if (view == null) {
            return;
        }

        var viewIndex = this._opens.indexOf(key);
        if (key >= 0) {
            this._opens.splice(viewIndex, 1);
        }

        view.removeFromParent();
        view.close.apply(view, param);
    }

     /**
     * 根据唯一标识获取一个UI对象
     * @param key {any}
     * @returns {BaseView}
     */
    _proto_.getView = function(key) {
        return this._views[key];
    }

    /**
     * 关闭所有开启中的UI
     */
    _proto_.closeAll = function() {
        while (this._opens.length) {
            this.close(this._opens[0]);
        }
    }

    /**
     * 当前ui打开数量
     * @returns {number}
     */
    _proto_.currOpenNum = function() {
        return this._opens.length;
    }

    /**
     * 检测一个UI是否开启中
     * @param key {any}
     * @returns {boolean}
     */
    _proto_.isShow = function(key) {
        return this._opens.indexOf(key) != -1;
    }

    return ViewManager;
}());