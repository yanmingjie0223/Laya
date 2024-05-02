import { Shader2X } from "laya/webgl/shader/d2/Shader2X";
import { Float, Int8 } from '../../types/Types';
import { Shader2DType } from '../Const';
import dissolve_fs from '../glsl/dissolve.fs.glsl';
import texture_vs from '../glsl/texture.vs.glsl';
import { CustomValue2D } from './CustomValue2D';

export class DissolveValue2D extends CustomValue2D {
	//-----定义自定义的uniform变量----
	public dissolveRate: Float = 0.0;
	public dark: Int8 = 0;
	//-----定义自定义的uniform变量----

	public constructor() {
		super(Shader2DType.DISSOLVE);
	}

	public static createShader2X(): Shader2X {
		return Shader2X.create(texture_vs, dissolve_fs) as Shader2X;
	}

}
