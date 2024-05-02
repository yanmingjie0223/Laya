import { Point } from '../../maths/Point';
import { Rectangle } from "../../maths/Rectangle";
import { ClassUtils } from "../../utils/ClassUtils";
import { Pool } from "../../utils/Pool";

/**
 * @private
 */
export class HTMLHitRect {

    touch: Point;
    rec: Rectangle;
    href: string;

    //TODO:coverage
    constructor() {
        this.rec = new Rectangle();
        this.touch = new Point();
        this.reset();
    }

    reset(): HTMLHitRect {
        this.rec.reset();
        this.href = null;
        return this;
    }

    recover(): void {
        Pool.recover("HTMLHitRect", this.reset());
    }

    static create(): HTMLHitRect {
        return Pool.getItemByClass("HTMLHitRect", HTMLHitRect);
    }
}

ClassUtils.regClass("laya.html.dom.HTMLHitRect", HTMLHitRect);
ClassUtils.regClass("Laya.HTMLHitRect", HTMLHitRect);