import fgui from "../../fgui/index";
import Singleton from "../base/Singleton";
import { ViewLayerType } from "../const/CoreConst";
import ViewLayer from "../const/ViewLayer";
import DebugUtils from "../utils/DebugUtils";

/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-18 16:20:26
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2022-02-16 09:19:38
 */
export default class LayerManager extends Singleton {

	/**
	 * 初始化
	 */
	public init(): void {
		ViewLayer.init();

		const rootCom: fgui.GComponent = fgui.GRoot.inst;
		rootCom.addChild(ViewLayer.BACKSTAGE_COMPONENT);
		rootCom.addChild(ViewLayer.BOTTOM_COMPONENT);
		rootCom.addChild(ViewLayer.MIDDLE_COMPONENT);
		rootCom.addChild(ViewLayer.TOP_COMPONENT);
		rootCom.addChild(ViewLayer.WINDOW_COMPONENT);
		rootCom.addChild(ViewLayer.GUIDE_COMPONENT);
		rootCom.addChild(ViewLayer.MAX_COMPONENT);

		ViewLayer.BACKSTAGE_COMPONENT.name = ViewLayerType.BACKSTAGE_LAYER;
		ViewLayer.BOTTOM_COMPONENT.name = ViewLayerType.BOTTOM_LAYER;
		ViewLayer.MIDDLE_COMPONENT.name = ViewLayerType.MIDDLE_LAYER;
		ViewLayer.TOP_COMPONENT.name = ViewLayerType.TOP_LAYER;
		ViewLayer.WINDOW_COMPONENT.name = ViewLayerType.WINDOW_LAYER;
		ViewLayer.GUIDE_COMPONENT.name = ViewLayerType.GUIDE_LAYER;
		ViewLayer.MAX_COMPONENT.name = ViewLayerType.MAX_LAYER;
	}

	/**
	 * 获取层级GComponent节点
	 * @param layer
	 */
	public getLayer(layer: ViewLayerType): fgui.GComponent | null {
		let layerCom: fgui.GComponent | null = null;
		switch (layer) {
			case ViewLayerType.BACKSTAGE_LAYER:
				layerCom = ViewLayer.BACKSTAGE_COMPONENT;
				break;
			case ViewLayerType.BOTTOM_LAYER:
				layerCom = ViewLayer.BOTTOM_COMPONENT;
				break;
			case ViewLayerType.MIDDLE_LAYER:
				layerCom = ViewLayer.MIDDLE_COMPONENT;
				break;
			case ViewLayerType.TOP_LAYER:
				layerCom = ViewLayer.TOP_COMPONENT;
				break;
			case ViewLayerType.WINDOW_LAYER:
				layerCom = ViewLayer.WINDOW_COMPONENT;
				break;
			case ViewLayerType.GUIDE_LAYER:
				layerCom = ViewLayer.GUIDE_COMPONENT;
				break;
			case ViewLayerType.MAX_LAYER:
				layerCom = ViewLayer.MAX_COMPONENT;
				break;
			default:
				const debugUtils = DebugUtils.getInstance<DebugUtils>();
				debugUtils.error(`${layer} 是ViewLayer中未定义层级!`);
				break;
		}
		return layerCom;
	}

	/**
	 * 获取层级排序位置
	 * @param layer
	 * @returns
	 */
	public getLayerIndex(layer: ViewLayerType): number {
		let index: number = 0;
		switch (layer) {
			case ViewLayerType.BACKSTAGE_LAYER:
				index = 1000;
				break;
			case ViewLayerType.MIDDLE_LAYER:
				index = 2000;
				break;
			case ViewLayerType.TOP_LAYER:
				index = 3000;
				break;
			case ViewLayerType.WINDOW_LAYER:
				index = 4000;
				break;
			case ViewLayerType.GUIDE_LAYER:
				index = 5000;
				break;
			case ViewLayerType.MAX_LAYER:
				index = 6000;
				break;
			default:
				const debugUtils = DebugUtils.getInstance<DebugUtils>();
				debugUtils.error(`${layer} 是ViewLayer中未定义层级!`);
				break;
		}
		return index;
	}

}
