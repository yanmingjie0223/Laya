import { stage } from "Laya";
import { Event } from "laya/events/Event";
import { Point } from "laya/maths/Point";
import { Events } from "./Events";
import { GLoader } from "./GLoader";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";

export class DragDropManager {
	private _agent: GLoader;
	private _sourceData: any;

	private static _inst: DragDropManager;
	public static get inst(): DragDropManager {
		if (!DragDropManager._inst) DragDropManager._inst = new DragDropManager();
		return DragDropManager._inst;
	}

	constructor() {
		this._agent = new GLoader();
		this._agent.draggable = true;
		this._agent.touchable = false; ////important
		this._agent.setSize(100, 100);
		this._agent.setPivot(0.5, 0.5, true);
		this._agent.align = "center";
		this._agent.verticalAlign = "middle";
		this._agent.sortingOrder = 1000000;
		this._agent.on(Events.DRAG_END, this, this.__dragEnd);
	}

	public get dragAgent(): GObject {
		return this._agent;
	}

	public get dragging(): boolean {
		return this._agent.parent != null;
	}

	public startDrag(
		source: GObject,
		icon: string,
		sourceData?: any,
		touchID?: number
	): void {
		if (this._agent.parent) return;

		this._sourceData = sourceData;
		this._agent.url = icon;
		GRoot.inst.addChild(this._agent);
		var pt: Point = GRoot.inst.globalToLocal(
			stage.mouseX,
			stage.mouseY
		);
		this._agent.setXY(pt.x, pt.y);
		this._agent.startDrag(touchID);
	}

	public cancel(): void {
		if (this._agent.parent) {
			this._agent.stopDrag();
			GRoot.inst.removeChild(this._agent);
			this._sourceData = null;
		}
	}

	private __dragEnd(evt: Event): void {
		if (!this._agent.parent)
			//cancelled
			return;

		GRoot.inst.removeChild(this._agent);

		var sourceData: any = this._sourceData;
		this._sourceData = null;

		var obj: GObject = GObject.cast(evt.target);
		while (obj) {
			if (obj.displayObject.hasListener(Events.DROP)) {
				obj.requestFocus();
				obj.displayObject.event(Events.DROP, [
					sourceData,
					Events.createEvent(Events.DROP, obj.displayObject, evt),
				]);
				return;
			}

			obj = obj.parent;
		}
	}
}
