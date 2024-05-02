import fgui from '../../fgui/index';
import EventManager from '../manager/EventManager';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-25 13:54:13
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2022-03-06 16:24:24
 */
export default class BComponent extends fgui.GComponent {

	public isVilid(): boolean {
		return !this.displayObject || this.isDisposed;
	}

	/**
	 * 帧刷新事件(s)
	 */
	protected onUpdate(dt?: number): void { }

	/**
	 * xml初始化完成后，可在这里做一些初始化操作
	 */
	protected onConstruct(): void { }

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
	protected offEventListener(type: string, target: any, callback: Function): void {
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
