import { Config } from 'Config';
import { Laya } from 'Laya';
import { Event } from 'laya/events/Event';
import { Rectangle } from 'laya/maths/Rectangle';
import { AtlasInfoManager } from 'laya/net/AtlasInfoManager';
import { Loader } from 'laya/net/Loader';
import { LoaderManager } from 'laya/net/LoaderManager';
import { ResourceVersion } from 'laya/net/ResourceVersion';
import { URL } from 'laya/net/URL';
import { PhysicsDebugDraw } from 'laya/physics/PhysicsDebugDraw';
import { Texture } from 'laya/resource/Texture';
import { Handler } from 'laya/utils/Handler';
import { Stat } from 'laya/utils/Stat';
import { Utils } from 'laya/utils/Utils';
import { WebGL } from 'laya/webgl/WebGL';
import App from './core/App';
import AppEntry from './core/AppEntry';
import { ResFile } from './core/const/CoreConst';
import fgui from './fgui/index';
import GameConfig from './GameConfig';
import { MainLifeCycle } from './MainLifeCycle';
import { pqPlatformSdk } from './platform/index';

class Main {
	public constructor() {
		// 引擎设置
		Config.useWebGL2 = false;
		//根据IDE设置初始化引擎
		Laya.init(GameConfig.width, GameConfig.height, WebGL);
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		URL.exportSceneToJson = GameConfig.exportSceneToJson;
		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Utils.getQueryString('debug') === 'true') {
			Laya.enableDebugPanel();
		}
		if (GameConfig.physicsDebug) {
			PhysicsDebugDraw.enable();
		}
		if (GameConfig.stat) {
			Stat.show();
		}
		// Laya.alertGlobalError(true);
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		ResourceVersion.enable(
			'version.json',
			Handler.create(this, this.onVersionLoaded),
			ResourceVersion.FILENAME_VERSION
		);

		if (!Laya.Browser.onPC) {
			if (document && document.body) {
				const docElm = document.body;
				docElm.addEventListener('click', () => {
					try {
						if (docElm['mozRequestFullScreen']) {
							docElm['mozRequestFullScreen']();
						} else if (docElm['msRequestFullscreen']) {
							docElm['msRequestFullscreen']();
						} else if (docElm.requestFullscreen) {
							docElm.requestFullscreen();
						} else if (docElm['webkitRequestFullScreen']) {
							docElm['webkitRequestFullScreen']();
						}
					} catch (error) {
						App.DebugUtils.warn('fullscreen anomaly!');
					}
				});
			}
		}
	}

	private onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		AtlasInfoManager.enable('fileconfig.json', Handler.create(this, this.onConfigLoaded));
	}

	private onConfigLoaded(): void {
		const resJson: Array<ResFile> = [
			{
				url: 'sgconfig.json',
				type: Loader.JSON
			}
		];
		App.LoadManager.loadArray(
			resJson,
			this.onSettingLoaded,
			() => {
				pqPlatformSdk.platformMananger.platform.exit();
			},
			null,
			this
		);
	}

	private onSettingLoaded(): void {
		this.overrideFunction();
		pqPlatformSdk.platformMananger.platform.onLifeCycle(MainLifeCycle);
		new AppEntry().start();
	}

	private overrideFunction(): void {
		// 加载管理器重载
		LoaderManager.prototype.getRes = (url: string, isAtlas?: boolean) => {
			const getResFun: Function = Loader.getRes;
			return getResFun(url, isAtlas);
		};
		// 用来解决fgui的ubb图文混排问题
		Loader.getRes = (url: string, isAtlas?: boolean) => {
			let result: Texture;
			let fileUrl = url;
			if (!isAtlas) {
				fileUrl = App.PathManager.getImageUrl(url);
			}
			if (typeof fileUrl === 'string' && fileUrl.indexOf('ui://') === 0) {
				const item = fgui.UIPackage.getItemByURL(fileUrl);
				if (!item) {
					result = void 0;
				} else {
					item.load();
					result = item.texture;
				}
			} else {
				result = Loader.textureMap[URL.formatURL(fileUrl)];
				if (!result) {
					result = Loader.loadedMap[URL.formatURL(fileUrl)];
				}
			}
			return result;
		};
		// 用来处理点击范围
		const pro: any = fgui.GButton.prototype;
		// eslint-disable-next-line complexity
		pro.__mouseup = function (event: Event) {
			if (this._down) {
				let isSendClick = false;
				if (this._downScaled && event && this.parent && !this.displayObject.destroyed) {
					const _scaleX: number = this.scaleX / this._downEffectValue;
					const _scaleY: number = this.scaleY / this._downEffectValue;
					const _x: number = this.x - ((_scaleX - 1) * this.width) / 2;
					const _y: number = this.y - ((_scaleY - 1) * this.width) / 2;
					const parentRect: Rectangle = this.parent.localToGlobalRect(
						_x,
						_y,
						this.width * _scaleX,
						this.height * _scaleY
					);
					const myRect: Rectangle = this.localToGlobalRect(0, 0, this.width, this.height);
					const _stageX: number = event.stageX;
					const _stageY: number = event.stageY;
					if (
						_stageX < myRect.x ||
						_stageX > myRect.x + myRect.width ||
						_stageY < myRect.y ||
						_stageY > myRect.y + myRect.height
					) {
						if (
							_stageX >= parentRect.x &&
							_stageX <= parentRect.x + parentRect.width &&
							_stageY >= parentRect.y &&
							_stageY <= parentRect.y + parentRect.height
						) {
							isSendClick = true;
						}
					}
				}
				// 源码部分
				Laya.stage.off(Event.MOUSE_UP, this, this.__mouseup);
				this._down = false;

				if (!this._displayObject) {
					return;
				}

				if (this._mode === fgui.ButtonMode.Common) {
					if (
						this.grayed &&
						this._buttonController &&
						this._buttonController.hasPage(fgui.GButton.DISABLED)
					) {
						this.setState(fgui.GButton.DISABLED);
					} else if (this._over) {
						this.setState(fgui.GButton.OVER);
					} else {
						this.setState(fgui.GButton.UP);
					}
				}
				// 等待处理完成按钮的效果后发送click事件
				if (isSendClick) {
					fgui.Events.dispatch('click', this.displayObject);
				}
			}
		};
	}
}

//激活启动类
// eslint-disable-next-line no-new
new Main();
