import fgui from '../../fgui/index';
import GlobalModalWaiting from '../../module/preload/GlobalModalWaiting';
import Singleton from '../base/Singleton';

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-21 16:09:28
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:31:32
 */
export default class FguiManager extends Singleton {
	public init(): void {
		this.initConfig();
		this.bindComponent();
	}

	/**
	 * 初始化设置
	 */
	private initConfig(): void {
		fgui.UIConfig.defaultFont = "aaa";
		fgui.UIConfig.packageFileExtension = 'bin';
		fgui.UIConfig.globalModalWaiting = 'ui://preload/GlobalModalWaiting';
		fgui.UIConfig.windowModalWaiting = 'ui://preload/GlobalModalWaiting';
	}

	/**
	 * 绑定fgui到类
	 */
	// eslint-disable-next-line max-statements
	private bindComponent(): void {
        const setExtension: Function = fgui.UIObjectFactory.setExtension;
        /**UIConfig配置 */
        setExtension('ui://preload/GlobalModalWaiting', GlobalModalWaiting);
    }

}
