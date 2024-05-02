import { ILaya } from '../../ILaya';
import { LayaGL } from "../layagl/LayaGL";
import { RenderTextureFormat } from "../resource/RenderTextureFormat";
import { Texture2D } from '../resource/Texture2D';
import { TextureFormat } from "../resource/TextureFormat";

/**
 * 系统工具。
 */
export class SystemUtils {
    /** @internal */
    static _maxTextureCount: number;
    /** @internal */
    static _maxTextureSize: number;
    /** @internal */
    static _shaderCapailityLevel: number;

	/**未解码的贴图 by: yanmingjie */
	static _noDecodeTexture: Texture2D[] = [];
	/**未解码贴图参数 by: yanmingjie */
	static _noDecodeArgs: any[] = [];

    /**
     * 图形设备支持的最大纹理数量。
     */
    static get maxTextureCount(): number {
        return this._maxTextureCount;
    }

    /**
     * 图形设备支持的最大纹理尺寸。
     */
    static get maxTextureSize(): number {
        return this._maxTextureSize;
    }

    /**
     * 图形设备着色器的大致能力等级,类似于DirectX的shader model概念。
     */
    static get shaderCapailityLevel(): number {
        return this._shaderCapailityLevel;
    }

    /**
     * 是否支持纹理格式。
     * @param format 纹理格式。
     * @returns 是否支持。
     */
    static supportTextureFormat(format: number): boolean {
        switch (format) {
            case TextureFormat.R32G32B32A32:
                return (!LayaGL.layaGPUInstance._isWebGL2 && !LayaGL.layaGPUInstance._oesTextureFloat) ? false : true;
            case TextureFormat.R16G16B16A16:
                return (!LayaGL.layaGPUInstance._isWebGL2 && !LayaGL.layaGPUInstance._oesTextureHalfFloat) ? false : true;
            default:
                return true;
        }
    }

    /**
     * 是否支持渲染纹理格式。
     * @param format 渲染纹理格式。
     * @returns 是否支持。
     */
    static supportRenderTextureFormat(format: number): boolean {
        switch (format) {
            case RenderTextureFormat.R16G16B16A16:
                return (((!!LayaGL.layaGPUInstance._isWebGL2)&&(!!LayaGL.layaGPUInstance._extColorBufferFloat)) || LayaGL.layaGPUInstance._oesTextureHalfFloat && LayaGL.layaGPUInstance._oesTextureHalfFloatLinear) ? true : false;
            case RenderTextureFormat.Depth:
                return (LayaGL.layaGPUInstance._isWebGL2 || LayaGL.layaGPUInstance._webgl_depth_texture) ? true : false;
            case RenderTextureFormat.ShadowMap:
                return LayaGL.layaGPUInstance._isWebGL2 ? true : false;
            default:
                return true;
        }
    }

	/**
	 * by: yanmingjie
	 * 添加需要解码的贴图
	 * @param texture2d
	 * @param source
	 * @param premultiplyAlpha
	 */
	static addNoDecodeTexture(texture2d: Texture2D, source: any, premultiplyAlpha: boolean): void {
		if (texture2d) {
			this._noDecodeTexture.push(texture2d);
			this._noDecodeArgs.push([source, premultiplyAlpha]);
		}
	}

	/**
	 * by: yanmingjie
	 * 设置加载资源是否立马解析 未解析将存储在_noDecodeTexture中
	 * @param value
	 */
	static setIsDecodeTexture(value: boolean): void {
		Texture2D.IS_DECODE = value;
	}

	/**
	 * by: yanmingjie
	 * 手动调用解码一定数量的贴图
	 * @param count
	 */
	static decodeTexture(count: number): void {
		for (let i = 0; i < count; i++) {
			const texture2d = this._noDecodeTexture.pop();
			if (!texture2d) {
				break;
			}

			const args = this._noDecodeArgs.pop();
			texture2d.loadImageSource(args[0], args[1], true);
			const texture = ILaya.loader.getRes(texture2d.url);
			if (texture && !texture.destroyed && texture.setTo) {
				texture.setTo(texture2d);
			}
		}
	}

	/**
	 * by: yanmingjie
	 * 解码所有未解码的贴图
	 */
	static decodeAllTexture(): void {
		this.setIsDecodeTexture(true);
		const len: number = this._noDecodeTexture.length;
		this.decodeTexture(len);
	}

}