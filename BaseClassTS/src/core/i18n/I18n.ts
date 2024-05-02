import { I18Key, I18nEnConfig, I18nZhConfig } from '../../config/I18nConfig';
import { I18nType } from '../const/CoreConst';
import DebugUtils from '../utils/DebugUtils';

/*
 * @Author: yanmingjie
 * @Date: 2019-08-19 23:11:05
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-05 15:46:40
 */
export default class I18n {
	private _language: I18nType = I18nType.ZH;
	private _cofing: Record<I18Key, string> = null!;

	/**
	 * 获取对应的文本
	 * @param key 文本对应key
	 * @param values 对应的取代值 例如：[1] ${name}来了 结果是：1来了
	 */
	public getText(key: I18Key, values?: Array<string>): string {
		let value: string = this._cofing[key];
		// 替换指定值
		if (values && values.length > 0) {
			const valueLen: number = values.length;
			const reg: RegExp = new RegExp('\\${\\w+}', 'g');
			const macths: Array<string> | null = value.match(reg);
			if (macths) {
				for (let i = 0, len = macths.length; i < len; i++) {
					if (valueLen > i) {
						value = value.replace(macths[i], values[i]);
					}
				}
			}
		}
		return value;
	}

	public getConfig(): Record<I18Key, string> {
		return this._cofing;
	}

	public setConfig(): void {
		switch (this.language) {
			case I18nType.EN:
				this._cofing = I18nEnConfig;
				break;
			case I18nType.ZH:
				this._cofing = I18nZhConfig;
				break;
			default:
				const debugUtils = DebugUtils.getInstance<DebugUtils>();
				debugUtils.error(`${this.language} 无对应语言文本配置！`);
				break;
		}
	}

	public get language(): I18nType {
		return this._language;
	}

	public set language(language: I18nType) {
		this._language = language;
		this.setConfig();
	}
}
