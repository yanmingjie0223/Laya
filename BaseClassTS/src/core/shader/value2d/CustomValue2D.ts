import { Shader2X } from "laya/webgl/shader/d2/Shader2X";
import { ShaderDefines2D } from "laya/webgl/shader/d2/ShaderDefines2D";
import { Value2D } from "laya/webgl/shader/d2/value/Value2D";
import { ShaderValue } from "laya/webgl/shader/ShaderValue";
import { RenderState2D } from "laya/webgl/utils/RenderState2D";
import { Shader2DType } from '../Const';

export class CustomValue2D extends Value2D {
	/**自定义shader id */
	private _customId: number = null!;
	/**shader对象 */
	private _shader2X: Shader2X = null!;
	/**当使用相同纹理shader时 是否拆分合批 */
	private _isSplitBatch: boolean = true;

	public constructor(shaderType: Shader2DType, subID: number = 0) {
		super(shaderType, subID);
	}

	public static createShader2X(): Shader2X {
		return null;
	}

	public set customId(value: number) {
		const that = this;
		that._customId = value;
		that.subID = value;
		that.defines.addInt(that.customId);
	}

	public get customId(): number {
		return this._customId;
	}

	public setShader2X(value: Shader2X): void {
		this._shader2X = value;
	}

	/**
	 * 设置相同纹理是否拆分合批
	 * @param isBatch
	 */
	public setSplitBatch(isBatch: boolean): void {
		this._isSplitBatch = isBatch;
	}

	public getSplitBatch(): boolean {
		return this._isSplitBatch;
	}

	public clear(): void {
		super.clear();
	}

	public destroy(): void {
		this.clear();
		if (this.textureHost) {
			this.textureHost.bitmap = null!;
			this.textureHost._uv = null!;
			this.textureHost.uvrect = null!;
			this.textureHost['customValue2D'] = null!;
			this.textureHost = null!;
		}
		if (this.texture) {
			this.texture = null!;
		}
		if (this._shader2X) {
			this._shader2X.destroy();
			this._shader2X = null!;
		}
	}

	public release(): void {
		if (--this.ref < 1) {
			this.clear();
			this.filters = null;
			this.ref = 1;
			this.clipOff[0] = 0;
		}
	}

	public upload(): void {
		const renderstate2d: any = RenderState2D;
		const that = this;

		// 如果有矩阵的话，就设置 WORLDMAT 宏
		RenderState2D.worldMatrix4 === RenderState2D.TEMPMAT4_ARRAY ||
			that.defines.addInt(ShaderDefines2D.WORLDMAT);

		that.mmat = renderstate2d.worldMatrix4;

		if (RenderState2D.matWVP) {
			that.defines.addInt(ShaderDefines2D.MVP3D);
			that.u_MvpMatrix = RenderState2D.matWVP.elements;
		}

		const sd: Shader2X = that._shader2X;

		if (
			sd._shaderValueWidth !== renderstate2d.width ||
			sd._shaderValueHeight !== renderstate2d.height
		) {
			that.size[0] = renderstate2d.width;
			that.size[1] = renderstate2d.height;
			sd._shaderValueWidth = renderstate2d.width;
			sd._shaderValueHeight = renderstate2d.height;
			sd.upload(<ShaderValue>that, null);
		} else {
			sd.upload(<ShaderValue>that, sd._params2dQuick2 || sd._make2dQuick2());
		}
	}

}
