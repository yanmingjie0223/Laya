#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了
	precision highp float;
#else
	precision mediump float;
#endif

#include "Lighting.glsl";

const float MIE_G = -0.990;
const float MIE_G2 = 0.9801;
const float SKY_GROUND_THRESHOLD = 0.02;

uniform float u_SunSize;
uniform float u_SunSizeConvergence;
uniform DirectionLight u_SunLight;


varying vec3 v_GroundColor;
varying vec3 v_SkyColor;


#ifdef SUN_HIGH_QUALITY
	varying vec3 v_Vertex;
#elif defined(SUN_SIMPLE)
	varying vec3 v_RayDir;
#else
	varying float v_SkyGroundFactor;
#endif

#if defined(SUN_HIGH_QUALITY)||defined(SUN_SIMPLE)
	varying vec3 v_SunColor;
#endif

// Calculates the Mie phase function
float getMiePhase(float eyeCos, float eyeCos2) {
	float temp = 1.0 + MIE_G2 - 2.0 * MIE_G * eyeCos;
	temp = pow(temp, pow(u_SunSize,0.65) * 10.0);
	temp = max(temp,1.0e-4); // prevent division by zero, esp. in half precision
	temp = 1.5 * ((1.0 - MIE_G2) / (2.0 + MIE_G2)) * (1.0 + eyeCos2) / temp;
	return temp;
}

// Calculates the sun shape
float calcSunAttenuation(vec3 lightPos, vec3 ray) {
	#ifdef SUN_HIGH_QUALITY
		float focusedEyeCos = pow(clamp(dot(lightPos, ray),0.0,1.0), u_SunSizeConvergence);
		return getMiePhase(-focusedEyeCos, focusedEyeCos * focusedEyeCos);
	#else //SUN_SIMPLE
		vec3 delta = lightPos - ray;
		float dist = length(delta);
		float spot = 1.0 - smoothstep(0.0, u_SunSize, dist);
		return spot * spot;
	#endif
}

void main() {
	// if y > 1 [eyeRay.y < -SKY_GROUND_THRESHOLD] - ground
	// if y >= 0 and < 1 [eyeRay.y <= 0 and > -SKY_GROUND_THRESHOLD] - horizon
	// if y < 0 [eyeRay.y > 0] - sky
	vec3 col = vec3(0.0, 0.0, 0.0);

	#ifdef SUN_HIGH_QUALITY
		vec3 ray = normalize(v_Vertex);
		float y = ray.y / SKY_GROUND_THRESHOLD;
	#elif defined(SUN_SIMPLE) 
		vec3 ray = v_RayDir;
		float y = ray.y / SKY_GROUND_THRESHOLD;	
	#else
		float y = v_SkyGroundFactor;
	#endif

	// if we did precalculate color in vprog: just do lerp between them
	col = mix(v_SkyColor, v_GroundColor, clamp(y,0.0,1.0));

	#if defined(SUN_HIGH_QUALITY)||defined(SUN_SIMPLE)
		if (y < 0.0)
			col += v_SunColor * calcSunAttenuation(-u_SunLight.direction, -ray);
	#endif

	col = sqrt(col);//linear space convert to gamma space
	gl_FragColor=vec4(col,1.0);
}

