#if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了
	precision highp float;
#else
	precision mediump float;
#endif

#include "Lighting.glsl";

#define OUTER_RADIUS 1.025
#define RAYLEIGH (mix(0.0, 0.0025, pow(u_AtmosphereThickness,2.5)))// Rayleigh constant Rayleigh为夜空光和极光亮度单位
#define MIE 0.0010             // Mie constant 米氏散射
#define SUN_BRIGHTNESS 20.0    // Sun brightness
#define MAX_SCATTER 50.0 // Maximum scattering value, to prevent math overflows on Adrenos

const float SKY_GROUND_THRESHOLD = 0.02;
const float outerRadius = OUTER_RADIUS;
const float outerRadius2 = OUTER_RADIUS*OUTER_RADIUS;
const float innerRadius = 1.0;
const float innerRadius2 = 1.0;
const float cameraHeight = 0.0001;

const float HDSundiskIntensityFactor = 15.0;
const float simpleSundiskIntensityFactor = 27.0;

const float sunScale = 400.0 * SUN_BRIGHTNESS;
const float kmESun = MIE * SUN_BRIGHTNESS;
const float km4PI = MIE * 4.0 * 3.14159265;
const float scale = 1.0 / (OUTER_RADIUS - 1.0);
const float scaleDepth = 0.25;
const float scaleOverScaleDepth = (1.0 / (OUTER_RADIUS - 1.0)) / 0.25;
const float samples = 2.0; // THIS IS UNROLLED MANUALLY, DON'T TOUCH

// RGB wavelengths        .35 (.62=158), .43 (.68=174), .525 (.75=190)
const vec3 c_DefaultScatteringWavelength = vec3(0.65, 0.57, 0.475);//默认散射波长
const vec3 c_VariableRangeForScatteringWavelength = vec3(0.15, 0.15, 0.15);//散射播放的可变范围

attribute vec4 a_Position;

uniform mat4 u_ViewProjection;
uniform vec3 u_SkyTint;
uniform vec3 u_GroundTint;
uniform float u_Exposure;
uniform float u_AtmosphereThickness;
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

// Calculates the Rayleigh phase function
float getRayleighPhase(vec3 light, vec3 ray) 
{
	float eyeCos = dot(light, ray);
	return 0.75 + 0.75*eyeCos*eyeCos;
}

float scaleAngle(float inCos)
{
	float x = 1.0 - inCos;
	return 0.25 * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
}


void main () {
	gl_Position = u_ViewProjection*a_Position;

	vec3 skyTintInGammaSpace = u_SkyTint;//支持非GAMMA空间后要调整
	vec3 scatteringWavelength = mix(c_DefaultScatteringWavelength-c_VariableRangeForScatteringWavelength,c_DefaultScatteringWavelength+c_VariableRangeForScatteringWavelength,vec3(1.0) - skyTintInGammaSpace); // using Tint in sRGB+ gamma allows for more visually linear interpolation and to keep (0.5) at (128, gray in sRGB) point
	vec3 invWavelength = 1.0 / pow(scatteringWavelength, vec3(4.0));

	float krESun = RAYLEIGH * SUN_BRIGHTNESS;
	float kr4PI = RAYLEIGH * 4.0 * 3.14159265;

	vec3 cameraPos = vec3(0.0,innerRadius + cameraHeight,0.0); // The camera's current position

	// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)
	vec3 eyeRay = normalize(a_Position.xyz);

	float far = 0.0;
	vec3 cIn, cOut;
	if (eyeRay.y >= 0.0) {// Sky
		// Calculate the length of the "atmosphere"
		far = sqrt(outerRadius2 + innerRadius2 * eyeRay.y * eyeRay.y - innerRadius2) - innerRadius * eyeRay.y;

		// Calculate the ray's starting position, then calculate its scattering offset
		float height = innerRadius + cameraHeight;
		float depth = exp(scaleOverScaleDepth * -cameraHeight);
		float startAngle = dot(eyeRay, cameraPos) / height;
		float startOffset = depth*scaleAngle(startAngle);

		// Initialize the scattering loop variables
		float sampleLength = far / samples;
		float scaledLength = sampleLength * scale;
		vec3 sampleRay = eyeRay * sampleLength;
		vec3 samplePoint = cameraPos + sampleRay * 0.5;

		vec3 frontColor = vec3(0.0);
		//unrolling this manually to avoid some platform for loop slow
		{
			float height = length(samplePoint);
			float depth = exp(scaleOverScaleDepth * (innerRadius - height));
			float lightAngle = dot(-u_SunLight.direction, samplePoint) / height;
			float cameraAngle = dot(eyeRay, samplePoint) / height;
			float scatter = (startOffset + depth*(scaleAngle(lightAngle) - scaleAngle(cameraAngle)));
			vec3 attenuate = exp(-clamp(scatter, 0.0, MAX_SCATTER) * (invWavelength * kr4PI + km4PI));

			frontColor += attenuate * (depth * scaledLength);
			samplePoint += sampleRay;
		}
		{
			float height = length(samplePoint);
			float depth = exp(scaleOverScaleDepth * (innerRadius - height));
			float lightAngle = dot(-u_SunLight.direction, samplePoint) / height;
			float cameraAngle = dot(eyeRay, samplePoint) / height;
			float scatter = (startOffset + depth*(scaleAngle(lightAngle) - scaleAngle(cameraAngle)));
			vec3 attenuate = exp(-clamp(scatter, 0.0, MAX_SCATTER) * (invWavelength * kr4PI + km4PI));

			frontColor += attenuate * (depth * scaledLength);
			samplePoint += sampleRay;
		}

		// Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader
		cIn = frontColor * (invWavelength * krESun);
		cOut = frontColor * kmESun;
	} else {// Ground
		far = (-cameraHeight) / (min(-0.001, eyeRay.y));
		vec3 pos = cameraPos + far * eyeRay;

		// Calculate the ray's starting position, then calculate its scattering offset
		float depth = exp((-cameraHeight) * (1.0/scaleDepth));
		float cameraAngle = dot(-eyeRay, pos);
		float lightAngle = dot(-u_SunLight.direction, pos);
		float cameraScale = scaleAngle(cameraAngle);
		float lightScale = scaleAngle(lightAngle);
		float cameraOffset = depth*cameraScale;
		float temp = lightScale + cameraScale;

		// Initialize the scattering loop variables
		float sampleLength = far / samples;
		float scaledLength = sampleLength * scale;
		vec3 sampleRay = eyeRay * sampleLength;
		vec3 samplePoint = cameraPos + sampleRay * 0.5;

		// Now loop through the sample rays
		vec3 frontColor = vec3(0.0, 0.0, 0.0);
		vec3 attenuate;

		// Loop removed because we kept hitting SM2.0 temp variable limits. Doesn't affect the image too much.
		{
			float height = length(samplePoint);
			float depth = exp(scaleOverScaleDepth * (innerRadius - height));
			float scatter = depth*temp - cameraOffset;
			attenuate = exp(-clamp(scatter, 0.0, MAX_SCATTER) * (invWavelength * kr4PI + km4PI));
			frontColor += attenuate * (depth * scaledLength);
			samplePoint += sampleRay;
		}

		cIn = frontColor * (invWavelength * krESun + kmESun);
		cOut = clamp(attenuate, 0.0, 1.0);
	}

	#ifdef SUN_HIGH_QUALITY
		v_Vertex = -a_Position.xyz;
	#elif defined(SUN_SIMPLE) 
		v_RayDir = -eyeRay;
	#else
		v_SkyGroundFactor = -eyeRay.y / SKY_GROUND_THRESHOLD;
	#endif

	// if we want to calculate color in vprog:
	// in case of linear: multiply by _Exposure in here (even in case of lerp it will be common multiplier, so we can skip mul in fshader)
	v_GroundColor = u_Exposure * (cIn + u_GroundTint*u_GroundTint * cOut);//u_GroundColor*u_GroundColor is gamma space convert to linear space
	v_SkyColor    = u_Exposure * (cIn * getRayleighPhase(-u_SunLight.direction, -eyeRay));

	
	// The sun should have a stable intensity in its course in the sky. Moreover it should match the highlight of a purely specular material.
	// This matching was done using the Unity3D standard shader BRDF1 on the 5/31/2017
	// Finally we want the sun to be always bright even in LDR thus the normalization of the lightColor for low intensity.
	float lightColorIntensity = clamp(length(u_SunLight.color), 0.25, 1.0);

	#ifdef SUN_HIGH_QUALITY 
		v_SunColor = HDSundiskIntensityFactor * clamp(cOut,0.0,1.0) * u_SunLight.color / lightColorIntensity;
	#elif defined(SUN_SIMPLE) 
		v_SunColor = simpleSundiskIntensityFactor * clamp(cOut * sunScale,0.0,1.0) * u_SunLight.color / lightColorIntensity;
	#endif
	gl_Position=remapGLPositionZ(gl_Position);
}
