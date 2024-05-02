import fgui from '../../fgui/index';
import { viewClasss } from '../base/Decorator';
import Singleton from '../base/Singleton';
import { ViewEvent, ViewLayerType, ViewShowType, ViewType } from '../const/CoreConst';
import BaseCtrl from '../mvc/BaseCtrl';
import BaseModel from '../mvc/BaseModel';
import BaseView from '../mvc/BaseView';
import { BaseViewData } from '../mvc/BaseViewData';
import DebugUtils from '../utils/DebugUtils';
import EventManager from './EventManager';
import LayerManager from './LayerManager';
import ModelManager from './ModelManager';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 10:54:16
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2022-05-12 18:28:01
 */
export default class ViewManager extends Singleton {
	/**所有正在显示view集 */
	private _views: Record<string, BaseView>;

	/**将要逐个显示view集，二维数组：[[ctrlClass, modelClass, viewClass, viewData, layer]] */
	private _willViews: any[];
	/**当前显示单个view */
	private _currView: { new(): BaseView } | null;
	/**是否暂停逐个显示view功能 */
	private _isPause: boolean;

	public constructor() {
		super();
		this._views = {};
		this._willViews = [];
		this._isPause = null!;
		this._currView = null;
		const eventMgr = EventManager.getInstance<EventManager>();
		eventMgr.addEventListener(ViewEvent.VIEW_LOAD, this, this.onViewLoad);
	}

	/**
	 * 显示view
	 * @param ctrlClass view控制类 new () => BaseCtrl or typeof BaseCtrl
	 * @param modelClass model类，该数据源是单例
	 * @param viewClass view类
	 * @param viewData view类数据
	 * @param showType 显示类型，显示在单还是多窗体
	 * @param layer 显示在那一层中，默认使用view本身层中，一般不使用
	 * @param packages 额外自定义添加依赖包
	 */
	public show(
		viewClass: { new(...packages: any[]): BaseView },
		modelClass: { new(): BaseModel } | null = null,
		ctrlClass: { new(): BaseCtrl } | null = null,
		viewData: BaseViewData | null = null,
		showType: ViewShowType = ViewShowType.MULTI_VIEW,
		layer: ViewLayerType | null = null,
		packages: string[] = []
	): BaseView | null {
		const key: string = (viewClass as any).key;
		const debugUtils = DebugUtils.getInstance<DebugUtils>();
		if (!key) {
			debugUtils.error(`该${viewClass.name}未存在static key 请在检查一下遗漏!`);
		}
		// 单个窗体显示
		if (showType === ViewShowType.SINGLETON_VIEW) {
			this._willViews.push([ctrlClass, modelClass, viewClass, viewData, layer]);
			return this.nextShow();
		}
		// 多个窗体显示
		let view: BaseView = this._views[key];
		if (view && !view.isDestroy) {
			if (view.viewData && view.viewData !== viewData) {
				view.viewData.destroy();
			}
			view.viewData = viewData;
		} else {
			const ctrl: BaseCtrl | null = ctrlClass ? new ctrlClass() : null;
			let model: BaseModel | null = null;
			if (modelClass) {
				const modelManager = ModelManager.getInstance<ModelManager>();
				model = modelManager.getModel(modelClass);
				if (!model) {
					model = modelManager.register(modelClass);
				}
			}
			view = new viewClass(packages);
			view.viewData = viewData;
			view.ctrl = ctrl;
			view.model = model;
			this._views[key] = view;
		}

		if (layer) {
			view.layer = layer;
		}
		if (!view.layer) {
			debugUtils.error('该view未设置显示layer层!');
			return null;
		}

		const layerManager = LayerManager.getInstance<LayerManager>();
		const eventManager = EventManager.getInstance<EventManager>();
		const layerCom: fgui.GComponent | null = layerManager.getLayer(view.layer);
		layerCom && layerCom.addChild(view);
		view.show();
		eventManager.emitEvent(ViewEvent.VIEW_SHOW, [key]);
		return view;
	}

	/**
	 * 关闭view
	 * @param viewClass view类
	 * @param isDestroy 是否销毁，默认消耗
	 */
	public close(
		viewClass: { new(...packages: any[]): BaseView },
		isDestroy: boolean = true
	): void {
		const key: string = (viewClass as any).key;
		if (!this._views || !this._views[key]) {
			return;
		}

		const view: BaseView = this._views[key];
		view.close();

		view.removeFromParent();
		if (isDestroy) {
			delete this._views[key];
			view.destroy();
		}

		if (view.type === ViewType.X_WINDOW) {
			this.updateBgAlpha();
		}

		const eventManager = EventManager.getInstance<EventManager>();
		eventManager.emitEvent(ViewEvent.VIEW_CLOSE, [key]);
		// 继续下一个view显示
		if (this._currView === viewClass) {
			this._currView = null;
			this.nextShow();
		}
	}

	/**
	 * 切换view显示层级
	 * @param viewClass
	 * @param layer
	 * @param index
	 */
	public switchLayer(viewClass: { new(): BaseView }, layer: ViewLayerType, index?: number): void {
		const view = this.getView(viewClass);
		if (view && view.layer !== layer) {
			view.removeFromParent();
			view.layer = layer;
			const layerCom = LayerManager.getInstance<LayerManager>().getLayer(layer);
			if (index !== undefined) {
				layerCom.addChildAt(view, index);
			}
			else {
				layerCom.addChild(view);
			}
		}
	}

	/**
	 * view界面生命周期update
	 * @param dt (s)
	 */
	public onUpdate(dt?: number): void {
		const views = this._views;
		for (const key in views) {
			const view = views[key];
			if (view.displayObject && view['onUpdate']) {
				view['onUpdate'](dt);
			}
		}
	}

	/**
	 * 关闭所有界面
	 * @param isDestroy
	 */
	public closeAll(isDestroy: boolean = true): void {
		if (!this._views) {
			return;
		}

		for (const key in this._views) {
			const view: BaseView = this._views[key];
			view.removeFromParent();
			if (isDestroy) {
				delete this._views[key];
				if (!view.isDisposed) {
					view.destroy();
				}
			}
		}

		this._currView = null;
		this._isPause = false;
		this._willViews.length = 0;
	}

	/**
	 * 获取所有view
	 * @returns
	 */
	public getAllView(): Record<string, BaseView> {
		return this._views;
	}

	/**
	 * 获取view
	 * @param viewClass view类
	 */
	public getView<T extends BaseView>(viewClass: { new(): T }): T | null {
		const key: string = (viewClass as any).key;
		if (!this._views || !this._views[key]) {
			return null;
		}
		return this._views[key] as T;
	}

	/**
	 * 通过key获取view
	 * @param key view类key
	 */
	public getViewByKey<T extends BaseView>(key: string): T | null {
		if (!this._views || !this._views[key]) {
			return null;
		}
		return this._views[key] as T;
	}

	/**
	 * 获取view class
	 * @param key
	 * @returns
	 */
	public getViewClass(key: string): { new(): BaseView } | null {
		const vClass = viewClasss.get(key);
		if (vClass) {
			return vClass;
		}
		const debugUtils = DebugUtils.getInstance<DebugUtils>();
		debugUtils.error(`${key} 未使用ViewRegister装饰器注册!`);
		return null;
	}

	/**
	 * 是否存在该view
	 * @param viewClass view类
	 */
	public isExist(viewClass: { new(): BaseView }): boolean {
		const key: string = (viewClass as any).key;
		if (this._views && this._views[key]) {
			return true;
		}
		return false;
	}

	/**
	 * 是否存在单体view
	 */
	public isExistWillView(): boolean {
		if (this._currView || (this._willViews && this._willViews.length > 0)) {
			return true;
		}
		return false;
	}

	/**
	 * 暂停逐个弹窗显示
	 */
	public set isPause(_isPause: boolean) {
		this._isPause = _isPause;
		if (!_isPause) {
			this.nextShow();
		}
	}

	/**
	 * 暂停逐个弹窗显示
	 */
	public get isPause(): boolean {
		return this._isPause;
	}

	/**
	 * 显示下个view
	 */
	private nextShow(): BaseView | null {
		if (this._currView || this._isPause) {
			return null;
		}
		if (this._willViews.length === 0) {
			const eventManager = EventManager.getInstance<EventManager>();
			eventManager.emitEvent(ViewEvent.WINDOW_CLOSE);
			return null;
		}

		const willArr: any[] = this._willViews.shift();
		const ctrlClass: { new(): BaseCtrl } = willArr[0];
		const modelClass: { new(): BaseModel } = willArr[1];
		const viewClass: { new(): BaseView } = willArr[2];
		const viewData: BaseViewData = willArr[3];
		const layer: ViewLayerType = willArr[4];
		this._currView = viewClass;
		const view: BaseView | null = this.show(
			viewClass,
			modelClass,
			ctrlClass,
			viewData,
			ViewShowType.MULTI_VIEW,
			layer
		);
		return view;
	}

	/**
	 * 监听界面加载成功等待界面动效
	 * @param key
	 */
	private onViewLoad(key: string): void {
		const view = this.getViewByKey(key);
		if (view && view.type === ViewType.X_WINDOW) {
			this.updateBgAlpha();
		}
	}

	/**
	 * 更新背景蒙层
	 * @returns
	 */
	private updateBgAlpha(): void {
		const viewWindows = [];
		for (const key in this._views) {
			const view = this._views[key];
			if (view.type === ViewType.X_WINDOW) {
				viewWindows.push(view);
			}
		}
		if (viewWindows.length < 1) {
			return;
		}

		viewWindows.sort((a, b) => {
			const aIndex = a.getLayerIndex();
			const bIndex = b.getLayerIndex();
			return aIndex - bIndex;
		});
		const len = viewWindows.length;
		for (let i = 0; i < len; i++) {
			const view = viewWindows[i];
			const loader = view.getBgLoader();
			if (loader) {
				if (i < len - 1) {
					loader.alpha = 0;
				}
				else {
					loader.alpha = view.getBgAlpha();
				}
			}
		}
	}

}
