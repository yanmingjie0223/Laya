import EventManager from '../manager/EventManager';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 15:33:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2022-02-16 09:46:56
 */
export default abstract class BaseModel {
	/**销毁 注: 需要通过ModelManager来销毁注销 */
	public destroy(): void { }
	/**清理 */
	public clear(): void { }
	/**初始化 */
	public initialize(): void { }

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
