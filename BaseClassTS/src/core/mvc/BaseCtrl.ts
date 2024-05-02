import EventManager from "../manager/EventManager";
import BaseModel from "./BaseModel";
import BaseView from "./BaseView";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-11 15:21:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-04 15:33:01
 */
export default class BaseCtrl {

	/**数据源 */
	private _model: BaseModel;
	/**view界面 */
	private _view: BaseView;

	/**
	 * 设置和获取model数据源
	 */
	public set model(model: BaseModel) {
		this._model = model;
	}
	public get model(): BaseModel {
		return this._model;
	}

	/**
	 * 设置和获取view
	 */
	public set view(view: BaseView) {
		this._view = view;
	}
	public get view(): BaseView {
		return this._view;
	}

	/**
	 * 销毁对象
	 */
	public destroy(): void {
		this._model = null;
		this._view = null;
	}

	/**
	 * 全局事件处理
	 */
	protected addEventListener(
		type: string,
		target: any,
		callback: Function,
		args: any[] = null
	): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.addEventListener(type, target, callback, args);
	}
	protected addOnceEventListener(
		type: string,
		target: any,
		callback: Function,
		args: any[] = null
	): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.addOnceEventListener(type, target, callback, args);
	}
	protected offEventListener(
		type: string,
		target: any,
		callback: Function
	): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.offEventListener(type, target, callback);
	}
	protected emitEvent(type: string, args: any = null): void {
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.emitEvent(type, args);
	}
	protected hasAddEventListener(type: string): boolean {
		const eventMgr = EventManager.getInstance<EventManager>();
		return eventMgr.hasAddEventListener(type);
	}
}
