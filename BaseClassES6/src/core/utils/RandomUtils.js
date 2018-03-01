/*
* name;
*/
class RandomUtils extends BaseClass {

    constructor() {
        super();
    }

    /**
     * 获取一个区间的随机数 (from, end)
     * @param {number} from 最小值
     * @param {number} end 最大值
     * @returns {number}
     */
    limit(from, end) {
        let min = Math.min(from, end);
        let max = Math.max(from, end);
        let range = max - min;
        return min + Math.random() * range;
    }

    /**
     * 在一个数组中随机获取一个元素
     * @param {Array} arr 数组
     * @returns 随机出来的结果
     */
    randomArray(arr) {
        let index = (Math.random() * arr.length) | 0;
        return arr[index];
    }

}