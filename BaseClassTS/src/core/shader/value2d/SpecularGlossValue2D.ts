import { Shader2X } from "laya/webgl/shader/d2/Shader2X";
import { Float } from '../../types/Types';
import { Shader2DType } from '../Const';
import specular_gloss_fs from '../glsl/specular_gloss.fs.glsl';
import texture_vs from '../glsl/texture.vs.glsl';
import { CustomValue2D } from './CustomValue2D';

export class SpecularGlossValue2D extends CustomValue2D {
	//-----定义自定义的uniform变量----
	public sgWidth: Float = 0.03;
	public sgStrength: Float = 1.3;
	public layaFT: Float = 1.0;
	//-----定义自定义的uniform变量----

	public constructor() {
		super(Shader2DType.SPECULAR_GLOSS);
	}

	public static createShader2X(): Shader2X {
		return Shader2X.create(texture_vs, specular_gloss_fs) as Shader2X;
	}

}
