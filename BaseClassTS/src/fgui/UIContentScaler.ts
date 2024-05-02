import { stage } from "Laya";
import { Matrix } from "laya/maths/Matrix";
import { Rectangle } from "laya/maths/Rectangle";

export class UIContentScaler {
    public static scaleFactor: number = 1;
    public static scaleLevel: number = 0;
    public static rootSize: Rectangle = new Rectangle();
}

export function updateScaler(): void {
    var mat: Matrix = <Matrix>(<any>stage)._canvasTransform;
    var ss: number = Math.max(mat.getScaleX(), mat.getScaleY());
    if (ss >= 3.5) UIContentScaler.scaleLevel = 3;
    //x4
    else if (ss >= 2.5) UIContentScaler.scaleLevel = 2;
    //x3
    else if (ss >= 1.5) UIContentScaler.scaleLevel = 1;
    //x2
    else UIContentScaler.scaleLevel = 0;
}