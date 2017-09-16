/*
* name;
*/
class DebugUtils extends BaseClass {

    constructor() {
        super();
        this._isDebug = null;
    }

    get isDebug() {
        return !!this._isDebug
    }

    set isDebug(value) {
        this._isDebug = value;
    }

}