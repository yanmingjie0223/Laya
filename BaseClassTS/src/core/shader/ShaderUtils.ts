import { Texture } from "laya/resource/Texture";
import { SpineSkeleton } from 'laya/spine/SpineSkeleton';
import { Shader2X } from 'laya/webgl/shader/d2/Shader2X';
import { Value2D } from 'laya/webgl/shader/d2/value/Value2D';
import fgui from '../../fgui/index';
import App from '../App';
import { JsUtils } from '../utils/JsUtils';
import { Shader2DType } from './Const';
import { CustomValue2D } from './value2d/CustomValue2D';
import { DissolveValue2D } from "./value2d/DissolveValue2D";
import { ShadowValue2D } from './value2d/ShadowValue2D';
import { SpecularGlossValue2D } from './value2d/SpecularGlossValue2D';
import { WaterValue2D } from './value2d/WaterValue2D';

export class ShaderUtils {

	/**shader自定义id */
	public static shaderId: number = 0;

	/**
	 * 创建一个自定义spine纹理
	 * @param texturDic
	 */
	public static createSpineCustomTexture(
		id: number,
		texturDic: any,
		spine: SpineSkeleton,
		shaderType: Shader2DType
	): Value2D[] {
		const dic = JsUtils.createMap();
		const value2ds = [];
		for (const key in texturDic) {
			if (key.indexOf('.png') !== -1 || key.indexOf('.webp') !== -1) {
				dic[key] = ShaderUtils.createValue2DTexture(id, texturDic[key], shaderType);
				const value2d = ShaderUtils.getValue2D(dic[key]);
				if (value2d) {
					value2ds.push(value2d as DissolveValue2D);
				}
			}
			else {
				dic[key] = texturDic[key];
			}
		}
		// 这里加入自定义texture用来存放和替换shader
		spine['customTextureDic'] = dic;
		return value2ds;
	}

	/**
	 * 更新镜面光泽特效
	 * @param frameCount
	 * @param gObj
	 */
	public static updateSpecularGloss(frameCount: number, gObj: fgui.GObject): void {
		const value2ds = this.getGObjectValue2D(gObj);
		if (value2ds.length > 0) {
			const len = value2ds.length;
			for (let i = 0; i < len; i++) {
				const value2d = value2ds[i];
				if (value2d instanceof SpecularGlossValue2D) {
					value2d.layaFT = frameCount;
				}
			}
		}
	}

	/**
	 * 对GObject添加shader
	 * @param id
	 * @param gObj
	 * @param shaderType
	 */
	public static addGObjectShader(id: number, gObj: fgui.GObject, shaderType: Shader2DType): void {
		if (gObj instanceof fgui.GImage) {
			const texture = gObj.image.texture;
			gObj.image.texture = this.createValue2DTexture(id, texture, shaderType);
		}
		else if (gObj instanceof fgui.GLoader) {
			const image = gObj.content;
			const texture = image.texture;
			image.texture = this.createValue2DTexture(id, texture, shaderType);
		}
		else if (gObj instanceof fgui.GComponent) {
			const len = gObj.numChildren;
			for (let i = 0; i < len; i++) {
				const child = gObj.getChildAt(i);
				this.addGObjectShader(id, child, shaderType);
			}
		}
	}

	/**
	 * 移除或者销毁GObject对象上的shader value2d
	 * @param gObj
	 * @param isDestroy
	 */
	public static removeGObjectShader(gObj: fgui.GObject, isDestroy: boolean = false): void {
		if (gObj instanceof fgui.GImage) {
			const texture = gObj.image.texture;
			if (isDestroy) {
				this.destoryCopyTexture(texture);
			}
			else {
				this.removeValue2D(texture);
			}
		}
		else if (gObj instanceof fgui.GLoader) {
			const image = gObj.content;
			const texture = image.texture;
			if (isDestroy) {
				this.destoryCopyTexture(texture);
			}
			else {
				this.removeValue2D(texture);
			}
		}
		else if (gObj instanceof fgui.GComponent) {
			const len = gObj.numChildren;
			for (let i = 0; i < len; i++) {
				const child = gObj.getChildAt(i);
				this.removeGObjectShader(child, isDestroy);
			}
		}
	}

	/**
	 * 获取gobject shader value2d对象
	 * @param gObj
	 * @returns
	 */
	public static getGObjectValue2D(gObj: fgui.GObject): Value2D[] {
		if (!gObj || !gObj.displayObject) {
			return [];
		}

		const value2ds = [];
		if (gObj instanceof fgui.GImage) {
			const v2d = this.getValue2D(gObj.image.texture);
			v2d && value2ds.push(v2d);
		}
		else if (gObj instanceof fgui.GLoader) {
			const image = gObj.content;
			const v2d = this.getValue2D(image.texture);
			v2d && value2ds.push(v2d);
		}
		else if (gObj instanceof fgui.GComponent) {
			const len = gObj.numChildren;
			for (let i = 0; i < len; i++) {
				const child = gObj.getChildAt(i);
				const v2ds = this.getGObjectValue2D(child);
				value2ds.push(...v2ds);
			}
		}

		return value2ds;
	}

	/**
	 * 创建对应类型shader的纹理
	 * @param id
	 * @param texture
	 * @param shaderType
	 * @returns
	 */
	public static createValue2DTexture(
		id: number,
		texture: Texture,
		shaderType: Shader2DType
	): Texture | null {
		if (!texture) {
			return null;
		}

		const value2d: CustomValue2D = this.createValue2D(id, shaderType);
		return this.createVTByTexAndShader(texture, value2d);
	}

	/**
	 * 根据纹理和value2d获取组合后的shader纹理
	 * @param texture
	 * @param value2d
	 * @returns
	 */
	public static createVTByTexAndShader(texture: Texture, value2d: CustomValue2D): Texture | null {
		const rTex = this.textureCopy(texture);
		// 这里加入自定义customValue2D用来存放自定义shader，渲染时检测texture中customValue2D对象，使用对应的shader
		// 相当于材质的功能，这里未封装材质对象
		this.setTextureValue2D(rTex, value2d);
		return rTex;
	}

	/**
	 * 创建对应类型shader value2d对象
	 * @param id
	 * @param shaderType
	 * @returns
	 */
	public static createValue2D(
		id: number,
		shaderType: Shader2DType
	): CustomValue2D {
		let value2d: CustomValue2D;
		let shader: Shader2X;
		switch (shaderType) {
			case Shader2DType.SPECULAR_GLOSS:
				value2d = new SpecularGlossValue2D();
				shader = SpecularGlossValue2D.createShader2X();
				break;
			case Shader2DType.DISSOLVE:
				value2d = new DissolveValue2D();
				shader = DissolveValue2D.createShader2X();
				break;
			case Shader2DType.SHADOW:
				value2d = new ShadowValue2D();
				shader = ShadowValue2D.createShader2X();
				break;
			case Shader2DType.WATER:
				value2d = new WaterValue2D();
				shader = WaterValue2D.createShader2X();
				break;
			default:
				App.DebugUtils.error(`${shaderType}类型未对shader进行处理!`);
				return null;
		}

		value2d.customId = id;
		value2d.setShader2X(shader);
		return value2d;
	}

	/**
	 * 获取纹理上的value2d对象
	 * @param texture
	 * @returns
	 */
	public static getValue2D(texture: Texture): Value2D | null {
		const value2d = texture['customValue2D'];
		if (value2d) {
			return value2d;
		}
		return null;
	}

	/**
	 * 移除纹理上的shader
	 * @param texture
	 */
	public static removeValue2D(texture: Texture): void {
		if (!texture) {
			return;
		}

		const value2d = texture['customValue2D'];
		if (value2d) {
			texture['customValue2D'] = null;
			delete texture['customValue2D'];
		}
	}

	/**
	 * 销毁纹理上的shader
	 * @param texture
	 */
	public static destroyValue2D(texture: Texture): void {
		if (!texture) {
			return;
		}

		const value2d = texture['customValue2D'];
		if (value2d) {
			texture['customValue2D'] = null;
			delete texture['customValue2D'];
			value2d.destroy();
		}
	}

	/**
	 * 在纹理上绑定value2d设置shader 注：spine shader走createSpineCustomTexture
	 * @param texture
	 * @param value2d
	 * @returns
	 */
	public static setTextureValue2D(texture: Texture, value2d: Value2D): void {
		if (!texture || !value2d) {
			return;
		}

		texture['customValue2D'] = value2d;
	}

	/**
	 * 获取shader id
	 * @returns
	 */
	public static getShaderId(): number {
		++this.shaderId;
		return this.shaderId;
	}

	/**
	 * 注：使用该方法需要特别注意，可能会销毁到缓存中的源纹理数据
	 * 销毁为value2d拷贝的纹理
	 * @param texture
	 * @returns
	 */
	public static destoryCopyTexture(texture: Texture): void {
		if (!texture) {
			return;
		}
		const value2d = texture['customValue2D'];
		if (value2d) {
			texture['customValue2D'] = null;
			delete texture['customValue2D'];
			value2d.destroy();
			texture.bitmap = null!;
			texture._uv = null!;
			texture.uvrect = null!;
		}
	}

	/**
	 * copyTex复制到tex中
	 * @param copyTex
	 * @param tex
	 */
	public static copyTextureToTexture(copyTex: Texture, tex: Texture): void {
		(tex as any)._bitmap = (copyTex as any)._bitmap;
		(tex as any)._destroyed = (copyTex as any)._destroyed;
		(tex as any)._h = (copyTex as any)._h;
		(tex as any)._referenceCount = (copyTex as any)._referenceCount;
		(tex as any)._uv = (copyTex as any)._uv;
		(tex as any)._w = (copyTex as any)._w;

		tex.$_GID = copyTex.$_GID;
		tex.offsetX = copyTex.offsetX;
		tex.offsetY = copyTex.offsetY;
		tex.scaleRate = copyTex.scaleRate;
		tex.sourceWidth = copyTex.sourceWidth;
		tex.sourceHeight = copyTex.sourceHeight;
		tex.url = copyTex.url;
		tex.uvrect = copyTex.uvrect;
	}

	/**
	 * 拷贝texture用来附加自定义value2d
	 * @param texture
	 * @returns
	 */
	private static textureCopy(texture: Texture): Texture {
		const newTex = new Texture();
		this.copyTextureToTexture(texture, newTex);
		return newTex;
	}

}
