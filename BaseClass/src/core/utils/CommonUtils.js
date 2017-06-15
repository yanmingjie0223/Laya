/*
* name;
*/
var CommonUtils = (function () {

    function CommonUtils() {
        this.__super.call(this);
    }

    Laya.class(CommonUtils, "CommonUtils", BaseClass);
    var _proto_ = CommonUtils.prototype;

    /**
     * 给字体添加描边
     * @param lable  文字 {Laya.Lable|Laya.Text}
     * @param color  表示文本的描边颜色 {string}
     * @param width  描边宽度 {number}
     */
    _proto_.addLableStrokeColor = function(lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    }

    /**
     * 深度复制
     * @param {any}
     * @param {any}
     */
    _proto_.copyObj = function(obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }else if (obj instanceof Object) {
            newObj = {};
        }else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyObj(obj[key]);
        }
        return newObj;
    }

    /**
     * 万字的显示
     * @param label {Laya.Lable|Laya.Text}
     * @param num {number}
     */
    _proto_.labelIsOverLenght = function (label, num) {
        var str = null;
        if (num < 100000) {
            str = num + "";
        }else if (num < 1000000) {
            str = Math.floor(num / 1000 / 10).toString() + "万";
        }else {
            str = Math.floor(num / 10000).toString() + "万";
        }
        label.text = str;
    };

    /**
     * int64转number
     * @param obj {any}
     * @returns {number}
     */
    _proto_.int64ToNumber = function(obj) {
        return parseInt(obj.toString());
    }

    return CommonUtils;
}());