import { Event } from 'laya/events/Event';
import { HttpRequest } from 'laya/net/HttpRequest';
import { Browser } from 'laya/utils/Browser';
import Singleton from '../base/Singleton';
import DebugUtils from '../utils/DebugUtils';

export const enum ResponseType {
	TEXT = 'text',
	JSON = 'json',
	XML = 'xml',
	ARRAY_BUFFER = 'arraybuffer'
}

export const enum HttpType {
	GET = 'GET',
	POST = 'POST'
}

export interface HttpData {
	/**请求地址 */
	url: string;
	/**请求方式 默认: 'GET' */
	method?: HttpType;
	/**请求类型 默认: json */
	responseType?: ResponseType;
	/**post上传数据 默认: null|{} */
	data?: { [key: string]: any };
	/**请求头 默认: null */
	headers?: string[];
}

export default class HttpManager extends Singleton {

	private _https: Array<HttpRequest> = [];

	/**
	 * 请求数据
	 * @param httpData
	 * @param onComplete
	 * @param onError
	 * @param thisObj
	 * @returns 返回http勿随意使用，因为该http会自动回收
	 */
	public send(httpData: HttpData, onComplete: Function, onError: Function, thisObj: any): HttpRequest {
		const debug = DebugUtils.getInstance<DebugUtils>();
		debug.log(
			`%c ↑↑↑ ${httpData.url}[${httpData.method}] ↑↑↑ `,
			'padding: 2px; background-color: #1094e3; color: #dddd22; border: 2px solid #dddd22; font-family: consolas;',
			httpData.data
		);
		const http = this.obtain();
		http.on(Event.COMPLETE, this, (res: any) => {
			debug.log(
				`%c ↓↓↓ ${httpData.url}[${httpData.method}] ↓↓↓ `,
				'padding: 2px; background-color: #333; color: #22dd22; border: 2px solid #22dd22; font-family: consolas;',
				res
			);
			this.free(http);
			onComplete && onComplete.apply(thisObj, [res]);
		});
		http.on(Event.ERROR, this, () => {
			this.free(http);
			onError && onError.apply(thisObj);
		});

		const url = httpData.url;
		const data = httpData.data ? httpData.data : null;
		const method = httpData.method ? httpData.method : HttpType.GET;
		const responseType = httpData.responseType ? httpData.responseType : ResponseType.JSON;
		const headers = httpData.headers ? httpData.headers : null;
		http.send(url, data, method, responseType, headers);

		return http;
	}

	/**
	 * 获取协议请求对象
	 * @returns
	 */
	private obtain(): HttpRequest {
		let http: HttpRequest = this._https.pop();
		if (!http) {
			http = new HttpRequest();
		}

		return http;
	}

	/**
	 * 回收协议请求对象
	 * @param http
	 * @returns
	 */
	private free(http: HttpRequest): void {
		if (!http) {
			return;
		}

		http.offAll();

		if (Browser.onVVMiniGame || Browser.onHWMiniGame) {
			// 注：这些平台复用会存在xmlhttprequest的bug，所以不回收
			return;
		}

		this._https.push(http);
	}

}
