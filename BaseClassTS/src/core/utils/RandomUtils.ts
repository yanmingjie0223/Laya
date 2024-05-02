import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:07:33
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-07-24 10:42:44
 */
export default class RandomUtils extends Singleton {

    /**
     * 获取一个区间的随机数 [min, max)
     * @param {number} from 最小值
     * @param {number} end 最大值
     * @returns {number}
     */
    public random(from: number, end: number): number {
        const min: number = Math.min(from, end);
        const max: number = Math.max(from, end);
        const range: number = max - min;
        return min + Math.random() * range;
    }

    /**
     * 获取数组中随机一个单元
     * @param arr 数组数据源
	 * @param isPutback 是否随机后放回 默认放回
     */
    public randomArray<T>(arr: Array<T>, isPutback: boolean = true): T | null {
		if (!arr || arr.length === 0) {
			return null;
		}
        const index: number = Math.floor(this.random(0, arr.length));
		if (isPutback) {
			return arr[index];
		}
		else {
			return arr.splice(index, 1)[0];
		}
    }

}
