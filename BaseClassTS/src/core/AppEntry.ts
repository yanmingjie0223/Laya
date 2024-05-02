import { Laya } from 'Laya';
import { Loader } from 'laya/net/Loader';
import App from './App';
import { ResFile, ViewShowType } from './const/CoreConst';
import MainView from '../module/main/MainView';
import MainCtrl from '../module/main/MainCtrl';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-09 15:05:01
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 22:57:35
 */
export default class AppEntry {
	public start(): void {
		this.initManager();
		this.loadJson();
		Laya.updateTimer.frameLoop(1, this, this.onUpdate);
	}

	private onUpdate(): void {
		const dt = Laya.updateTimer.delta / 1000;
		App.ViewManager.onUpdate(dt);
		App.TimeManager.onUpdate(dt);
	}

	private loadJson(): void {
		const resJson: Array<ResFile> = [
			{
				url: 'res/resource.json',
				type: Loader.JSON
			}
		];
		App.LoadManager.loadArray(resJson, this.onJson, this.onJsonError, null, this);
	}

	private initManager(): void {
		App.DebugUtils.init();
		App.FguiManager.init();
		App.I18nManager.init();
		App.ResManager.init();
		App.StageManager.init();
		App.LayerManager.init();
		this.initModel();
	}

	private initModel(): void {
		const modelManager = App.ModelManager;
		// todo: 初始化model
	}

	private onJson(): void {
		App.LoadManager.init();
		App.LoadManager.loadArrayPackage(['common', 'preload'], this.onPreload, null, null, this);
	}

	private onJsonError(): void {
		App.DebugUtils.error('加载错误重新加载游戏！');
	}

	private onPreload(): void {
		App.FguiManager.init();
		App.LoadingManager.init();
		App.ModelManager.init();
		this.onMain();
	}

	private onMain(): void {
		App.ViewManager.show(MainView, null, MainCtrl, null, ViewShowType.MULTI_VIEW);
	}
}
