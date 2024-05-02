import { Resource } from "../resource/Resource";
import { SpineSkeleton } from "./SpineSkeleton";

/**
 * Spine动画模板基类
 */
export class SpineTempletBase extends Resource {
	private _templet: SpineTempletBase;
    private _isDestroyed: boolean = false;
	public skeletonData: spine.SkeletonData;
    /**@internal */
	public _textureDic: any = {};
	/**cmd缓存 */
	private _graphicsCache: Record<string, Array<any[]>> = {};
	private _layaPremultipliedAlpha: boolean;
    private _spinePremultipliedAlpha: boolean;

	constructor() {
		super();
		this._layaPremultipliedAlpha = true;
		this._spinePremultipliedAlpha = false;
	}

	get templet() {
        return this._templet;
    }

    set templet(value: SpineTempletBase) {
        this._templet = value;
    }

    get isDestroyed() {
        return this._isDestroyed;
    }

    set isDestroyed(value: boolean) {
        this._isDestroyed = value;
    }

	get spinePremultipliedAlpha() {
        return this._spinePremultipliedAlpha;
    }

    set spinePremultipliedAlpha(value: boolean) {
        this._spinePremultipliedAlpha = value;
    }

    /**
	 * 创建动画
	 * @return
	 */
    buildArmature(aniMode: number): SpineSkeleton {
		return new SpineSkeleton(this, aniMode);
	}

	/**
	 * 通过索引得动画名称
	 * @param	index
	 * @return
	 */
	getAniNameByIndex(index: number): string {
		let tAni: any = this.skeletonData.animations[index];
		if (tAni) return tAni.name;
		return null;
	}

	/**
	 * 通过皮肤名字得到皮肤索引
	 * @param	skinName 皮肤名称
	 * @return
	 */
	getSkinIndexByName(skinName: string): number {
		let skins =  this.skeletonData.skins;
		let tSkinData: spine.Skin;
		for (let i: number = 0, n: number = skins.length; i < n; i++) {
			tSkinData = skins[i];
			if (tSkinData.name == skinName) {
				return i;
			}
		}
		return -1;
	}

	setFrameCmd(aniName: string, frameIndex: number, cmds: any[]): void {
		if (!this._graphicsCache) {
			return;
		}
		if (!this._graphicsCache[aniName]) {
			this._graphicsCache[aniName] = [];
		}
		this._graphicsCache[aniName][frameIndex] = cmds;
	}

	getFrameCmd(aniName: string, frameIndex: number): any[] | null {
		if (this._graphicsCache && this._graphicsCache[aniName]) {
			return this._graphicsCache[aniName][frameIndex];
		}
		return null;
	}

	setAnimationCmd(aniName: string, cmds: any[]): void {
		if (!cmds) {
			return;
		}

		this._graphicsCache[aniName] = cmds;
	}

	getAnimationCmd(aniName: string): Array<any[]> | null {
		if (this._graphicsCache[aniName]) {
			return this._graphicsCache[aniName];
		}
		return null;
	}

	getAnimationCmdNum(): number {
		if (!this._graphicsCache) {
			return 0
		}

		let count = 0;
		for (const key in this._graphicsCache) {
			++count;
		}
		return count;
	}

	clearFrameCmd(aniName: string, frameIndex: number): void {
		if (this._graphicsCache[aniName]) {
			this._graphicsCache[aniName][frameIndex] = null!;
		}
	}

	clearGraphicsCache(): void {
		this._graphicsCache = {};
	}

	/**
	 * 释放纹理
	 * @override
	 */
	destroy(): void {
		this.skeletonData = null!;
		this.isDestroyed = true;
		let tTexture: any;
		for (tTexture in this._textureDic) {
			if (tTexture == "root")
				continue;
			if (tTexture) {
				this._textureDic[tTexture].destroy();
			}
		}
		this._textureDic = {};
		this._graphicsCache = null!;
		super.destroy();
	}
}