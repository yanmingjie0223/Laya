import { stage } from "Laya";
import { Event } from "laya/events/Event";
import { Point } from "laya/maths/Point";
import { Log } from "laya/utils/Log";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { GObjectType } from "./GObjectConst";
import { ScrollPane } from "./ScrollPane";
import { ByteBuffer } from "./utils/ByteBuffer";

export class GScrollBar extends GComponent {
	private _grip: GObject;
	private _arrowButton1: GObject;
	private _arrowButton2: GObject;
	private _bar: GObject;
	private _target: ScrollPane;

	private _vertical: boolean;
	private _scrollPerc: number;
	private _fixedGripSize: boolean;

	private _dragOffset: Point;
	private _gripDragging: boolean;

	constructor() {
		super();

		this._cKey = GObjectType.GScrollBar;
		this._dragOffset = new Point();
		this._scrollPerc = 0;
	}

	public setScrollPane(target: ScrollPane, vertical: boolean): void {
		this._target = target;
		this._vertical = vertical;
	}

	public setDisplayPerc(value: number) {
		if (this._vertical) {
			if (!this._fixedGripSize)
				this._grip.height = Math.floor(value * this._bar.height);
			this._grip.y =
				this._bar.y + (this._bar.height - this._grip.height) * this._scrollPerc;
		} else {
			if (!this._fixedGripSize)
				this._grip.width = Math.floor(value * this._bar.width);
			this._grip.x =
				this._bar.x + (this._bar.width - this._grip.width) * this._scrollPerc;
		}
		this._grip.visible = value != 0 && value != 1;
	}

	public setScrollPerc(val: number) {
		this._scrollPerc = val;
		if (this._vertical)
			this._grip.y =
				this._bar.y + (this._bar.height - this._grip.height) * this._scrollPerc;
		else
			this._grip.x =
				this._bar.x + (this._bar.width - this._grip.width) * this._scrollPerc;
	}

	public get minSize(): number {
		if (this._vertical)
			return (
				(this._arrowButton1 ? this._arrowButton1.height : 0) +
				(this._arrowButton2 ? this._arrowButton2.height : 0)
			);
		else
			return (
				(this._arrowButton1 ? this._arrowButton1.width : 0) +
				(this._arrowButton2 ? this._arrowButton2.width : 0)
			);
	}

	public get gripDragging(): boolean {
		return this._gripDragging;
	}

	protected constructExtension(buffer: ByteBuffer): void {
		buffer.seek(0, 6);

		this._fixedGripSize = buffer.readBool();

		this._grip = this.getChild("grip");
		if (!this._grip) {
			Log.print("需要定义grip");
			return;
		}

		this._bar = this.getChild("bar");
		if (!this._bar) {
			Log.print("需要定义bar");
			return;
		}

		this._arrowButton1 = this.getChild("arrow1");
		this._arrowButton2 = this.getChild("arrow2");

		this._grip.on(Event.MOUSE_DOWN, this, this.__gripMouseDown);

		if (this._arrowButton1)
			this._arrowButton1.on(
				Event.MOUSE_DOWN,
				this,
				this.__arrowButton1Click
			);
		if (this._arrowButton2)
			this._arrowButton2.on(
				Event.MOUSE_DOWN,
				this,
				this.__arrowButton2Click
			);

		this.on(Event.MOUSE_DOWN, this, this.__barMouseDown);
	}

	private __gripMouseDown(evt: Event): void {
		evt.stopPropagation();

		this._gripDragging = true;
		this._target.updateScrollBarVisible();

		stage.on(Event.MOUSE_MOVE, this, this.__gripMouseMove);
		stage.on(Event.MOUSE_UP, this, this.__gripMouseUp);

		this.globalToLocal(stage.mouseX, stage.mouseY, this._dragOffset);
		this._dragOffset.x -= this._grip.x;
		this._dragOffset.y -= this._grip.y;
	}

	private __gripMouseMove(): void {
		if (!this.onStage) return;

		var pt: Point = this.globalToLocal(
			stage.mouseX,
			stage.mouseY,
			s_vec2
		);
		if (this._vertical) {
			var curY: number = pt.y - this._dragOffset.y;
			this._target.setPercY(
				(curY - this._bar.y) / (this._bar.height - this._grip.height),
				false
			);
		} else {
			var curX: number = pt.x - this._dragOffset.x;
			this._target.setPercX(
				(curX - this._bar.x) / (this._bar.width - this._grip.width),
				false
			);
		}
	}

	private __gripMouseUp(evt: Event): void {
		if (!this.onStage) return;

		stage.off(Event.MOUSE_MOVE, this, this.__gripMouseMove);
		stage.off(Event.MOUSE_UP, this, this.__gripMouseUp);

		this._gripDragging = false;
		this._target.updateScrollBarVisible();
	}

	private __arrowButton1Click(evt: Event): void {
		evt.stopPropagation();

		if (this._vertical) this._target.scrollUp();
		else this._target.scrollLeft();
	}

	private __arrowButton2Click(evt: Event): void {
		evt.stopPropagation();

		if (this._vertical) this._target.scrollDown();
		else this._target.scrollRight();
	}

	private __barMouseDown(evt: Event): void {
		var pt: Point = this._grip.globalToLocal(
			stage.mouseX,
			stage.mouseY,
			s_vec2
		);
		if (this._vertical) {
			if (pt.y < 0) this._target.scrollUp(4);
			else this._target.scrollDown(4);
		} else {
			if (pt.x < 0) this._target.scrollLeft(4);
			else this._target.scrollRight(4);
		}
	}
}

const s_vec2: Point = new Point();
