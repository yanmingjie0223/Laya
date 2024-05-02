type numType = number | string;
let _boundaryCheckingState = true;

/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
export class CalcuUtils {

	/**
	 * 把错误的数据转正
	 * strip(0.09999999999999998)=0.1
	 * @param num
	 * @param precision
	 * @returns
	 */
	public static strip(num: numType, precision = 15): number {
		return +parseFloat(Number(num).toPrecision(precision));
	}

	/**
	 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
	 * @param num
	 * @returns
	 */
	public static float2Fixed(num: numType): number {
		if (num.toString().indexOf('e') === -1) {
			return Number(num.toString().replace('.', ''));
		}
		const dLen = this.digitLength(num);
		return dLen > 0 ? this.strip(Number(num) * Math.pow(10, dLen)) : Number(num);
	}

	/**
	 * 检测数字是否越界，如果越界给出提示
	 * @param num
	 */
	public static checkBoundary(num: number) {
		if (_boundaryCheckingState) {
			if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
				console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
			}
		}
	}

	/**
	 * 精确乘法
	 * @param nums
	 * @returns
	 */
	public static multi(...nums: numType[]): number {
		if (nums.length > 2) {
			return this.iteratorOperation(nums, this.multi);
		}

		const [num1, num2] = nums;
		const num1Changed = this.float2Fixed(num1);
		const num2Changed = this.float2Fixed(num2);
		const baseNum = this.digitLength(num1) + this.digitLength(num2);
		const leftValue = num1Changed * num2Changed;

		this.checkBoundary(leftValue);

		return leftValue / Math.pow(10, baseNum);
	}

	/**
	 * 精确加法
	 * @param nums
	 * @returns
	 */
	public static add(...nums: numType[]): number {
		if (nums.length > 2) {
			return this.iteratorOperation(nums, this.add);
		}

		const [num1, num2] = nums;
		// 取最大的小数位
		const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
		// 把小数都转为整数然后再计算
		return (this.multi(num1, baseNum) + this.multi(num2, baseNum)) / baseNum;
	}

	/**
	 * 精确减法
	 * @param nums
	 * @returns
	 */
	public static sub(...nums: numType[]): number {
		if (nums.length > 2) {
			return this.iteratorOperation(nums, this.sub);
		}

		const [num1, num2] = nums;
		const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
		return (this.multi(num1, baseNum) - this.multi(num2, baseNum)) / baseNum;
	}

	/**
	 * 精确除法
	 * @param nums
	 * @returns
	 */
	public static divide(...nums: numType[]): number {
		if (nums.length > 2) {
			return this.iteratorOperation(nums, this.divide);
		}

		const [num1, num2] = nums;
		const num1Changed = this.float2Fixed(num1);
		const num2Changed = this.float2Fixed(num2);
		this.checkBoundary(num1Changed);
		this.checkBoundary(num2Changed);
		// fix: 类似 10 ** -4 为 0.00009999999999999999，strip 修正
		return this.multi(num1Changed / num2Changed, this.strip(Math.pow(10, this.digitLength(num2) - this.digitLength(num1))));
	}

	/**
	 * 四舍五入
	 * @param num
	 * @param ratio
	 * @returns
	 */
	public static round(num: numType, ratio: number): number {
		const base = Math.pow(10, ratio);
		let result = this.divide(Math.round(Math.abs(this.multi(num, base))), base);
		if ((num as any) < 0 && result !== 0) {
			result = this.multi(result, -1);
		}
		return result;
	}

	/**
	 * 是否进行边界检查，默认开启
	 * @param flag 标记开关，true 为开启，false 为关闭，默认为 true
	 */
	public static enableBoundaryChecking(flag = true) {
		_boundaryCheckingState = flag;
	}

	/**
	 * 数字的位数长度
	 * @param num
	 * @returns
	 */
	private static digitLength(num: numType): number {
		// Get digit length of e
		const eSplit = num.toString().split(/[eE]/);
		const len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
		return len > 0 ? len : 0;
	}

	/**
	 * 迭代操作
	 * @param arr
	 * @param operation
	 * @returns
	 */
	private static iteratorOperation(arr: numType[], operation: (...args: numType[]) => number): number {
		const [num1, num2, ...others] = arr;
		let res = operation(num1, num2);

		others.forEach((num) => {
			res = operation(res, num);
		});

		return res;
	}

}
