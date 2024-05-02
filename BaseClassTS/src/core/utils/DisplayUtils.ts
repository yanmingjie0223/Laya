import { Laya } from 'Laya';
import { Event } from 'laya/events/Event';
import { SpineSkeleton } from 'laya/spine/SpineSkeleton';
import { SpineTemplet, SpineVersion } from 'laya/spine/SpineTemplet';
import { Pool } from 'laya/utils/Pool';
import fgui from '../../fgui/index';
import { FrameAnimation } from '../animation/FrameAnimation';
import App from '../App';
import Singleton from '../base/Singleton';
import { Byte } from '../types/Byte';
import { JsUtils } from './JsUtils';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2020-12-06 23:02:18
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:46:49
 */

/**
 * 确定按钮状态
 */
export enum ButtonState {
	/**条件不满足 */
	NOTENOUGH = 0,
	/**条件已满足 */
	ENOUGH = 1,
}

/**
 * 确定按钮类型
 */
export enum ButtonType {
	/**按钮类型1：左右均为尖角 */
	TYPE1 = 0,
	/**按钮类型2：四方形，四角均有小缺口 */
	TYPE2 = 1,
	/**按钮类型3：标准四方形 */
	TYPE3 = 2,
}

/**
 * spine帧打包cmd数据
 */
export interface SpineFrameCmd {
	/**vertices */
	v: number[];
	/**uvs */
	u: number[];
	/**indices */
	i: number[];
	/**alpha */
	a: number;
	/**blendMode */
	b: string;
	/**colorNum */
	cn: number;
}

export default class DisplayUtils extends Singleton {

	private _templets: Record<string, SpineTemplet> = JsUtils.createMap();
	private _templetCb: Record<string, any[]> = JsUtils.createMap();

	/**
	 * 绑定fgui对象到对象中
	 * @param gobj
	 * @param thisObj
	 */
	public bindGObject(gobj: fgui.GComponent, thisObj: any): void {
		let child: fgui.GObject;
		let childName: string;
		const childNum: number = gobj.numChildren;
		for (let i: number = 0; i < childNum; i++) {
			child = gobj.getChildAt(i);
			childName = child.name;
			if (thisObj[`_${childName}`] !== void 0) {
				thisObj[`_${childName}`] = child;
			}
		}
	}

	/**
	 * 绑定fgui对象到对象中
	 * @param gobj
	 * @param thisObj
	 */
	public bindTransition(gobj: fgui.GComponent, thisObj: any): void {
		let child: fgui.Transition;
		let childName: string;
		const childNum: number = gobj._transitions.length;
		for (let i: number = 0; i < childNum; i++) {
			child = gobj.getTransitionAt(i);
			childName = child.name;
			if (thisObj[`_${childName}`] !== void 0) {
				thisObj[`_${childName}`] = child;
			}
		}
	}

	/**
	 * 绑定fgui对象到对象中
	 * @param gobj
	 * @param thisObj
	 */
	public bindController(gobj: fgui.GComponent, thisObj: any): void {
		let child: fgui.Controller;
		let childName: string;
		const childNum: number = gobj._controllers.length;
		for (let i: number = 0; i < childNum; i++) {
			child = gobj.getControllerAt(i);
			childName = child.name;
			if (thisObj[`_${childName}`] !== void 0) {
				thisObj[`_${childName}`] = child;
			}
		}
	}

	/**
	 * 绑定红点 默认位置右上角
	 * @param gobj
	 * @param x gobj的本地坐标x
	 * @param y gobj的本地坐标y
	 * @param isHide 是否根据组件解锁状态隐藏红点
	 * @returns
	 */
	public bindRedPoint(gobj: fgui.GComponent | null, x: number = null!, y: number = null!, isHide: boolean = false): void {
		if (!gobj) {
			return;
		}

		let redPoint: fgui.GComponent = gobj.getChild('$redPoint') as fgui.GComponent;
		if (!redPoint) {
			redPoint = fgui.UIPackage.createObject('common', 'redPoint') as fgui.GComponent;
		}

		if (!redPoint.parent) {
			redPoint.name = '$redPoint';
			gobj.addChild(redPoint);
		}

		let _x: number, _y: number;
		if (x === null) {
			_x = gobj.width - redPoint.width / 2;
		}
		else {
			_x = x;
		}

		if (y === null) {
			_y = -redPoint.height / 2;
		}
		else {
			_y = y;
		}
		redPoint.setXY(_x, _y);
		if (isHide) {
			redPoint.visible = false;
		}
	}

	/**
	 * 取消绑定红点
	 * @param gobj
	 */
	public unbindRedPoint(gobj: fgui.GComponent | null): void {
		if (!gobj || !gobj.getChild) {
			return;
		}

		const redPoint = gobj.getChild('$redPoint');
		if (redPoint) {
			redPoint.dispose();
		}
	}

	/**
	 * 隐藏或显示绑定的红点
	 * @param gobj
	 * @param isShow
	 * @returns
	 */
	public visibleRedPoint(gobj: fgui.GComponent | null, isShow: boolean): void {
		if (!gobj) {
			return;
		}

		const redPoint: fgui.GComponent = gobj.getChild('$redPoint') as fgui.GComponent;
		if (!redPoint) {
			return;
		} else {
			redPoint.visible = isShow;
		}
	}

	/**
	 * 获取对应spine动画
	 * @param url
	 * @param thisObj
	 * @param complete
	 * @param aniMode 动画模式 0 普通模式 1 cache模式
	 */
	public getSpineSkeleton(
		url: string,
		thisObj: any,
		complete: (skeleton: SpineSkeleton | null) => void,
		aniMode: number = 0
	): void {
		let templet = this._templets[url];
		let cbs = this._templetCb[url];
		if (!cbs) {
			cbs = [];
			this._templetCb[url] = cbs;
		}
		// 当存在已有模板在下载时候只需要留下监听即可
		if (cbs.length !== 0 && !templet) {
			cbs.push(thisObj, complete, aniMode);
			return;
		}

		cbs.push(thisObj, complete, aniMode);

		if (!templet) {
			templet = new SpineTemplet(SpineVersion.v3_8);
			templet.loadAni(url);
			templet.once(Event.COMPLETE, this, () => {
				templet.offAll(Event.ERROR);
				this._templets[url] = templet;
				this.onCompleteSpine(url);
			});
			templet.once(Event.ERROR, this, () => {
				templet.offAll(Event.COMPLETE);
				this.onCompleteSpine(url);
			});
		}
		else {
			this.onCompleteSpine(url);
		}
	}

	/**
	 * 同步获取spine动画对象
	 * @param url
	 * @param aniMode 动画模式 0 普通模式 1 cache模式
	 */
	public getSyncSpineSkeleton(url: string, aniMode: number = 0): SpineSkeleton {
		const templet = this._templets[url];
		if (!templet) {
			App.DebugUtils.error(`${url} 动画需要先加载并创建模板才可同步获取!`);
			return null;
		}

		const skeleton = templet.buildArmature(aniMode);
		return skeleton;
	}

	/**
	 * 移除回调
	 * @param url
	 * @param thisObj
	 * @param complete
	 */
	public removeSpineCallback(
		url: string,
		thisObj: any,
		complete: (skeleton: SpineSkeleton | null) => void,
	): void {
		const cbs = this._templetCb[url];
		if (cbs) {
			for (let i = 0, len = cbs.length; i < len; i += 3) {
				const cthisObj = cbs[i];
				const ccb = cbs[i + 1];
				if (thisObj === cthisObj && ccb === complete) {
					cbs.splice(i, 3);
					break;
				}
			}

			if (cbs.length <= 0) {
				this._templetCb[url] = null!;
				delete this._templetCb[url];
			}
		}
	}

	/**
	 * 获取spine样板
	 * @param url
	 * @returns
	 */
	public getSpineTemplet(url: string): SpineTemplet | null {
		if (this._templets[url]) {
			return this._templets[url];
		}
		return null;
	}

	/**
	 * 清理templet graphics cmd缓存
	 * @param url
	 */
	public clearSpineTempletCache(url: string): void {
		const templet = this._templets[url];
		if (templet) {
			templet.clearGraphicsCache();
		}
	}

	/**
	 * 销毁spine模板，包含spine对应的资源
	 * @param url
	 */
	public destroySpineTemplet(url: string): void {
		const templet = this._templets[url];
		if (templet) {
			templet.destroy();
			// 清除缓存
			this._templets[url] = null!;
			delete this._templets[url];
		}
	}

	/**
	 * 销毁所有spine模板
	 */
	public destroySpineAllTemplet(): void {
		for (const key in this._templets) {
			this.destroySpineTemplet(key);
		}
	}

	/**
	 * 创建item扫光动画
	 * @param x
	 * @param y
	 * @returns
	 */
	public createItemFrameMv(x: number, y: number): fgui.GMovieClip {
		let frame: fgui.GMovieClip = Pool.getItem('items_frame_mv');

		if (!frame) {
			frame = fgui.UIPackage.createObject("common", "frameMV") as fgui.GMovieClip;
		}

		frame.setXY(x, y);

		return frame;
	}


	/**
	 * 创建plist 帧动画
	 * @param aniUrl
	 * @param x x坐标
	 * @param y y坐标
	 * @param parent 父节点
	 * @returns
	 */
	public createFrameFui(
		aniUrl: string,
		x: number = 0,
		y: number = 0,
		parent: fgui.GComponent | null = null,
		cacheUrl: string = '',
	): FrameAnimation {
		let frame = Pool.getItem('frame_animaiton_fgui');
		let com: fgui.GButton;

		if (!frame) {
			frame = new FrameAnimation();
			com = fgui.UIPackage.createObject('common', 'BtnNull') as fgui.GButton;
			com.displayObject.addChild(frame.displayObject);
			frame.$obj = com;
		}
		else {
			com = frame.$obj;
		}

		frame.aniUrl = aniUrl;
		frame.setCacheUrl(cacheUrl);
		com.setXY(x, y);

		if (parent) {
			parent.addChild(com);
		}

		return frame;
	}

	/**
	 * 回收帧动画对象
	 * @param frame
	 */
	public freeFrameFui(frame: FrameAnimation): void {
		// 当特效在界面中被销毁时会触发该情况
		if (!frame.$obj || !frame.$obj.displayObject) {
			return;
		}

		const sign: string = 'frame_animaiton_fgui';
		const frameArr = Pool.getPoolBySign(sign);
		if (!frameArr || frameArr.length < 50) {
			frame.clear();
			Pool.recover(sign, frame);
		}
		else {
			frame.removeAndDestroy();
		}
	}

	/**
	 * spine加载成功
	 * @param url
	 */
	private onCompleteSpine(url: string): void {
		const cbs = this._templetCb[url];
		if (cbs) {
			const templet = this._templets[url];
			for (let i = 0, len = cbs.length; i < len; i += 3) {
				const thisObj = cbs[i];
				const cb = cbs[i + 1];
				const mode = cbs[i + 2];
				if (templet) {
					const skeleton = templet.buildArmature(mode);
					cb && cb.call(thisObj, skeleton);
				}
				else {
					cb && cb.call(thisObj, null);
				}
			}
			this._templetCb[url] = null!;
			delete this._templetCb[url];
		}
	}

}
