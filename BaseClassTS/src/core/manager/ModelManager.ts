import Singleton from '../base/Singleton';
import BaseModel from '../mvc/BaseModel';
import DebugUtils from '../utils/DebugUtils';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 10:59:30
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2022-04-05 14:34:32
 */
export default class ModelManager extends Singleton {
	private _modelCache: Record<string, BaseModel> = {};

	public init(): void {
		const caches = this._modelCache;
		for (const cache in caches) {
			caches[cache].initialize();
		}
	}

	/**
	 * 注册model对象源
	 * @param ModelClass model类
	 */
	public register<T extends BaseModel>(ModelClass: { new (): T }): T | null {
		const key: string = (ModelClass as any).key;
		if (this._modelCache[key]) {
			return this._modelCache[key] as T;
		}

		if (key && !this._modelCache[key]) {
			const model: BaseModel = new ModelClass();
			this._modelCache[key] = model;
			return model as T;
		}
		else {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			if (!key) {
				debugUtils.error('注册的该model不存在public static readonly key');
			} else {
				debugUtils.warn('注册的该model已存在，请使用统一数据源！');
			}
		}

		return null;
	}

	/**
	 * 注销model对象源
	 * @param modelClass model类
	 */
	public unregister<T extends BaseModel>(modelClass: { new (): T }): T | null {
		const key: string = (modelClass as any).key;
		if (this._modelCache[key]) {
			const model: BaseModel = this._modelCache[key];
			delete this._modelCache[key];
			return model as T;
		}
		return null;
	}

	/**
	 * 获取model对象源
	 * @param modelClass model类
	 */
	public getModel<T extends BaseModel>(modelClass: { new (): T }): T | null {
		if (!modelClass) {
			return null;
		}

		const key: string = (modelClass as any).key;
		if (this._modelCache[key]) {
			return this._modelCache[key] as T;
		}
		else {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn(`获取model数据源对象${key}未在ModelManager中注册！`);
		}

		return null;
	}

	/**
	 * 通过名称获取model对象源
	 * @param name model类名
	 */
	public getModelByName<T extends BaseModel>(name: string): T | null {
		if (this._modelCache[name]) {
			return this._modelCache[name] as T;
		}
		else {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn(`获取model数据源对象${name}未在ModelManager中注册！`);
		}
		return null;
	}

	/**
	 * 清理所有model
	 */
	public clearAll(): void {
		for (const key in this._modelCache) {
			const model = this._modelCache[key];
			model.clear();
		}
	}

	/**
	 * 清理model
	 * @param modelClass
	 */
	public clear(modelClass: { new (): BaseModel }): void {
		const model = this.getModel(modelClass);
		if (model) {
			model.clear();
		}
	}

	/**
	 * 销毁model数据源
	 * @param modelClass
	 */
	public destroy(modelClass: { new (): BaseModel }): void {
		if (!modelClass) {
			return;
		}

		const model = this.unregister(modelClass);
		if (model) {
			model.destroy();
		}
	}

	/**
	 * 是否存在该model源
	 * @param modelClass model类
	 */
	public isExist(modelClass: { new (): BaseModel }): boolean {
		const key: string = (modelClass as any).key;
		if (this._modelCache[key]) {
			return true;
		}
		return false;
	}

}
