/*
* name;
*/
var DebugUtils = (function () {

    function DebugUtils() {
        DebugUtils.__super.call(this);
        this._isDebug = false;
    }

    Laya.class(DebugUtils, "DebugUtils", BaseClass);
    var _proto_ = DebugUtils.prototype;
    var _getset_ = Laya.getset;

    /**
     * 获取和设置调试状态
     */
    _getset_(0, _proto_, "isDebug",
        function(){
            return this._isDebug
        },
        function(value){
            this._isDebug = value;
        }
    );

    return DebugUtils;
}());