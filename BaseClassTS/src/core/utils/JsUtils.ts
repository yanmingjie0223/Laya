
/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 16:17:36
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-05 15:53:31
 */
export class JsUtils {

    /**
	 * 该方法是对 `Object.create(null)` 的简单封装。
	 * `Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。
	 * 这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断，此时对性能提升有帮助。
	 * @param forceDictMode
	 * @returns
	 */
	public static createMap(forceDictMode?: boolean): any {
		const map = Object.create(null);
		if (forceDictMode) {
			map['.'] = 1;
			map['/'] = 1;
			delete map['.'];
			delete map['/'];
		}
		return map;
	}

}
