import BaseView from '../mvc/BaseView';

export const viewClasss = new Map<string, { new (): BaseView }>();

/**
 * View类装饰器
 * @param constructor
 * @returns
 */
export function ViewRegister(constructor: any): any {
	const key = constructor.key;
	if (key) {
		viewClasss.set(key, constructor);
	}
	return constructor;
}
