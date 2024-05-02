import { Sprite } from "laya/display/Sprite";
import { Point } from "laya/maths/Point";
import { HitArea } from "laya/utils/HitArea";

let _func: Function = HitArea["_isHitGraphic"];

export class ChildHitArea extends HitArea {
	private _child: Sprite;
	private _reversed: boolean;

	constructor(child: Sprite, reversed?: boolean) {
		super();

		this._child = child;
		this._reversed = reversed;

		if (this._reversed) this.unHit = child.hitArea.hit;
		else this.hit = child.hitArea.hit;
	}

	public contains(x: number, y: number): boolean {
		var tPos: Point;
		tPos = Point.TEMP;
		tPos.setTo(0, 0);
		tPos = this._child.toParentPoint(tPos);
		if (this._reversed) return !_func(x - tPos.x, y - tPos.y, this.unHit);
		else return _func(x - tPos.x, y - tPos.y, this.hit);
	}
}
