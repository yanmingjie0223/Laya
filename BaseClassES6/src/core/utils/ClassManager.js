/*
* name;
*/
class ClassManager extends BaseClass {

    constructor() {
        super();
        //所有缓存类数组
        this._cache = null;
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识 {any}
     * @param ...param:any[]
     */
    getClass(Class) {
        if (!this._cache) {
            this._cache = [];
        }
        for (let i in this._cache) {
            if (this._cache[i] instanceof Class) {
                return this._cache[i];
            }
        }
        let _cla = this._getClass(arguments);
        this._cache.push(_cla);
        return _cla;
    }

    clear(Class) {
        if (!this._cache) {
            return;
        }
        for (let i in this._cache) {
            if (this._cache[i] instanceof Class) {
                this._cache.splice(parseInt(i+""), 1);
                break;
            }
        }
    }

    clearAll() {
        this._cache = null;
    }

    /**
     * 获取类实类对象，传入类实参
     * @param args ...args {Array}
     */
    _getClass(args) {
        let params = [];
        for (let i = 1; i < args.length; i++) {
            params[i - 1] = args[i];
        }
        let len = params.length;
        let Class = args[0];
        let _cla = null;
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

}
