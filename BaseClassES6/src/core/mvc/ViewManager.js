/*
* name;
*/
class ViewManager extends BaseClass {

    constructor() {
        super();
        this._views = {};
    }

    /**
     * 注册View
     * @param viewKey
     * @param view
     */
    register(viewKey, view) {
        if (this.isExists(viewKey)) 
            return;
        this._views[viewKey] = view;
    }

    /**
     * 注销View
     * @param viewKey
     */
    unregister(viewKey) {
        if (!this.isExists(viewKey))
            return;
        this._views[viewKey] = null;
        delete this._views[viewKey];
    }

    /**
     * 摧毁view
     * @param viewKey
     */
    destroy(viewKey) {
        if (!this.isExists(viewKey))
            return;
        
        let view = this._views[viewKey];
        delete this._views[viewKey];

        view.close();
        view.destroy();
    }

    /**
     * 控制显示view
     * @param viewKey view唯一标识 {any}
     * @param ...param:any[]
     */
    show(viewKey, ...args) {
        if (!this.isExists(viewKey)) {
            Logger.trace("View " + viewKey + "不存在");
            return;
        }
        
        let view = this._views[viewKey];
        view.show.apply(view, args);
    }

    /**
     * 控制关闭view
     * @param viewKey view唯一标识 {any}
     */
    close(viewKey) {
        if (!this.isExists(viewKey)) {
            Logger.trace("View " + viewKey + "不存在");
            return;
        }
        
        let view = this._views[viewKey];
        view.close();
    }

    /**
     * 是否已经存在View
     * @param viewKey 唯一标识 {any}
     * @return {Boolean}
     */
    isExists(viewKey) {
        return !!this._views[viewKey];
    }

    /**
     * 获取指定View对象
     * @param viewKey View唯一标识 {any}
     * @returns {BaseView}
     */
    getView(viewKey) {
        let view = this._views[viewKey];
        if (view) {
            return view;
        }
        return null;
    }

}