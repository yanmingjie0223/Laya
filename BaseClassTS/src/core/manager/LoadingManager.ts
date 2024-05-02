import { Laya } from 'Laya';
import { Pool } from 'laya/utils/Pool';
import fgui from '../../fgui/index';
import GlobalModalWaiting from '../../module/preload/GlobalModalWaiting';
import Singleton from '../base/Singleton';
import { ViewLayerType } from '../const/CoreConst';
import LayerManager from './LayerManager';
import StageManager from './StageManager';

/**
 * loading旋转界面缓存池
 */
export function getLoading(): GlobalModalWaiting {
	const sign = 'reload/GlobalModalWaiting';
	let loading = Pool.getItem(sign);
	if (!loading) {
		loading = fgui.UIPackage.createObject(
			'preload',
			'GlobalModalWaiting'
		) as GlobalModalWaiting;
	}
	return loading;
}

/**
 * 回收loading ui
 * @param com
 */
export function freeLoading(com: GlobalModalWaiting) {
	const sign = 'reload/GlobalModalWaiting';
	com.hide();
	Pool.recover(sign, com);
}

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2021-08-01 14:26:22
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-02 13:55:11
 */
export class LoadingManager extends Singleton {
	/**loading等待 */
	private _waiting: GlobalModalWaiting = null!;
	private _count: number = 0;

	public init(): void {
		this._waiting = getLoading();
		const stage = StageManager.getInstance<StageManager>();
		this._waiting.setSize(stage.actionWidth, stage.actionHeight);
	}

	/**
	 * 加载loading控制，主要用来请求等待数据回应
	 * @param isInstant 是否立即
	 */
	public show(isInstant: boolean = false): void {
		++this._count;
		if (!this._waiting.parent) {
			const layreManager = LayerManager.getInstance<LayerManager>();
			const layer = layreManager.getLayer(ViewLayerType.MAX_LAYER);
			layer?.addChild(this._waiting);
			this._waiting.show(isInstant);
		}

		Laya.timer.clear(this, this.closeAll);
		Laya.timer.once(15000, this, this.closeAll);
	}

	/**
	 * 关闭loading控制
	 */
	public close(): void {
		if (this._count < 1) {
			return;
		}

		--this._count;
		if (this._count <= 0) {
			this._count = 0;
			this._remove();
		}
	}

	/**
	 * 强制关闭所有
	 */
	public closeAll(): void {
		this._count = 0;
		this._remove();
	}

	private _remove(): void {
		Laya.timer.clear(this, this.closeAll);
		if (this._waiting) {
			this._waiting.hide();
			this._waiting.removeFromParent();
		}
	}

}
