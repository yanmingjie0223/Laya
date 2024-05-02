import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 17:04:38
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:48:19
 */
export default class StringUtils extends Singleton {

	/**
	 * 获取对应字段的信息
	 * @param key 字段
	 */
	public getQueryString(key: string) {
		const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		const url = decodeURI(window.location.search);
		var match = url.substr(1).match(reg);
		if (match !== null) {
			return unescape(match[2]);
		}
		return null;
	}

	/**
	 * 去掉前后空格
	 * @param {string} str
	 * @returns {string}
	 */
	public trimSpace(str: string): string {
		return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
	}

	/**
	 * 将数字转换显示文案，过万用k来计量（用于物品等）
	 * @param count
	 * @returns
	 */
	public numberToString(count: number): string {
		let str: string;
		if (count >= 10000000 * 1000) {
			str = `${Math.floor(count / (1000000 * 1000))}KM`;
		}
		else if (count >= 10000000) {
			str = `${Math.floor(count / 1000000)}M`;
		}
		else if (count >= 10000) {
			str = `${Math.floor(count / 1000)}K`;
		}
		else {
			str = count + '';
		}
		return str;
	}

	/**
	 * 百万及百万以上大数值转换K显示 例如：战斗数值显示
	 * @param count
	 * @returns
	 */
	public numberToStringForDamage(count: number): string {
		let str: string;
		if (count >= 1000000) {
			str = `${Math.floor(count / 1000)}K`;
		}
		else {
			str = `${count}`;
		}
		return str;
	}

	/**
	 * 将数字转换显示文案，过十万用k来计量（用于战力）
	 * @param count
	 * @returns
	 */
	public numberToStringForCe(count: number): string {
		let str: string;
		if (count >= 100000000 * 1000) {
			str = `${Math.floor(count / (1000000 * 1000))}KM`;
		}
		else if (count >= 100000000) {
			str = `${Math.floor(count / 1000000)}M`;
		}
		else if (count >= 100000) {
			str = `${Math.floor(count / 1000)}K`;
		}
		else {
			str = count + '';
		}
		return str;
	}

	/**
	 * 获取字符串长度，中文为2
	 * @param {string} str
	 * @returns {number}
	 */
	public getLength(str: string): number {
		const strArr: Array<string> = str.split("");
		let length: number = 0;
		let indexStr: string;
		for (let i: number = 0, len: number = strArr.length; i < len; i++) {
			indexStr = strArr[i];
			if (this.isChinese(indexStr)) {
				length += 2;
			}
			else {
				length += 1;
			}
		}
		return length;
	}

	/**
	 * 判断一个字符串是否包含中文
	 * @param {string} str
	 * @returns {boolean}
	 */
	public isChinese(str: string): boolean {
		const reg: RegExp = /^.*[\u4E00-\u9FA5]+.*$/;
		return reg.test(str);
	}

	/**
	 * 将字符串（emoji表情）转换成16进制，Unicode编码存储是4个字节，两个2个字节组合
	 * 和code16ToString成对使用
	 *
	 * @param {string} str
	 */
	public stringToCode16(str: string): string {
		const len: number = str.length;
		let codes: string = '';
		let code: string;
		for (let i = 0; i < len; i++) {
			code = str.charCodeAt(i).toString(16);
			codes += ';' + code;
		}
		return codes;
	}

	/**
	 * 字节码，转换成unicode显示
	 * 和stringToCode16成对使用
	 *
	 * @param {string} str
	 */
	public code16ToString(str: string): string {
		let uCodeStr: string = '';
		const strArr: Array<string> = str.split(';');

		let fillNum: number;
		let code: string;
		for (let i = 0, len = strArr.length; i < len; i++) {
			code = strArr[i];
			// ASCII补充高位
			fillNum = 0;
			if (code.length < 4) {
				fillNum = 4 - code.length;
			}
			for (let k = 0; k < fillNum; k++) {
				code = '0' + code;
			}
			uCodeStr += '\\u' + code;
		}
		return uCodeStr;
	}

	/**
	 * 指定截取字符长度，返回截取后的显示字符
	 *
	 * @param {string} str
	 * @param {number} cutNum
	 * @returns {string}
	 */
	public cutOutStr(str: string, cutNum: number): string {
		const reg: RegExp = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
		let len: number = 0;
		let index: number = 0;

		let code: string;
		let oldLen: number;
		let oldIndex: number;
		for (let i = 0; i < str.length; i++) {
			code = str.charCodeAt(i).toString(16);
			oldLen = len;
			oldIndex = index;
			// 计算长度和当前字符串下标，2个长度是ASCII字符
			if (code.length > 2) {
				len += 2;
			}
			else {
				len += 1;
			}
			++index;

			// 判断emoji表情，一个emoji表现显示空间当做2个（实际是4个字符）
			if (reg.test(str.substr(i, 2))) {
				++i;
				++index;
			}

			// 和截取长度判断
			if (len > cutNum) {
				index = oldIndex;
				len = oldLen;
				break;
			}
			else if (len === cutNum) {
				break;
			}
		}

		let retStr: string = str.substr(0, index);
		if (index < str.length) {
			retStr = retStr + '...';
		}

		return retStr;
	}

	/**
	 * This function is used to create unique IDs for trees and nodes.
	 *
	 * (consult http://www.ietf.org/rfc/rfc4122.txt).
	 *
	 * @class createUUID
	 * @constructor
	 * @return {String} A unique ID.
	 **/
	public createUUID(): string {
		const s = [];
		const hexDigits = '0123456789abcdef';
		for (let i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		// bits 12-15 of the time_hi_and_version field to 0010
		s[14] = '4';

		// bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[19] = hexDigits.substr((<any>s[19] & 0x3) | 0x8, 1);

		s[8] = s[13] = s[18] = s[23] = '-';

		const uuid = s.join('');
		return uuid;
	}

}
