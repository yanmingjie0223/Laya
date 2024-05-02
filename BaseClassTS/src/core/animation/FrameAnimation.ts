import { Animation } from 'laya/display/Animation';
import { Event } from 'laya/events/Event';
import { Loader } from 'laya/net/Loader';
import { Handler } from 'laya/utils/Handler';
import fgui from '../../fgui/index';
import App from '../App';
import { FrameAnimationEvent } from './AnimationConst';

/**
 * 示例 坐标系为fgui坐标
 * const frame = App.DisplayUtils.createFrame('res/skill/dabing.atlas', 300, 500, this.node);
 * frame.node.on(FrameAnimationEvent.UPDATE, callback, thisobj);
 * frame.node.on(FrameAnimationEvent.START, callback, thisobj);
 * frame.node.on(FrameAnimationEvent.END, callback, thisobj);
 * frame.play();
 */
export class FrameAnimation {
	public aniUrl: string = '';
	/**帧播放间隔(ms) */
	public interval: number = 16;
	public loop: number = 1;
	public $obj: fgui.GComponent = null!;

	/**animation缓存地址 */
	private _cacheUrl: string = '';
	/**当前播放次数 */
	private _playCount: number = null!;
	/**播放速率 */
	private _playRate: number = 1;
	private _animation: Animation = null!;
	/**百分比锚点x */
	private _pivotX: number = 0.5;
	/**百分比锚点y */
	private _pivotY: number = 0.5;
	/**动画宽带 */
	private _aWidth: number = null!;
	/**动画高度 */
	private _aHeight: number = null!;

	public constructor() {
		this._animation = new Animation();
	}

	public get displayObject(): Animation {
		return this._animation;
	}

	/**
	 * 设置动画锚点
	 * @param ax
	 * @param ay
	 */
	public setAnchor(ax: number, ay: number): void {
		this._pivotX = ax;
		this._pivotY = ay;

		if (this._aWidth !== null) {
			this._animation.pivot(this._aWidth * this._pivotX, this._aHeight * this._pivotY);
		}
	}

	/**
	 * 设置动画缩放
	 * @param sx
	 * @param sy
	 */
	public setScale(sx: number, sy: number): void {
		if (this.$obj) {
			this.$obj.setScale(sx, sy);
		}
	}

	/**
	 * 设置该动画是否显示
	 * @param visible
	 */
	public setVisible(visible: boolean): void {
		if (this.$obj && this.displayObject) {
			this.$obj.visible = visible;
		}
	}

	/**
	 * 设置animation缓存地址
	 * @param cacheUrl
	 */
	public setCacheUrl(cacheUrl: string): void {
		this._cacheUrl = cacheUrl;
	}

	/**
	 * 获取缩放
	 * @returns
	 */
	public getScale(): { x: number; y: number } {
		const vec = { x: 0, y: 0 };
		if (this.$obj) {
			vec.x = this.$obj.scaleX;
			vec.y = this.$obj.scaleY;
		}
		return vec;
	}

	/**
	 * 设置透明度
	 * @param alpha
	 */
	public setAlpha(alpha: number): void {
		if (this.$obj && this.displayObject) {
			this.$obj.alpha = alpha;
		}
	}

	/**
	 * 获取透明度
	 * @returns
	 */
	public getAlpha(): number {
		if (this.$obj && this.displayObject) {
			return this.$obj.alpha;
		}
		return 1;
	}

	/**
	 * 设置位置xy
	 * @param x
	 * @param y
	 */
	public setXY(x: number, y: number): void {
		this.$obj.setXY(x, y);
	}

	/**
	 * 设置位置xy
	 * @param x
	 * @param y
	 */
	public pos(x: number, y: number): void {
		this.setXY(x, y);
	}

	/**
	 * 获取位置xy
	 * @returns
	 */
	public getXY(): { x: number; y: number } {
		return {
			x: this.$obj.x,
			y: this.$obj.y
		};
	}

	/**
	 * 播放动画
	 * @param interval 帧之间间隔(s)
	 * @param loop 播放次数，-1时候循环播放
	 * @param aniUrl 动画资源地址
	 */
	public play(
		interval: number = this.interval,
		loop: number = this.loop,
		aniUrl: string = this.aniUrl
	): void {
		this.aniUrl = aniUrl;
		if (interval > 0) {
			this.interval = interval * 1000;
		}

		if (loop === 0) {
			App.DebugUtils.error(`${aniUrl} 错误的播放次数0!`);
			return;
		}

		this.loop = loop;
		if (loop !== -1) {
			this._playCount = loop;
		} else {
			this._playCount = null!;
		}

		const aniRes = App.ResManager.getRes(aniUrl);
		if (aniRes) {
			this.completePlay();
		} else {
			App.LoadManager.load(
				{
					url: aniUrl,
					type: Loader.ATLAS
				},
				() => {
					if (aniUrl === this.aniUrl) {
						this.completePlay();
					}
				},
				null!,
				null!,
				this
			);
		}
	}

	/**
	 * 从父级中移除
	 */
	public removeFromParent(): void {
		if (this._animation) {
			this._animation.stop();
		}
		if (this.$obj) {
			this.$obj.removeFromParent();
			this.$obj.displayObject.removeSelf();
		}
	}

	/**
	 * 移除并销毁
	 */
	public removeAndDestroy(): void {
		if (this._animation) {
			this._animation.clear();
		}
		if (this.$obj) {
			this.$obj.dispose();
		}
	}

	/**
	 * 设置点击区域
	 * @param width
	 * @param height
	 */
	public setClickArea(width: number, height: number): void {
		if (this.$obj) {
			this.$obj.setSize(width, height, true);
		}
	}

	/**
	 * 点击监听事件
	 * @param callback
	 * @param target
	 * @returns
	 */
	public onClick(callback: Function, target: any): void {
		if (this.$obj) {
			this.$obj.onClick(callback, target);
		}
	}

	/**
	 * 取消点击监听事件
	 * @param callback
	 * @param target
	 * @returns
	 */
	public offClick(callback: Function, target: any): void {
		if (this.$obj) {
			this.$obj.offClick(callback, target);
		}
	}

	/**
	 * 暂停动画播放
	 */
	public pause(): void {
		this._animation.stop();
	}

	/**
	 * 恢复动画播放，再之前位置继续播放
	 */
	public resume(): void {
		const index = this._animation.index;
		this._animation.play(index);
	}

	/**
	 * 设置播放速率
	 * @param rate
	 */
	public setPlayRate(rate: number): void {
		if (this._playRate !== rate) {
			this._playRate = rate;
			const inv = this.interval / rate;
			this._animation.interval = inv;
		}
	}

	/**
	 * 清理回收
	 */
	public clear(): void {
		this.removeFromParent();
		if (this._animation) {
			this._animation.offAll();
			this._animation.clear();
		}
		if (this.$obj) {
			this.$obj.rotation = 0;
			this.$obj.setScale(1, 1);
		}
		this.setVisible(true);
		this.setAlpha(1);
		this._pivotX = this._pivotY = 0.5;
		this._aWidth = null!;
		this._aHeight = null!;
		this.aniUrl = '';
		this._cacheUrl = '';
		this._playRate = 1;
	}

	private onComplete(): void {
		if (this._animation.destroyed) {
			return;
		}

		if (this._playCount !== null) {
			--this._playCount;
			if (this._playCount <= 0) {
				this._playCount = null!;
				this._animation.stop();
				this._animation.event(FrameAnimationEvent.END);
			}
		}
	}

	private completePlay(): void {
		if (this._animation.destroyed) {
			return;
		}

		this._animation.interval = this.interval;

		if (Animation.framesMap[this._cacheUrl]) {
			this._animation.loadAtlas(this.aniUrl, null, this._cacheUrl);
			this.initAnimation();
		} else {
			this._animation.loadAtlas(
				this.aniUrl,
				Handler.create(
					this,
					() => {
						this.initAnimation();
					},
					null,
					false
				),
				this._cacheUrl
			);
		}

		this._animation.play(0, true);
		this._animation.off(Event.COMPLETE, this, this.onComplete);
		this._animation.on(Event.COMPLETE, this, this.onComplete);
	}

	private initAnimation(): void {
		const atlasRes = Loader.getRes(this.aniUrl);
		if (atlasRes) {
			const frames = atlasRes.frames;
			for (const key in frames) {
				const frame = frames[key];
				const bounds = frame.sourceSize;
				this._aWidth = bounds.w;
				this._aHeight = bounds.h;
				this._animation.pivot(bounds.w * this._pivotX, bounds.h * this._pivotY);
				this._animation.pos(this.$obj.width / 2, this.$obj.height / 2);
				break;
			}
		}
	}
}
