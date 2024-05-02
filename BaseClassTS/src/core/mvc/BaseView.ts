import { Ease } from 'laya/utils/Ease';
import { Handler } from 'laya/utils/Handler';
import { Tween } from 'laya/utils/Tween';
import AppConfig from '../../config/AppConfig';
import fgui from '../../fgui/index';
import GlobalModalWaiting from '../../module/preload/GlobalModalWaiting';
import BComponent from '../base/BComponent';
import { AreaType, ViewEvent, ViewLayerType, ViewStatus, ViewType } from '../const/CoreConst';
import EventManager from '../manager/EventManager';
import LayerManager from '../manager/LayerManager';
import { freeLoading, getLoading } from '../manager/LoadingManager';
import LoadManager from '../manager/LoadManager';
import ResManager from '../manager/ResManager';
import StageManager from '../manager/StageManager';
import DebugUtils from '../utils/DebugUtils';
import DisplayUtils from '../utils/DisplayUtils';
import BaseCtrl from './BaseCtrl';
import BaseModel from './BaseModel';
import { BaseViewData } from './BaseViewData';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:02:44
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2022-05-13 13:40:50
 */
export default class BaseView extends BComponent {
	/**viewType类型 */
	private _type: ViewType;
	/**适配类型 */
	private _areaType: AreaType;
	/**界面展开动画类型 */
	private _aniType: string;
	/**view所属层级 */
	private _layer: ViewLayerType;
	/**包名 */
	private _pkgName: string;
	/**所有包，也就是所有依赖包资源 */
	private _pkgNames: Array<string>;
	/**单个界面资源 */
	private _resName: string;

	/**模块数据源 */
	private _model: BaseModel | null;
	/**界面控制 */
	private _ctrl: BaseCtrl | null;
	/**view透传数据 */
	private _viewData: BaseViewData | null;

	/**是否初始化 */
	private _isInit: boolean;
	/**是否消耗 */
	private _isDestroy: boolean;
	/**是否托管资源 */
	private _isTrust: boolean;
	/**资源是否托管中 */
	private _isTrusting: boolean;
	/**是否开启show animation */
	private _isAnimation: boolean;
	/**展开状态 */
	private _showStatus: ViewStatus;
	/**是否立即出现loading转圈 */
	private _isInstantW: boolean;

	/**背景填充层，设置背景层铺平 */
	private _bottomFullComUrl: string | null;
	/**背景层 */
	private _bottomFullCom: fgui.GObject | null;
	/**蒙层背景组件 */
	private _bbgLoader: fgui.GLoader | null;
	/**背景蒙层透明度 */
	private _bbgAlpha: number;
	/**主体组件 */
	private _contentPane: fgui.GComponent | null;
	/**主体效果 */
	private _btween: Tween;
	/**旋转加载屏蔽组件 */
	private _modalWaitPane: GlobalModalWaiting | null;
	/**记录view的一些初始化信息 */
	private _viewOldPro: {
		pivotX: number;
		pivotY: number;
		pivotAsAnchor: boolean;
	};

	/**
	 * 构造函数
	 * @param pkgNames 包名第一个为该界面的包，后面为依赖包
	 * @param resName 界面view文件名
	 * @param type 界面类型，ViewType
	 * @param layer 界面显示在哪层中
	 */
	public constructor(
		pkgNames: Array<string>,
		resName: string,
		type: ViewType,
		layer: ViewLayerType
	) {
		super();
		this._pkgName = pkgNames[0];
		this._pkgNames = pkgNames;
		this._resName = resName;
		this._type = type;
		this._layer = layer;

		this._bbgAlpha = 0.8;
		this._isTrust = true;
		this._isInit = false;
		this._isDestroy = false;
		this._isAnimation = true;
		this._isInstantW = false;
		this._ctrl = null;
		this._model = null;
		this._viewData = null;
		this._bbgLoader = null;
		this._contentPane = null;
		this._modalWaitPane = null;
		this._aniType = '';
		this._isTrusting = null!;
		this._btween = null!;
		this._bottomFullComUrl = null!;
		this._bottomFullCom = null!;
		this._viewOldPro = {} as any;
		this._showStatus = ViewStatus.CLOSE;
		if (type === ViewType.VIEW) {
			this._areaType = AreaType.SAFE;
		} else {
			this._areaType = AreaType.FULL;
		}
	}

	/**
	 * view透传数据
	 */
	public set viewData(_viewData: BaseViewData | null) {
		this._viewData = _viewData;
	}
	public get viewData(): BaseViewData | null {
		return this._viewData;
	}
	public getViewData<T extends BaseViewData>(): T {
		return this._viewData as T;
	}

	/**
	 * model数据
	 */
	public set model(_model: BaseModel | null) {
		this._model = _model;
		this._ctrl && (this._ctrl.model = _model);
	}
	public get model(): BaseModel | null {
		return this._model;
	}
	public getModel<T extends BaseModel>(): T {
		return this._model as T;
	}

	/**
	 * ctrl控制
	 */
	public set ctrl(_ctrl: BaseCtrl | null) {
		this._ctrl = _ctrl;
		this._ctrl && (this._ctrl.view = this);
	}
	public get ctrl(): BaseCtrl | null {
		return this._ctrl;
	}
	public getCtrl<T extends BaseCtrl>(): T {
		return this._ctrl as T;
	}

	/**
	 * 层级控制
	 */
	public set layer(_layer: ViewLayerType) {
		this._layer = _layer;
	}
	public get layer(): ViewLayerType {
		return this._layer;
	}

	/**
	 * ui主体部分（set get）
	 */
	public set contentPane(_contentPane: fgui.GComponent | null) {
		if (!_contentPane) {
			return;
		}
		this._contentPane = _contentPane;
		this._viewOldPro.pivotAsAnchor = _contentPane.pivotAsAnchor;
		this._viewOldPro.pivotX = _contentPane.pivotX;
		this._viewOldPro.pivotY = _contentPane.pivotY;
		this.addChild(this._contentPane);
	}
	public get contentPane(): fgui.GComponent | null {
		return this._contentPane;
	}

	/**
	 * 适配类型
	 */
	public set areaType(_areaType: AreaType) {
		this._areaType = _areaType;
	}
	public get areaType(): AreaType {
		return this._areaType;
	}

	/**
	 * 界面展开动画类型获取
	 */
	public get aniType(): string {
		return this._aniType;
	}

	/**
	 * view界面类型
	 */
	public get type(): ViewType {
		return this._type;
	}

	/**
	 * 蒙层背景透明度
	 */
	public getBgAlpha(): number {
		return this._bbgAlpha;
	}

	/**
	 * 设置背景蒙层透明度
	 * @param value
	 */
	public setBgAlpha(value: number): void {
		this._bbgAlpha = value;
	}

	/**
	 * 设置是否开启show animation
	 * @param isAni
	 */
	public setIsAnimation(isAni: boolean): void {
		this._isAnimation = isAni;
	}

	/**
	 * 获取是否开启show animation
	 * @returns
	 */
	public getIsAnimation(): boolean {
		return this._isAnimation;
	}

	/**
	 * 获取背景蒙层
	 * @returns
	 */
	public getBgLoader(): fgui.GLoader | null {
		return this._bbgLoader;
	}

	/**
	 * 判定该view是否显示在舞台里
	 */
	public getShowInStage(): boolean {
		if (
			this._showStatus !== ViewStatus.CLOSE &&
			this.visible === true
		) {
			return true;
		}
		return false;
	}

	/**
	 * 移除背景蒙层
	 */
	public removeBgLoader(): void {
		if (this._bbgLoader) {
			this._bbgLoader.dispose();
			this._bbgLoader = null!;
		}
	}

	/**
	 * 获取view排序位置，相当于zOrder
	 * @returns
	 */
	public getLayerIndex(): number {
		const layerManager = LayerManager.getInstance<LayerManager>();
		const lIndex = layerManager.getLayerIndex(this.layer);
		if (this.displayObject) {
			const cIndex = this.displayObject.zOrder;
			return lIndex + cIndex;
		}
		else {
			return 0;
		}
	}

	/**
	 * 销毁状态
	 */
	public get isDestroy(): boolean {
		return this._isDestroy;
	}

	/**
	 * 是否初始化
	 */
	public get isInit(): boolean {
		return this._isInit;
	}

	/**
	 * 是否界面展示
	 */
	public getShowStatus(): ViewStatus {
		return this._showStatus;
	}

	/**
	 * 是否托管资源，如果界面资源不需要定时释放，可重写该方法
	 */
	public setIsTrust(isTrust: boolean) {
		this._isTrust = isTrust;
	}
	public getIsTrust(): boolean {
		return this._isTrust;
	}

	/**
	 * 设置是否立即显示Loading转圈
	 * @param isInstant
	 */
	public setIsInstantWait(isInstant: boolean): void {
		this._isInstantW = isInstant;
	}

	/**
	 * 设置背景填充层，该层平铺
	 * @param url
	 */
	public setBottomFullComUrl(url: string): void {
		this._bottomFullComUrl = url;
	}

	/**
	 * 获取背景填充层
	 * @returns
	 */
	public getBottomFullCom(): fgui.GObject {
		return this._bottomFullCom;
	}

	/**
	 * 获取动画
	 * @param name
	 */
	public getTransition(name: string): fgui.Transition {
		if (this._contentPane) {
			return this._contentPane.getTransition(name);
		}
		return null!;
	}

	/**
	 * 获取控制器
	 * @param name
	 */
	public getController(name: string): fgui.Controller {
		if (this._contentPane) {
			return this._contentPane.getController(name);
		}
		return null!;
	}

	/**
	 * 消耗，子类可继承重写添加消耗逻辑
	 */
	public destroy(): void {
		if (this._isDestroy) {
			return;
		}

		this._isDestroy = true;
		if (this._isTrusting) {
			const resMgr = ResManager.getInstance<ResManager>();
			this._pkgNames.forEach((pkgName: string) => {
				resMgr.removeGroupUse(pkgName, this.getIsTrust());
			});
			this._isTrusting = false;
		}
		this._ctrl && this._ctrl.destroy();
		this._viewData && this._viewData.destroy();
		if (this._btween) {
			this._btween.clear();
			this._btween = null!;
		}
		this._pkgName = null!;
		this._resName = null!;
		this._ctrl = null;
		this._model = null;
		this._showStatus = ViewStatus.CLOSE;
		this.removeBgLoader();
		if (this._modalWaitPane) {
			this._modalWaitPane.dispose();
			this._modalWaitPane = null;
		}
		if (this._contentPane) {
			this._contentPane.dispose();
			this._contentPane = null;
		}
		this.dispose();
	}

	/**
	 * 显示加载旋转提示
	 */
	public showModalWait(): void {
		if (fgui.UIConfig.windowModalWaiting) {
			let modalWaitPane = this._modalWaitPane;
			if (!modalWaitPane) {
				modalWaitPane = getLoading();
				const stageManager = StageManager.getInstance<StageManager>();
				modalWaitPane.setSize(stageManager.actionWidth, stageManager.actionHeight);
				this._modalWaitPane = modalWaitPane;
				modalWaitPane.show(this._isInstantW);
			}
			this.addChild(modalWaitPane);
		}
	}

	/**
	 * 关闭加载旋转提示
	 */
	public closeModalWait(): void {
		if (this._modalWaitPane) {
			this._modalWaitPane.removeFromParent();
			freeLoading(this._modalWaitPane);
			this._modalWaitPane = null;
		}
	}

	/**
	 * 隐藏显示旋转提示
	 */
	public hideModalWait(): void {
		if (this._modalWaitPane) {
			this._modalWaitPane.hide();
		}
	}

	/**
	 * 界面显示接口
	 */
	public show(): void {
		this._showStatus = ViewStatus.SHOWING;
		this.initStart();
	}

	/**
	 * 关闭界面
	 */
	public close(): void {
		this._showStatus = ViewStatus.CLOSE;
		this._btween && this._btween.clear();
		if (this._isInit) {
			this.onClosen();
		}
	}

	/**
	 * 界面舞台大小变化
	 */
	public resize(): void {
		if (this._bbgLoader) {
			const stageManager = StageManager.getInstance<StageManager>();
			const actionRect = stageManager.actionRect;
			this._bbgLoader.setSize(stageManager.stageWidth, stageManager.stageHeight);
			this._bbgLoader.setXY(-actionRect.x, -actionRect.y);
		}
	}

	/**
	 * 帧刷新事件
	 * @param dt (s)
	 */
	protected onUpdate(dt?: number): void { }
	/**
	 * 初始化ui结束，初始化view信息从这里开始
	 */
	protected onInit(): void { }
	/**
	 * 完全显示界面
	 */
	protected onShown(): void { }
	/**
	 * 关闭界面
	 * 注：初始化后才会进入关闭
	 */
	protected onClosen(): void { }
	/**
	 * 加载进度
	 */
	protected onProgress(completedCount: number, totalCount: number, item: any): void { }
	/**
	 * 界面大小变化触发方法，用来个别代码添加的控件适配
	 */
	protected onResize(): void { }
	/**
	 * 背景蒙层点击方法，子类实现逻辑
	 */
	protected onClickMatte(): void { }
	/**
	 * 如果界面显示展开动画不一样可继承重写改方法
	 */
	protected onShowAnimation(): void {
		if (this._contentPane && this._isAnimation) {
			this._contentPane.displayObject.mouseEnabled = false;
			const asAncher = this._viewOldPro.pivotAsAnchor;
			this._contentPane.setPivot(0.5, 0.5, asAncher);
			this._contentPane.setScale(0, 0);
			this._btween && this._btween.clear();
			this._btween = new Tween();
			// 二段变大
			const changeHander2 = Handler.create(null, () => {
				changeHander2 && changeHander2.clear();
				if (this.isDestroy) {
					return;
				}
				this._btween && this._btween.clear();
				this._contentPane.setPivot(
					this._viewOldPro.pivotX,
					this._viewOldPro.pivotY,
					asAncher
				);
				this.onCompleteAnimation();
				if (this._contentPane) {
					this._contentPane.displayObject.mouseEnabled = true;
				}
			}, null, false);
			// 一段变大
			const changeHander = Handler.create(null, () => {
				changeHander && changeHander.clear();
				if (this.isDestroy) {
					changeHander2 && changeHander2.clear();
					return;
				}
				this._btween.to(this._contentPane, { scaleX: 1, scaleY: 1 }, 100, Ease.backOut, changeHander2, 0, true);
			}, null, false);
			this._btween.to(this._contentPane, { scaleX: 0.5, scaleY: 0.5 }, 60, Ease.quadOut, changeHander, 0, true);
		} else {
			this.onCompleteAnimation();
		}
	}
	/**
	 * 加载界面资源，可重写添加自己的加载资源
	 */
	protected onLoad(): void {
		const isExistPkg: boolean = !!fgui.UIPackage.getByName(this._pkgName);
		if (!this._isInit || !isExistPkg) {
			const loadManager = LoadManager.getInstance<LoadManager>();
			loadManager.loadArrayPackage(
				this._pkgNames,
				this.toInitUI,
				this.destroy,
				this.onProgress,
				this
			);
		} else {
			this.onCompleteUI();
		}
	}

	/**
	 * 适配策略，可重写view特定策略
	 */
	protected onPaneRelation(): void {
		const stageManager = StageManager.getInstance<StageManager>();
		const actionRect = stageManager.actionRect;
		this.setSize(actionRect.width, actionRect.height);
		this.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);

		switch (this._type) {
			case ViewType.VIEW:
				if (this._areaType === AreaType.FULL) {
					this._contentPane!.setSize(this.width, this.height);
					this._contentPane!.addRelation(this, fgui.RelationType.Size);
				} else {
					const safeRect = stageManager.safeRect;
					this._contentPane!.setSize(safeRect.width, safeRect.height);
					this._contentPane!.setXY(safeRect.x, safeRect.y);
				}
				break;
			case ViewType.WINDOW:
			case ViewType.X_WINDOW:
				this._contentPane!.x = (this.width - this._contentPane!.width) >> 1;
				this._contentPane!.y = (this.height - this._contentPane!.height) >> 1;
				this._contentPane!.addRelation(this, fgui.RelationType.Center_Center);
				this._contentPane!.addRelation(this, fgui.RelationType.Middle_Middle);
				break;
			default:
				break;
		}
	}

	/**
	 * 完成动画全部界面完全显示
	 */
	protected onCompleteAnimation(): void {
		this._showStatus = ViewStatus.SHOW;
		this.closeModalWait();
		if (this._bbgLoader) {
			this._bbgLoader.offClick(this.onClickMatte, this);
			this._bbgLoader.onClick(this.onClickMatte, this);
		}
		this.onShown();
		const key = (this.constructor as any).key;
		if (key) {
			EventManager.getInstance<EventManager>().emitEvent(ViewEvent.VIEW_SHOWN, [key]);
		}
	}

	/**
	 * 界面显示最初，先处理一些加载
	 */
	private initStart(): void {
		if (!this._pkgName || !this._resName) {
			const debugUtils = DebugUtils.getInstance<DebugUtils>();
			debugUtils.warn(`${this.constructor.name}未设置包名或资源！`);
			return;
		}

		this.showModalWait();
		if (!this._isTrusting) {
			const resMgr = ResManager.getInstance<ResManager>();
			this._pkgNames.forEach((pkgName: string) => {
				resMgr.addGroupUse(pkgName, this.getIsTrust());
			});
			this._isTrusting = true;
		}

		this.onLoad();
	}

	/**
	 * 初始化ui
	 */
	private toInitUI(): void {
		if (this.isDestroy || this._showStatus === ViewStatus.CLOSE) {
			this.closeModalWait();
			return;
		}

		this._isInit = false;
		if (this.contentPane) {
			if (!this.contentPane.isDisposed) {
				DebugUtils.getInstance<DebugUtils>().error(`fgui component: ${this._pkgName}/${this._resName} is disposed!`);
				this.contentPane.dispose();
			}
			this.contentPane = null!;
		}

		this.contentPane = fgui.UIPackage.createObject(this._pkgName, this._resName) as fgui.GComponent;
		if (!this.contentPane) {
			DebugUtils.getInstance<DebugUtils>().error(`fgui component: ${this._pkgName}/${this._resName} not found!`);
			this.destroy();
			return;
		}

		const displayUtils = DisplayUtils.getInstance<DisplayUtils>();
		displayUtils.bindGObject(this.contentPane, this);
		displayUtils.bindController(this.contentPane, this);
		displayUtils.bindTransition(this.contentPane, this);

		this.onPaneRelation();
		this.onCompleteUI();
		this._isInit = true;
	}

	/**
	 * ui初始化完成后
	 */
	private onCompleteUI(): void {
		this.hideModalWait();
		const key = (this.constructor as any).key;
		if (key) {
			EventManager.getInstance<EventManager>().emitEvent(ViewEvent.VIEW_LOAD, [key]);
		}
		if (!this._isInit) {
			this.onWindowBG();
			this.onFullBG();
			this.onInit();
		}
		this.onShowAnimation();
	}

	/**
	 * 初始化背景铺满填充层
	 */
	private onFullBG(): void {
		if (this._bottomFullComUrl) {
			const index = this._bbgLoader ? 1 : 0;
			const com = fgui.UIPackage.createObjectFromURL(this._bottomFullComUrl);
			const stageManager = StageManager.getInstance<StageManager>();
			com.setSize(stageManager.actionWidth, stageManager.actionHeight);
			com.addRelation(this, fgui.RelationType.Size);
			this.addChildAt(com, index);
			this._bottomFullCom = com;
		}
	}

	/**
	 * 显示类型ViewType背景控制
	 */
	private onWindowBG(): void {
		if (this.type === ViewType.VIEW) {
			this.removeBgLoader();
		}
		else {
			if (!this._bbgLoader) {
				const stageManager = StageManager.getInstance<StageManager>();
				this._bbgLoader = new fgui.GLoader();
				this._bbgLoader.setSize(stageManager.stageWidth, stageManager.stageHeight);
				const actionRect = stageManager.actionRect;
				this._bbgLoader.setXY(-actionRect.x, -actionRect.y);
				this._bbgLoader.touchable = true;
				if (this.type === ViewType.X_WINDOW) {
					this._bbgLoader.url = AppConfig.matteUrl;
					this._bbgLoader.fill = fgui.LoaderFillType.ScaleFree;
					this._bbgLoader.alpha = this.getBgAlpha();
					this._bbgLoader.addRelation(this, fgui.RelationType.Size);
				}
				this.addChildAt(this._bbgLoader, 0);
			}
		}
	}

}
