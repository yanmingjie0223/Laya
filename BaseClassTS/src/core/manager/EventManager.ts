import { EventDispatcher } from "laya/events/EventDispatcher";
import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:07:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-04 15:49:52
 */
export default class EventManager extends Singleton {
	private eventNode: EventDispatcher;

	public constructor() {
		super();
		this.eventNode = new EventDispatcher();
	}

	/**
	 * 再次封装方法是为了全局事件监听名字统一，方便理解和处理
	 */
	public addEventListener(
		type: string,
		target: any,
		callback: Function,
		args: any[] = null!
	): void {
		this.eventNode.on(type, target, callback, args);
	}
	public addOnceEventListener(
		type: string,
		target: any,
		callback: Function,
		args: any[] = null!
	): void {
		this.eventNode.once(type, target, callback, args);
	}
	public offEventListener(type: string, target: any, callback: Function): void {
		this.eventNode.off(type, target, callback);
	}
	public emitEvent(type: string, args: any = null): void {
		this.eventNode.event(type, args);
	}
	public hasAddEventListener(type: string): boolean {
		return this.eventNode.hasListener(type);
	}
}
