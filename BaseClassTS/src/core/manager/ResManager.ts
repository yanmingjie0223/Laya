import { loader, timer } from 'Laya';
import { Utils } from 'laya/utils/Utils';
import AppConfig from '../../config/AppConfig';
import fgui from '../../fgui/index';
import Singleton from '../base/Singleton';
import { ResFile } from '../const/CoreConst';
import DebugUtils from '../utils/DebugUtils';
import DisplayUtils from '../utils/DisplayUtils';
import LoadManager from './LoadManager';
import PathManager from './PathManager';
interface ResCacheFile {
	count: number;
	type: string;
	cacheTime: number;
	isClear: boolean;
}

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-14 19:19:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 19:00:31
 */
export default class ResManager extends Singleton {
	/**加载资源缓存 */
	private _resCache: Map<string, ResCacheFile>;
	/**资源检查间隔时间(ms) */
	private _interval: number = 5000;
	/**管理资源过滤列表 */
	private _filters: Array<string> = [
		'common',
		'preload'
	];

	public init(): void {
		this._resCache = new Map<string, ResCacheFile>();
		timer.clear(this, this.onUpdate);
		timer.loop(this._interval, this, this.onUpdate);
	}

	/**
	 * 获取资源
	 * @param path 资源地址
	 */
	public getRes(path: string): any {
		return loader.getRes(path);
	}

	/**
	 * 获取atlas资源，这里如果使用webp模式就转换
	 * @param path
	 * @returns
	 */
	public getAtlasRes(path: string): any {
		const getRes: any = loader.getRes;
		return getRes(path, true);
	}

	/**
	 * 移除资源名
	 * @param path
	 */
	public release(path: string): void {
		// 移除资源之前移除fgui包
		if (path.indexOf('ui') !== -1 && path.indexOf('bin') !== -1) {
			const pathBin = path.split('/').pop();
			const pkgName: string = pathBin.split('.')[0];
			this.removeUiPackage(pkgName);
		}
		path = Utils.middlewareUseWebp(path);
		loader.clearRes(path);
	}

	/**
	 * 释放ui包资源
	 * @param pkgName
	 */
	public releasePackage(pkgName: string): void {
		const loadManager = LoadManager.getInstance<LoadManager>();
		const resFile: Array<ResFile> = loadManager.getGroupUrls(pkgName);
		if (resFile) {
			resFile.forEach((file) => {
				this.release(file.url);
			});
		}
	}

	/**
	 * 移除sk资源
	 * @param path
	 */
	public releaseSk(path: string): void {
		const pathManager = PathManager.getInstance<PathManager>();
		const displayUtils = DisplayUtils.getInstance<DisplayUtils>();
		displayUtils.destroySpineTemplet(path);
		let pngUrl = path.replace('.skel', '.png');
		pngUrl = pathManager.getImageUrl(pngUrl);
		const atlasUrl = path.replace('.skel', '.atlas');
		this.release(path);
		this.release(pngUrl);
		this.release(atlasUrl);
	}

	/**
	 * 添加ui包体
	 * @param pkgName 包名
	 */
	public addUiPackage(pkgName: string): void {
		const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
		if (!pkg) {
			const pathManager = PathManager.getInstance<PathManager>();
			const pkgUrl: string = pathManager.getPkgPath(pkgName);
			fgui.UIPackage.addPackage(pkgUrl);
		}
	}

	/**
	 * 删除ui包体
	 * @param pkgName 包名
	 */
	public removeUiPackage(pkgName: string): void {
		const pkg: fgui.UIPackage = fgui.UIPackage.getByName(pkgName);
		if (pkg) {
			fgui.UIPackage.removePackage(pkgName);
		}
	}

	/**
	 * 添加资源过滤
	 * @param path
	 */
	public addFilter(path: string): void {
		if (this._filters.indexOf(path) !== -1) {
			this._filters.push(path);
		}
	}

	/**
	 * 卸载资源组资源
	 * @param groupName
	 */
	public releaseGroup(groupName: string): void {
		const loadManager = LoadManager.getInstance<LoadManager>();
		const resFiles: Array<ResFile> = loadManager.getGroupUrls(groupName);
		resFiles.forEach((file: ResFile) => {
			this.release(file.url);
		});
	}

	/**
	 * 添加资源组使用
	 * @param groupName 资源组名
	 * @param isTrust 是否托管
	 */
	public addGroupUse(groupName: string, isTrust: boolean): void {
		if (!isTrust) {
			return;
		}
		if (this._filters.indexOf(groupName) !== -1) {
			return;
		}
		const loadManager = LoadManager.getInstance<LoadManager>();
		const resFile: Array<ResFile> = loadManager.getGroupUrls(groupName);
		this.addUseRes(resFile);
	}

	/**
	 * 移除资源组使用
	 * @param groupName 资源组名
	 * @param isTrust 是否托管
	 */
	public removeGroupUse(groupName: string, isTrust: boolean): void {
		if (!isTrust) {
			return;
		}
		if (this._filters.indexOf(groupName) !== -1) {
			return;
		}
		const loadManager = LoadManager.getInstance<LoadManager>();
		const resFile: Array<ResFile> = loadManager.getGroupUrls(groupName);
		this.removeUseRes(resFile);
	}

	/**
	 * 添加资源引用次数
	 * @param files 资源路径，可是数组类型
	 * @param isClear 是否能清理 默认可清理资源
	 */
	public addUseRes(files: Array<ResFile>, isClear: boolean = true): void {
		let file: ResFile;
		let url: string;
		let cacheFile: ResCacheFile;
		for (let i = 0, len = files.length; i < len; i++) {
			file = files[i];
			url = file.url;

			cacheFile = this._resCache.get(url);
			if (cacheFile) {
				cacheFile.count += 1;
				cacheFile.cacheTime = 0;
				cacheFile.isClear = isClear;
			}
			else {
				cacheFile = {} as ResCacheFile;
				cacheFile.count = 1;
				cacheFile.cacheTime = 0;
				cacheFile.isClear = isClear;
				cacheFile.type = file.type;
				this._resCache.set(url, cacheFile);
			}
		}
	}

	/**
	 * 删除资源引用次数
	 * @param files 资源路径，可是数组类型
	 */
	public removeUseRes(files: Array<ResFile>): void {
		let file: ResFile;
		let cacheFile: ResCacheFile;
		for (let i = 0, len = files.length; i < len; i++) {
			file = files[i];
			cacheFile = this._resCache.get(file.url);
			if (cacheFile && cacheFile.count > 0) {
				cacheFile.count -= 1;
			}
		}
	}

	/**
	 * 销毁资源引用，彻底移除托管回收
	 * @param files
	 */
	public destroyUseRes(files: Array<ResFile>): void {
		let file: ResFile;
		for (let i = 0, len = files.length; i < len; i++) {
			file = files[i];
			const cacheFile = this._resCache.get(file.url);
			if (cacheFile) {
				this._resCache.set(file.url, null);
			}
		}
	}

	/**
	 * 每帧更新
	 */
	private onUpdate(): void {
		this._resCache.forEach((cacheFile, url) => {
			if (!cacheFile) {
				this._resCache.delete(url);
			}
			else {
				if (cacheFile.count <= 0 && cacheFile.isClear) {
					cacheFile.cacheTime += this._interval;
				}

				if (cacheFile.cacheTime >= AppConfig.resCacheTime) {
					this.onReleaseCache(url);
					this._resCache.delete(url);
					// 打印日志
					const debugUtils = DebugUtils.getInstance<DebugUtils>();
					debugUtils.warn(`release res: ${url}`);
				}
			}
		});
	}

	/**
	 * 更新回收资源
	 * @param url
	 */
	private onReleaseCache(url: string): void {
		if (url.indexOf('.skel') === -1) {
			this.release(url);
		}
		else {
			this.releaseSk(url);
		}
	}

}
