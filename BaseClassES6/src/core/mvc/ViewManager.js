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
     * @param {any} viewKey view唯一标识
     * @param {BaseScene} scene 显示的主场景
     * @param ...args:any[]
     */
    show(viewKey, scene = null, ...args) {
        if (!this.isExists(viewKey)) {
            Logger.trace("View " + viewKey + "不存在");
            return;
        }
        //发送参数到view中
        let params = [scene];
        params = params.concat(args);

        let view = this._views[viewKey];
        view.show.apply(view, params);
    }

    /**
     * 控制关闭view
     * @param {any} viewKey view唯一标识
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
     * @param {any} viewKey 唯一标识
     * @return {boolean}
     */
    isExists(viewKey) {
        return !!this._views[viewKey];
    }

    /**
     * 获取指定View对象
     * @param {any} viewKey View唯一标识
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