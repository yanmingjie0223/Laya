import App from '../../core/App';
import { ViewLayerType, ViewType } from '../../core/const/CoreConst';
import BaseView from '../../core/mvc/BaseView';
import fgui from '../../fgui/index';

export default class BagView extends BaseView {
	public static readonly key: string = 'BagView';

	private _closeBtn: fgui.GButton = null;
	private _tf: fgui.GRichTextField = null;

	public constructor() {
		super(['bag'], 'BagView', ViewType.X_WINDOW, ViewLayerType.WINDOW_LAYER);
	}

	public destroy() {
		if (this.isInit) {
			this.removeEvent();
		}
		super.destroy();
	}

	protected onInit(): void {
		this.initEvent();
	}

	protected onShown(): void {
		App.EffectUtils.startTyperEffect(
			this._tf,
			'[color=#009900]你好[/color]嗯嗯嗯嗯',
			300,
			this,
			() => {
				console.log('==========> 打字机完成！');
			}
		);
	}

	protected onUpdate(dt: number): void {}

	protected onClickMatte(): void {
		this.onClickBtn();
	}

	private onClickBtn(): void {
		App.ViewManager.close(BagView);
	}

	private initEvent(): void {
		this._closeBtn.onClick(this.onClickBtn, this);
	}

	private removeEvent(): void {
		this._closeBtn.offClick(this.onClickBtn, this);
	}
}
