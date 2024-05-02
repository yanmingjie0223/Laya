import App from './core/App';
import { PQLifeCycle, PQOnShowResult, pqPlatformSdk, PQPlatformType } from './platform/index';

/**
 * 游戏生命周期
 */
export class MainLifeCycle implements PQLifeCycle {
	public static onShow(result: PQOnShowResult): void {
		App.DebugUtils.warn('onShow ===> ');
		const platformMananger = pqPlatformSdk.platformMananger;
		const platform = platformMananger.platform;
		platform.keepScreenOn();
		if (platformMananger.plarmType === PQPlatformType.PT_MOSNOW) {
			platform.checkVersionUpdate((hasUpdate: boolean) => {
				if (hasUpdate && wx) {
					const updateManager = wx.getUpdateManager();
					if (updateManager) {
						updateManager.onUpdateReady(function () {
							updateManager.applyUpdate();
						});
					}
				}
			});
		}
	}

	public static onHide(): void {
		App.DebugUtils.warn('onHide ===> ');
	}
}
