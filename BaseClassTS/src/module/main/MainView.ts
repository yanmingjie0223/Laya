import { Laya } from 'Laya';
import App from '../../core/App';
import { ViewEvent, ViewLayerType, ViewShowType, ViewType } from '../../core/const/CoreConst';
import BaseView from '../../core/mvc/BaseView';
import { Shader2DType } from '../../core/shader/Const';
import { ShaderUtils } from '../../core/shader/ShaderUtils';
import fgui from '../../fgui/index';
import BagCtrl from '../bag/BagCtrl';
import BagView from '../bag/BagView';
import { DissolveValue2D } from '../../core/shader/value2d/DissolveValue2D';
import { SpecularGlossValue2D } from '../../core/shader/value2d/SpecularGlossValue2D';

export default class MainView extends BaseView {
	public static readonly key: string = 'MainView';

	private _bagBtn: fgui.GButton = null;

	private _dtTotal: number = 0;

	public constructor() {
		super(['main', 'bag'], 'MainView', ViewType.VIEW, ViewLayerType.MIDDLE_LAYER);
	}

	public destroy() {
		if (this.isInit) {
			this.removeEvent();
		}
		super.destroy();
	}

	protected onUpdate(dt: number): void {
		this._dtTotal += dt * 80;
		if (this._dtTotal > 80) {
			this._dtTotal = 0;
		}
		ShaderUtils.updateSpecularGloss(this._dtTotal, this._bagBtn);
	}

	protected onShown(): void {
		ShaderUtils.addGObjectShader(1, this._bagBtn, Shader2DType.SPECULAR_GLOSS);
		const value2ds = ShaderUtils.getGObjectValue2D(this._bagBtn) as SpecularGlossValue2D[];
		value2ds.forEach((v2d) => {
			v2d.sgWidth = 0.08;
			v2d.sgStrength = 3;
		});
		// 溶解shader
		// ShaderUtils.addGObjectShader(1, this._bagBtn, Shader2DType.DISSOLVE);
		// const value2ds = ShaderUtils.getGObjectValue2D(this._bagBtn) as DissolveValue2D[];
		// value2ds.forEach((v2d) => {
		// 	v2d.dissolveRate = 0.4;
		// });
	}

	protected onInit(): void {
		this.initEvent();
		App.EventManager.addEventListener(ViewEvent.VIEW_SHOW, this, () => {
			console.log(`监听事件收到： view_show`);
		});
	}

	private onClickBtn(): void {
		App.ViewManager.show(BagView, null, BagCtrl, null, ViewShowType.SINGLETON_VIEW);
		// App.ViewManager.show(BagView, null, null, null, ViewShowType.SINGLETON_VIEW);
	}

	private initEvent(): void {
		this._bagBtn.onClick(this.onClickBtn, this);
		this.addEventListener(ViewEvent.VIEW_SHOW, this, (key: string) => {
			console.log(`show: ${key}`);
		});
	}

	private removeEvent(): void {
		this._bagBtn.offClick(this.onClickBtn, this);
	}
}
