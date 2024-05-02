import { loader } from "Laya";
import { Loader } from "laya/net/Loader";
import { Handler } from "laya/utils/Handler";
import fgui from "../../fgui/index";
import Singleton from "../base/Singleton";
import { ResFile } from "../const/CoreConst";
import DebugUtils from "../utils/DebugUtils";
import PathManager from "./PathManager";
type ResJson = {
	groups: Array<{ keys: string; name: string }>;
	resources: Array<{ name: string; type: string; url: string }>;
};

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-25 14:15:27
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2020-12-07 23:32:58
 */
export default class LoadManager extends Singleton {
	/**加载资源配置 */
	private _resJson: ResJson = null!;

	public constructor() {
		super();
	}

	public init(): void {
		const resUrl: string = "res/resource.json";
		loader.getRes(resUrl);
		this._resJson = loader.getRes(resUrl);
		loader.clearRes(resUrl);
	}

	/**
	 * 加载资源组
	 * @param groupName 资源组名
	 * @param completeFun 加载成功
	 * @param errorFun 加载失败
	 * @param progressFun 加载进度
	 * @param thisObj 函数this对象
	 */
	public loadGroup(
		groupName: string,
		completeFun: Function,
		errorFun: Function,
		progressFun: Function,
		thisObj: any
	): void {
		if (!groupName) {
			return;
		}
		const resFiles: Array<ResFile> = this.getGroupUrls(groupName);
		this.loadArray(resFiles, completeFun, errorFun, progressFun, thisObj);
	}

	/**
	 * 加载资源组
	 * @param groupNames 资源组名数组
	 * @param completeFun 加载成功
	 * @param errorFun 加载失败
	 * @param progressFun 加载进度
	 * @param thisObj 函数this对象
	 */
	public loadArrayGroup(
		groupNames: Array<string>,
		completeFun: Function,
		errorFun: Function,
		progressFun: Function,
		thisObj: any
	): void {
		if (!groupNames || groupNames.length <= 0) {
			return;
		}

		const resFiles: Array<ResFile> = this.getArrayGroupUrls(groupNames);
		this.loadArray(resFiles, completeFun, errorFun, progressFun, thisObj);
	}

	/**
	 * 加载单个资源
	 * @param resFile 资源信息
	 * @param completeFun 加载完成返回
	 * @param errorFun 加载错误返回
	 * @param progressFun 加载进度返回
	 * @param thisObj 加载this对象
	 */
	public load(
		resFile: ResFile,
		completeFun: Function,
		errorFun: Function,
		progressFun: Function,
		thisObj: any
	): void {
		const completeHandler = Handler.create(this, function (asset: any) {
			completeHandler && completeHandler.clear();
			progressHandler && progressHandler.clear();
			if (asset) {
				completeFun && completeFun.call(thisObj, [asset]);
			}
			else {
				errorFun && errorFun.call(thisObj);
			}
		}, null, false);
		const progressHandler = Handler.create(this, function (progress: number) {
			progressFun && progressFun.call(thisObj, progress);
		}, null, false);
		loader.load(resFile.url, completeHandler, progressHandler);
	}

	/**
	 * 加载多个资源
	 * @param resFiles 资源地址
	 * @param completeFun 加载完成返回
	 * @param errorFun 加载错误返回
	 * @param progressFun 加载进度返回
	 * @param thisObj 加载this对象
	 */
	public loadArray(
		resFiles: Array<ResFile>,
		completeFun: Function,
		errorFun: Function,
		progressFun: Function,
		thisObj: any
	): void {
		const completeHandler = Handler.create(this, function (asset: any) {
			completeHandler && completeHandler.clear();
			progressHandler && progressHandler.clear();
			if (asset) {
				completeFun && completeFun.call(thisObj);
			}
			else {
				errorFun && errorFun.call(thisObj);
			}
		}, null, false);
		const progressHandler = Handler.create(this, function (progress: number) {
			progressFun && progressFun.call(thisObj, progress);
		}, null, false);
		loader.load(resFiles, completeHandler, progressHandler);
	}

	/**
	 * 加载包名
	 * @param pkgName 包名也是资源组名
	 * @param completeFun 加载成功
	 * @param errorFun 加载失败
	 * @param progressFun 加载进度
	 * @param thisObj 函数this对象
	 */
	public loadPackage(
		pkgName: string,
		completeFun: Function,
		errorFun: Function,
		progressFun: Function,
		thisObj: any
	): void {
		const completeHandler = Handler.create(this, function (asset: any) {
			completeHandler && completeHandler.clear();
			progressHandler && progressHandler.clear();
			if (asset) {
				completeFun && completeFun.call(thisObj, [asset]);
			}
			else {
				errorFun && errorFun.call(thisObj);
			}
		}, null, false);
		const progressHandler = Handler.create(this, function (progress: number) {
			progressFun && progressFun.call(thisObj, progress);
		}, null, false);
		const pathManager = PathManager.getInstance<PathManager>();
		const pkgUrl: string = pathManager.getPkgPath(pkgName);
		fgui.UIPackage.loadPackage(pkgUrl, completeHandler, progressHandler);
	}

	/**
	 * 加载包名
	 * @param pkgNameArr 包名也是资源组名
	 * @param completeFun 加载成功
	 * @param errorFun 加载失败
	 * @param progressFun 加载进度
	 * @param thisObj 函数this对象
	 */
	public loadArrayPackage(
		pkgNameArr: Array<string>,
		completeFun: Function,
		errorFun: Function,
		progressFun: Function,
		thisObj: any
	): void {
		const completeHandler = Handler.create(this, function (asset: any) {
			completeHandler && completeHandler.clear();
			progressHandler && progressHandler.clear();
			if (asset) {
				completeFun && completeFun.call(thisObj, [asset]);
			}
			else {
				errorFun && errorFun.call(thisObj);
			}
		}, null, false);
		const progressHandler = Handler.create(this, function (progress: number) {
			progressFun && progressFun.call(thisObj, progress);
		}, null, false);
		const pathManager = PathManager.getInstance<PathManager>();
		const pkgUrls: string[] = [];
		pkgNameArr.forEach((pkgName) => {
			pkgUrls.push(pathManager.getPkgPath(pkgName));
		});
		fgui.UIPackage.loadPackage(pkgUrls, completeHandler, progressHandler);
	}

	/**
	 * 获取多个资源组加载资源
	 * @param groupNames
	 * @returns {Array<ResFile>}
	 */
	public getArrayGroupUrls(groupNames: Array<string>): Array<ResFile> {
		const resFiles: Array<ResFile> = [];
		for (let i = 0, len = groupNames.length; i < len; i++) {
			const groupName = groupNames[i];
			const urls = this.getGroupUrls(groupName);
			resFiles.push(...urls);
		}
		return resFiles;
	}

	/**
	 * 获取资源组中所有资源url
	 * @param groupName 资源组
	 */
	public getGroupUrls(groupName: string): Array<ResFile> {
		const resFiles: Array<ResFile> = [];
		const groups: Array<{ keys: string; name: string }> = this._resJson.groups;
		const resources: Array<{ name: string; type: string; url: string }> =
			this._resJson.resources;
		let group: { keys: string; name: string } = null!;
		for (let i = 0, len = groups.length; i < len; i++) {
			if (groups[i].name === groupName) {
				group = groups[i];
				break;
			}
		}

		if (!group) {
			DebugUtils.getInstance<DebugUtils>().error(`${groupName} 不存在! 请检查bin/res/resource.json文件`);
			return resFiles;
		}

		const keys: Array<string> = group.keys.split(",");
		const keyLen: number = keys.length;
		for (let i = 0, len = resources.length; i < len; i++) {
			if (keys.indexOf(resources[i].name) !== -1) {
				resFiles.push({
					url: `res/${resources[i].url}`,
					type: this.getType(resources[i].type),
				});
				if (resFiles.length >= keyLen) {
					break;
				}
			}
		}
		return resFiles;
	}

	private getType(type: string): string {
		if (type === 'bin') {
			return Loader.BUFFER;
		}
		return type;
	}

}
