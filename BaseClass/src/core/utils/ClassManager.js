/*
* name;
*/
var ClassManager = (function () {

    function ClassManager() {
        ClassManager.__super.call(this);
        this._cache = null;
    }

    Laya.class(ClassManager, "ClassManager", BaseClass);
    var _proto_ = ClassManager.prototype;

    /**
     * 触发本模块消息
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    _proto_.getClass = function(Class) {
        if (!this._cache) {
            this._cache = [];
        }
        for (var i in this._cache) {
            if (this._cache[i] instanceof Class) {
                return this._cache[i];
            }
        }
        var _cla = App.CommonUtils.getClass(arguments);
        this._cache.push(_cla);
        return _cla;
    }

    _proto_.clear = function(Class) {
        if (!this._cache) {
            return;
        }
        for (var i in this._cache) {
            if (this._cache[i] instanceof Class) {
                this._cache.splice(parseInt(i+""), 1);
                break;
            }
        }
    }

    _proto_.clearAll = function() {
        this._cache = null;
    }

    return ClassManager;
}());