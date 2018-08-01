/*
* name;
*/
class StringUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 去掉前后空格
     * @param {string} str
     * @returns {string}
     */
    trimSpace(str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    }

    /**
     * 获取字符串长度，中文为2
     * @param {string} str
     * @returns {number}
     */
    getLength(str) {
        let strArr = str.split("");
        let length = 0;
        for (let i = 0; i < strArr.length; i++) {
            let s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 判断一个字符串是否包含中文
     * @param {string} str
     * @returns {boolean}
     */
    isChinese(str) {
        let reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    }

    /**
     * 将字符串（emoji表情）转换成16进制，Unicode编码存储是4个字节，两个2个字节组合
     *
     * @param {string} str
     */
    stringToCode16(str) {
        const len = str.length;
        let codes = '';
        for (let i = 0; i < len; i++) {
            let code = str.charCodeAt(i).toString(16);
            codes += ';' + code;
        }
        return codes;
    }

    /**
     * 字节码，转换成unicode显示
     *
     * @param {string} str
     */
    code16ToString(str) {
        let uCodeStr = '';
        const strArr = str.split(';');
        for (let i = 0, len = strArr.length; i < len; i++) {
            let code = strArr[i];
            // ASCII补充高位
            let fillNum = 0;
            if (code.length < 4) {
                fillNum = 4 - code.length;
            }
            for (let k = 0; k < fillNum; k++) {
                code = '0' + code;
            }
            uCodeStr += '\\u' + code;
        }
        return uCodeStr;
    }

}