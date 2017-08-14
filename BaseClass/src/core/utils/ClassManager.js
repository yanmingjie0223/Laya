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
        var _cla = this._getClass(arguments);
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

    /**
     * 获取类实类对象，传入类实参
     * @param args ...args {Array}
     */
    _proto_._getClass = function(args) {
        var params = [];
        for (var i = 1; i < args.length; i++) {
            params[i - 1] = args[i];
        }
        var len = params.length;
        var Class = args[0];
        var _cla = null;
        switch(len){
            case 0:
                _cla = new Class();
                break;
            case 1:
                _cla = new Class(params[0]);
                break;
            case 2:
                _cla = new Class(params[0], params[1]);
                break;
            case 3:
                _cla = new Class(params[0], params[1], params[2]);
                break;
            case 4:
                _cla = new Class(params[0], params[1], params[2], params[3]);
                break;
            case 5:
                _cla = new Class(params[0], params[1], params[2], params[3], params[4]);
                break;
            case 6:
                _cla = new Class(params[0], params[1], params[2], params[3], params[4], params[5]);
                break;
        }
        return _cla;
    }

    return ClassManager;
}());