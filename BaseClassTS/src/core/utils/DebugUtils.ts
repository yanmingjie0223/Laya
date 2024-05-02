import { Laya } from 'Laya';
import { Stat } from 'laya/utils/Stat';
import fgui from "../../fgui/index";
import App from "../App";
import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 11:29:26
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:42:11
 */
export default class DebugUtils extends Singleton {

	/**是否开启debug模式 */
	public isDebug: boolean = false;
	/**是否开启角色范围debug模式 */
	public isRectDebug: boolean = false;

	public init(): void {
		if (this.isDebug && window) {
			window['App'] = App;
			window['fgui'] = fgui;
			window['Laya'] = Laya;
			window['Stat'] = Stat;
		}
	}

	public log(...args: Array<any>): void {
		if (this.isDebug) {
			console.log.apply(console.log, args);
		}
	}

	public warn(...args: Array<any>): void {
		if (this.isDebug) {
			console.warn.apply(console.warn, args);
		}
	}

	public error(...args: Array<any>): void {
		if (this.isDebug) {
			console.error.apply(console.error, args);
		}
	}

}
