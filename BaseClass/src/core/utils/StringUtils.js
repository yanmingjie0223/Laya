/*
* name;
*/
var StringUtils = (function () {

    function StringUtils() {
        StringUtils.__super.call(this);
    }

    Laya.class(StringUtils, "StringUtils", BaseClass);
    var _proto_ = StringUtils.prototype;
    var _getset_ = Laya.getset;

    /**
     * 去掉前后空格
     * @param str {string}
     * @returns {string}
     */
    _proto_.trimSpace = function(str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    }

    /**
     * 获取字符串长度，中文为2
     * @param str {string}
     */
    _proto_.getLength = function(str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            } else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 判断一个字符串是否包含中文
     * @param str {string}
     * @returns {boolean}
     */
    _proto_.isChinese = function(str) {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    }

    return StringUtils;
}());