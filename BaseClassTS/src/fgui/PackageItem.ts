import { Templet } from "laya/ani/bone/Templet";
import { Point } from "laya/maths/Point";
import { Rectangle } from "laya/maths/Rectangle";
import { Texture } from "laya/resource/Texture";
import { BitmapFont } from "./display/BitmapFont";
import { Frame } from "./display/MovieClip";
import { UIContentScaler } from "./UIContentScaler";
import { UIPackage } from "./UIPackage";
import { ByteBuffer } from "./utils/ByteBuffer";
import { PixelHitTestData } from "./utils/PixelHitTest";

export class PackageItem {
	public owner: UIPackage;

	public type: number;
	public objectType?: number;

	public id: string;
	public name: string;
	public width: number = 0;
	public height: number = 0;
	public file: string;
	public decoded?: boolean;
	public loading?: Array<Function>;
	public rawData?: ByteBuffer;

	public highResolution?: Array<string>;
	public branches?: Array<string>;

	//image
	public scale9Grid?: Rectangle;
	public scaleByTile?: boolean;
	public tileGridIndice?: number;
	public smoothing?: boolean;
	public texture?: Texture;
	public pixelHitTestData?: PixelHitTestData;

	//movieclip
	public interval?: number;
	public repeatDelay?: number;
	public swing?: boolean;
	public frames?: Frame[];

	//componenet
	public extensionType?: any;

	//font
	public bitmapFont?: BitmapFont;

	//skeleton
	public templet?: Templet;
	public skeletonAnchor?: Point;

	constructor() {}

	public load(): Object {
		return this.owner.getItemAsset(this);
	}

	public getBranch(): PackageItem {
		if (this.branches && this.owner._branchIndex != -1) {
			var itemId: string = this.branches[this.owner._branchIndex];
			if (itemId) return this.owner.getItemById(itemId);
		}

		return this;
	}

	public getHighResolution(): PackageItem {
		if (this.highResolution && UIContentScaler.scaleLevel > 0) {
			var itemId: string = this.highResolution[UIContentScaler.scaleLevel - 1];
			if (itemId) return this.owner.getItemById(itemId);
		}

		return this;
	}

	public toString(): string {
		return this.name;
	}
}
