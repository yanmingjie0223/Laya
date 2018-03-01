/*
* name;
*/
class ArrayUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 遍历操作，目前浏览器基本上支持es6 数组自带forEach方法
     * @param {Array} arr
     * @param {Function} callback
     * @param {any} thisObj
     */
    forEach(arr, callback, thisObj) {
        for (let i = 0, len = arr.length; i < len; i++) {
            callback.apply(thisObj, [arr[i], i]);
        }
    }

    /**
     * 打乱数组中的元素
     * @param {Array} arr
     */
    upset(arr) {
        let len = arr.length;
        let index;
        let tmp;
        for (let i = len - 1; i >= 0; i--) {
            index = (Math.random() * i)|0;
            tmp = arr[i];
            arr[i] = arr[index];
            arr[index] = tmp;
        }
    }

}