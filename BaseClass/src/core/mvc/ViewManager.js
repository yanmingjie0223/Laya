/*
* name;
*/
var ViewManager = (function () {

    function ViewManager() {
        ViewManager.__super.call(this);
        this._views = {};
    }

    Laya.class(ViewManager, "ViewManager", BaseClass);
    var _proto_ = ViewManager.prototype;

    /**
     * 注册View
     * @param viewKey
     * @param view
     */
    _proto_.register = function(viewKey, view){
        if(this.isExists(viewKey)) 
            return;
        this._views[viewKey] = view;
    }

    /**
     * 注销View
     * @param viewKey
     */
    _proto_.unregister = function(viewKey){
        if(!this.isExists(viewKey)) 
            return;
        this._views[viewKey] = null;
        delete this._views[viewKey];
    }

    /**
     * 摧毁view
     * @param viewKey
     */
    _proto_.destroy = function(viewKey){
        if(!this.isExists(viewKey)) 
            return;
        
        var view = this._views[viewKey];
        delete this._views[viewKey];

        view.close();
        view.destroy();
    }

    /**
     * 控制显示view
     * @param viewKey view唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.show = function(viewKey){
        if(!this.isExists(viewKey)){
            Logger.trace("View " + viewKey + "不存在");
            return;
        }
        
        var view = this._views[viewKey];

        var params = [];
        for (var i = 1; i < arguments.length; i++) {
            params[i - 1] = arguments[i];
        }
        view.show.apply(view, params);

    }

    /**
     * 控制关闭view
     * @param viewKey view唯一标识 {any}
     */
    _proto_.close = function(viewKey){
        if(!this.isExists(viewKey)){
            Logger.trace("View " + viewKey + "不存在");
            return;
        }
        
        var view = this._views[viewKey];
        view.close();

    }

    /**
     * 是否已经存在View
     * @param viewKey 唯一标识 {any}
     * @return {Boolean}
     */
    _proto_.isExists = function(viewKey) {
        return this._views[viewKey] != null;
    }

    /**
     * 获取指定View对象
     * @param viewKey View唯一标识 {any}
     * @returns {BaseView}
     */
    _proto_.getView = function(viewKey){
        var view = this._views[viewKey];
        if (view) {
            return view;
        }
        return null;
    }

    return ViewManager;
}());