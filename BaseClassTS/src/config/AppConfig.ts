/*
 * @Author: yanmingjie0223@qq.com
 * @Date: 2019-01-24 16:19:06
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2021-10-04 16:26:28
 */
export default class AppConfig {

    /**
     * ui原始宽
     */
    public static readonly initWidth: number = 750;

    /**
     * ui原始高
     */
    public static readonly initHeight: number = 1334;

	/**
	 * ui原始最高
	 */
	public static readonly initMaxHeight: number = 1624;

    /**
     * 资源无引用后缓存时间(ms)
     */
    public static readonly resCacheTime: number = 3 * 60 * 1000;

    /**
     * 蒙层背景图片
     */
    public static readonly matteUrl: string = 'ui://preload/wBg';

}
