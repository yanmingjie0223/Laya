/*
 * @Author: yanmingjie
 * @Date: 2019-08-19 23:19:24
 * @Last Modified by: yanmingjie0223@qq.com
 * @Last Modified time: 2024-05-02 18:27:39
 *
 * key-value 'tipText': '${name}来了${name2}'
 *
 * 多个value值可随意取名字，但是不可重复。
 * 例如： 'tipText': '${name}来了${name}' 错误
 */
export const I18nZhConfig = {
	test: '测试'
};

export const I18nEnConfig: any = {};
export type I18Key = keyof typeof I18nZhConfig;
