import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:17:36
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-12-21 11:50:37
 */
export default class ArrayUtils extends Singleton {

    /**
     * 打乱数组中的元素
     * @param {Array} arr
     */
    public upset(arr: Array<any>): void {
        arr.sort(() => Math.random() - 0.5);
    }

	/**
	 * 判断两数组是否内容相同
	 * @param a
	 * @param b
	 * @returns
	 */
	public equal(a: string[] | number[], b: string[] | number[]): boolean {
		if (a === b) {
			return true;
		}

		if (!a || !b) {
			return false;
		}

		for (let i = 0, len = a.length; i < len; i++) {
			const index = b.indexOf(a[i] as never);
			if (index === -1) {
				return false;
			}
		}

		for (let i = 0, len = b.length; i < len; i++) {
			const index = a.indexOf(b[i] as never);
			if (index === -1) {
				return false;
			}
		}

		return true;
	}

}
