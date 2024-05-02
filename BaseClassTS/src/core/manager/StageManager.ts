import { Laya } from 'Laya';
import { Stage } from 'laya/display/Stage';
import { Rectangle } from 'laya/maths/Rectangle';
import AppConfig from '../../config/AppConfig';
import fgui from '../../fgui/index';
import { pqPlatformSdk } from '../../platform/index';
import Singleton from '../base/Singleton';
import { AreaType } from '../const/CoreConst';
import BaseView from '../mvc/BaseView';
import ViewManager from './ViewManager';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 15:04:52
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:38:04
 */
export default class StageManager extends Singleton {
	/**舞台区域 */
	private _stageRect: Rectangle = null!;
	/**安全区域 相对于actionRect位置 */
	private _safeRect: Rectangle = null!;
	/**游戏活跃显示区域 */
	private _actionRect: Rectangle = null!;

	/**低中级界限 低级游戏一直开启slow，中级战斗开启slow，高级开启fast */
	private _slowMidlleLimit: number = 14;
	/**中高界限 */
	private _midlleHighLimit: number = 20;

	/**
	 * 场景初始化
	 */
	public init(): void {
		Laya.stage.addChild(fgui.GRoot.inst.displayObject);
		this.initFitNode();
		Laya.stage.on(Laya.Event.RESIZE, this, this.initFitNode);
		// 性能检查
		const benchLevel = pqPlatformSdk.platformMananger.system.benchmarkLevel;
		if (benchLevel > 0 && benchLevel < this._slowMidlleLimit) {
			this.setFrameRate(Stage.FRAME_SLOW);
		}
	}

	/**
	 * 显示区域
	 */
	public get actionRect(): Rectangle {
		return this._actionRect;
	}

	/**
	 * 安全区域 相对于actionRect位置
	 */
	public get safeRect(): Rectangle {
		return this._safeRect;
	}

	/**
	 * 舞台区域
	 */
	public get stageRect(): Rectangle {
		return this._stageRect;
	}

	/**
	 * 获取ui根节点
	 */
	public get GRoot(): fgui.GRoot {
		return fgui.GRoot.inst;
	}

	/**
	 * 获取舞台宽
	 */
	public get stageWidth(): number {
		return this._stageRect.width;
	}

	/**
	 * 获取舞台高
	 */
	public get stageHeight(): number {
		return this._stageRect.height;
	}

	/**
	 * 获取安全区域宽高
	 */
	public get safeWidth(): number {
		return this._safeRect.width;
	}

	/**
	 * 获取安全区域高
	 */
	public get safeHeight(): number {
		return this._safeRect.height;
	}

	/**
	 * 获取显示区域宽高
	 */
	public get actionWidth(): number {
		return this._actionRect.width;
	}

	/**
	 * 获取显示区域高
	 */
	public get actionHeight(): number {
		return this._actionRect.height;
	}

	/**
	 * 设置战斗时候游戏帧
	 */
	public setBattleFrame(isOpen: boolean): void {
		const benchLevel = pqPlatformSdk.platformMananger.system.benchmarkLevel;
		if (isOpen) {
			if (Laya.stage.frameRate !== Stage.FRAME_SLOW) {
				if (benchLevel >= this._slowMidlleLimit && benchLevel < this._midlleHighLimit) {
					this.setFrameRate(Stage.FRAME_SLOW);
				}
			}
		}
		else {
			if (Laya.stage.frameRate !== Stage.FRAME_FAST) {
				if (benchLevel >= this._slowMidlleLimit) {
					this.setFrameRate(Stage.FRAME_FAST);
				}
			}
		}
	}

	/**
	 * 设置游戏帧率
	 * @param type
	 */
	public setFrameRate(type: "fast" | "slow" | string): void {
		Laya.stage.frameRate = type;
		const platform = pqPlatformSdk.platformMananger.platform;
		if (type === Stage.FRAME_SLOW) {
			platform.setPreferredFramesPerSecond(30);
		}
		else {
			platform.setPreferredFramesPerSecond(60);
		}
	}

	/**
	 * 安全区域在舞台中的x
	 * @returns
	 */
	public getSafeInStageX(): number {
		return this._actionRect.x + this._safeRect.x;
	}

	/**
	 * 安全区域在舞台中的y
	 * @returns
	 */
	public getSafeInStageY(): number {
		return this._actionRect.y + this._safeRect.y;
	}

	/**
	 * 初始化舞台区域尺寸
	 */
	private initStageRect(): void {
		const stage = Laya.stage;
		if (!this._stageRect) {
			this._stageRect = new Rectangle();
			this._safeRect = new Rectangle();
			this._actionRect = new Rectangle();
		}
		this._stageRect.setTo(0, 0, stage.width, stage.height);
		// 正式适配代码
		const platform = pqPlatformSdk.platformMananger.platform;
		const safe = platform.getSafeArea(this.stageWidth, this.stageHeight);
		this._safeRect.setTo(safe.left, safe.top, safe.width, safe.height);
		// 显示区域判定
		let diffX: number = 0;
		let diffY: number = 0;
		let aw: number = this.stageWidth;
		let ah: number = this.stageHeight;
		if (this.stageWidth > AppConfig.initWidth) {
			aw = AppConfig.initWidth;
			diffX = (this.stageWidth - AppConfig.initWidth) >> 1;
		}
		if (this.stageHeight > AppConfig.initMaxHeight) {
			ah = AppConfig.initMaxHeight;
			diffY = (this.stageHeight - AppConfig.initMaxHeight) >> 1;
		}
		this._actionRect.setTo(diffX, diffY, aw, ah);
		// console.log('stage rect: ', this._stageRect.x, this._stageRect.y, this._stageRect.width, this._stageRect.height);
		// console.log('safe rect: ', this._safeRect.x, this._safeRect.y, this._safeRect.width, this._safeRect.height);
		// console.log('action rect: ', this._actionRect.x, this._actionRect.y, this._actionRect.width, this._actionRect.height);
		// 安全区域判定
		if (diffX > 0 || diffY > 0) {
			const leftDiff = this._safeRect.x - diffX;
			const topDiff = this._safeRect.y - diffY;
			let swidth = this._safeRect.width;
			let sheight = this._safeRect.height;
			let saw = aw;
			let sah = ah;
			let sx: number;
			let sy: number;
			if (leftDiff > 0) {
				saw -= leftDiff;
				sx = leftDiff;
			}
			else {
				swidth += leftDiff;
				sx = 0;
			}
			if (topDiff > 0) {
				sah -= topDiff;
				sy = topDiff;
			}
			else {
				sheight += topDiff;
				sy = 0;
			}
			const sw = saw > swidth ? swidth : saw;
			const sh = sah > sheight ? sheight : sah;
			this._safeRect.setTo(sx, sy, sw, sh);
			// console.log('diff safe rect: ', sx, sy, sw, sh);
			fgui.GRoot.inst.setXY(diffX, diffY);
		}
		else {
			fgui.GRoot.inst.setXY(0, 0);
		}
		fgui.GRoot.inst.setSize(aw, ah);
	}

	/**
	 * 初始化适配节点
	 * 这里用来调整显示区域，不同手机显示适配，具体ui适配需要ui中调整
	 */
	private initFitNode(): void {
		this.initStageRect();
		this.viewFit();
	}

	/**
	 * view界面适配
	 * @returns
	 */
	private viewFit(): void {
		const viewMananger = ViewManager.getInstance<ViewManager>();
		const views: { [key: string]: BaseView } = (viewMananger as any)._views;
		if (!views) {
			return;
		}

		const safeRect = this._safeRect;
		for (const key in views) {
			const view = views[key];
			const contentPane = view.contentPane;
			if (contentPane && view.areaType === AreaType.SAFE) {
				contentPane.setSize(safeRect.width, safeRect.height);
				contentPane.setXY(safeRect.x, safeRect.y);
			}
			(<any>view).resize();
		}
	}

}
