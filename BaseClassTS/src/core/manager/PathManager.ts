import { Utils } from "laya/utils/Utils";
import Singleton from "../base/Singleton";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-17 11:28:13
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:36:21
 */
export default class PathManager extends Singleton {

	/**资源root地址 */
	public readonly root: string = 'res/';
	/**ui地址 */
	public readonly ui: string = 'ui/';

	/**
	 * 获取资源最终url
	 * @param url
	 * @returns
	 */
	public getImageUrl(url: string): string {
		return Utils.middlewareUseWebp(url);
	}

	/**
	 * 获取包名加载地址
	 * @param pkgName 包名
	 */
	public getPkgPath(pkgName: string): string {
		return `${this.root}${this.ui}${pkgName}`;
	}
}
