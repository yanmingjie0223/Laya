import { loadItem } from 'laya/net/LoaderManager';

/*
 * @Author: yanmingjie
 * @Date: 2020-07-01 21:45:39
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-02 14:04:12
 */
export type ResFile = loadItem;

export const enum FitType {
	/**水平居中 */
	ALIGN_CENTER = 'center',
	/**水平左对齐 */
	ALIGN_LEFT = 'left',
	/**水平右对齐 */
	ALIGN_RIGHT = 'right',
	/**垂直居中 */
	ALIGN_MIDDLE = 'middle',
	/**垂直顶对齐 */
	ALIGN_TOP = 'top',
	/**垂直底对齐 */
	ALIGN_BOTTOM = 'buttom'
}

export const enum Direction {
	DEFAULT,
	TOP,
	RIGHT,
	DOWN,
	LEFT
}

export const enum I18nType {
	/**中文 */
	ZH = 'zh',
	/**英文 */
	EN = 'en'
}

export const enum ViewLayerType {
	/**
	 * 后台层
	 */
	BACKSTAGE_LAYER = 'backstage_layer',
	/**
	 * view底层类型
	 */
	BOTTOM_LAYER = 'bottom_layer',
	/**
	 * view中层类型
	 */
	MIDDLE_LAYER = 'middle_layer',
	/**
	 * view上层类型
	 */
	TOP_LAYER = 'top_layer',
	/**
	 * 弹窗层类型
	 */
	WINDOW_LAYER = 'window_layer',
	/**
	 * 引导层类型
	 */
	GUIDE_LAYER = 'guide_layer',
	/**
	 * 最外层类型
	 */
	MAX_LAYER = 'max_layer'
}

export const enum ViewShowType {
	/**
	 * 显示在单个弹窗中，该弹窗会逐个弹出
	 */
	SINGLETON_VIEW = 1,
	/**
	 * 多个界面堆积显示，默认是该显示类型
	 */
	MULTI_VIEW = 2
}

export const enum ViewStatus {
	/**
	 * 关闭状态
	 */
	CLOSE = 0,
	/**
	 * 显示展开中
	 */
	SHOWING,
	/**
	 * 完全显示展开
	 */
	SHOW,
}

export const enum ViewType {
	/**
	 * view界面
	 */
	VIEW = 1,
	/**
	 * 弹窗界面无黑色蒙层，有底层点击
	 */
	WINDOW = 2,
	/**
	 * 弹窗且有蒙层界面
	 */
	X_WINDOW = 3
}

export const enum AreaType {
	/**
	 * 铺满所有区域
	 */
	FULL,
	/**
	 * 铺满安全区域
	 */
	SAFE
}

export const enum ViewEvent {
	/**
	 * 显示view事件
	 */
	VIEW_SHOW = 'view_show',
	/**
	 * 加载完view事件
	 */
	VIEW_LOAD = 'view_load',
	/**
	 * 完全显示view事件
	 */
	VIEW_SHOWN = 'view_shown',
	/**
	 * 关闭view事件
	 */
	VIEW_CLOSE = 'view_close',
	/**
	 * 逐个弹窗结束
	 */
	WINDOW_CLOSE = 'window_close'
}
