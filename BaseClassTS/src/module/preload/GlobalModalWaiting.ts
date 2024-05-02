import { timer } from 'Laya';
import App from '../../core/App';
import BComponent from '../../core/base/BComponent';
import fgui from '../../fgui/index';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-22 21:31:34
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 21:52:51
 */
export default class GlobalModalWaiting extends BComponent {
	private _bar: fgui.GImage = null;
	private _barBg: fgui.GImage = null;

	public dispose(): void {
		timer.clear(this, this.update);
		timer.clear(this, this._show);
		super.dispose();
	}

	/**
	 * 显示旋转
	 * @param isInstant 立即
	 */
	public show(isInstant: boolean = false): void {
		if (isInstant) {
			this._show();
		} else {
			this.hide();
			timer.clear(this, this._show);
			timer.once(800, this, this._show);
		}
	}

	public hide(): void {
		timer.clear(this, this.update);
		timer.clear(this, this._show);
		this._bar.visible = false;
	}

	protected onConstruct(): void {
		App.DisplayUtils.bindGObject(this, this);
		this.hide();
	}

	private _show(): void {
		this._bar.visible = true;
		timer.clear(this, this.update);
		timer.loop(16, this, this.update);
	}

	private update(): void {
		let rotation: number = this._bar.rotation;
		rotation += 10;
		if (rotation > 360) {
			rotation = rotation % 360;
		}
		this._bar.rotation = rotation;
	}
}
