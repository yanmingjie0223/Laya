import { Shader2X } from "laya/webgl/shader/d2/Shader2X";
import { Shader2DType } from '../Const';
import shadow_fs from '../glsl/shadow.fs.glsl';
import texture_vs from '../glsl/texture.vs.glsl';
import { CustomValue2D } from './CustomValue2D';

export class ShadowValue2D extends CustomValue2D {
	//-----定义自定义的uniform变量----
	//-----定义自定义的uniform变量----

	public constructor() {
		super(Shader2DType.SHADOW);
	}

	public static createShader2X(): Shader2X {
		return Shader2X.create(texture_vs, shadow_fs) as Shader2X;
	}

}
