/**
 * shader id类型
 * 注: 该id不能随意定义，定义前先查看下引擎（ShaderDefines2D）是否有定义过
 */
export const enum Shader2DType {
	/**溶解shader id */
	DISSOLVE = 0x400,
	/**镜面光泽 */
	SPECULAR_GLOSS = 0x401,
	/**阴影 */
	SHADOW = 0x402,
	/**水 */
	WATER = 0x403,
}
