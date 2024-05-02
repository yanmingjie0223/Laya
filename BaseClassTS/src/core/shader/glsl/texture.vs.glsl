precision highp float;
attribute vec4 posuv;
attribute vec4 attribColor;
attribute vec4 attribFlags;
uniform vec4 clipMatDir;
uniform vec2 clipMatPos;
uniform vec2 size;
uniform vec2 clipOff;
#ifdef WORLDMAT
    uniform mat4 mmat;
#endif
#ifdef MVP3D
    uniform mat4 u_MvpMatrix;
#endif
varying vec2 cliped;
varying vec4 v_texcoordAlpha;
varying vec4 v_color;
varying float v_useTex;

void main() {
    vec4 pos = vec4(posuv.xy,0.,1.);
    #ifdef WORLDMAT
        pos=mmat*pos;
    #endif
    vec4 pos1  =vec4((pos.x/size.x-0.5)*2.0,(0.5-pos.y/size.y)*2.0,0.,1.0);
    #ifdef MVP3D
        gl_Position=u_MvpMatrix*pos1;
    #else
        gl_Position=pos1;
    #endif
    v_texcoordAlpha.xy = posuv.zw;
    v_color = attribColor/255.0;
    v_color.xyz*=v_color.w;
    v_useTex = attribFlags.r/255.0;
    float clipw = length(clipMatDir.xy);
    float cliph = length(clipMatDir.zw);
    vec2 clpos = clipMatPos.xy;
    #ifdef WORLDMAT
        if(clipOff[0]>0.0){
            clpos.x+=mmat[3].x;
            clpos.y+=mmat[3].y;
        }
    #endif
    vec2 clippos = pos.xy - clpos;
    if(clipw>20000. && cliph>20000.) {
        cliped = vec2(0.5,0.5);
    }
    else {
        cliped=vec2( dot(clippos,clipMatDir.xy)/clipw/clipw, dot(clippos,clipMatDir.zw)/cliph/cliph);
    }
}