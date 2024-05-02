import { Shader2X } from "laya/webgl/shader/d2/Shader2X";
import { Float } from '../../types/Types';
import { Shader2DType } from '../Const';
import water_fs from '../glsl/water.fs.glsl';
import water_vs from '../glsl/water.vs.glsl';
import { CustomValue2D } from './CustomValue2D';

export class WaterValue2D extends CustomValue2D {
	//-----定义自定义的uniform变量----
	public waveTex: WebGLTexture;
	public noiseTex: WebGLTexture;
	public tildTexW: Float;
	public tildTexH: Float;
	public tildW: Float;
	public tildH: Float;
	public layaFT: Float = 1.0;
	public tildX: Float = 0.0;
	public tildY: Float = 0.0;
	//-----定义自定义的uniform变量----

	public constructor() {
		super(Shader2DType.WATER);
	}

	public static createShader2X(): Shader2X {
		return Shader2X.create(water_vs, water_fs) as Shader2X;
	}

	public destroy(): void {
		super.destroy();
		this.waveTex = null!;
	}

}
