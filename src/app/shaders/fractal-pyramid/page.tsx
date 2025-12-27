"use client";

export const dynamic = "force-dynamic";

import { ShaderLayout } from "~/components/shaders/shader-layout";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

// Fractal Pyramid shader code
const FRACTAL_PYRAMID_SHADER = `
vec3 palette(float d){
	return mix(vec3(0.2,0.7,0.9),vec3(1.,0.,1.),d);
}

vec2 rotate(vec2 p,float a){
	float c = cos(a);
    float s = sin(a);
    return p*mat2(c,s,-s,c);
}

float map(vec3 p){
    for( int i = 0; i<8; ++i){
        float t = iTime*0.2;
        p.xz =rotate(p.xz,t);
        p.xy =rotate(p.xy,t*1.89);
        p.xz = abs(p.xz);
        p.xz-=.5;
	}
	return dot(sign(p),p)/5.;
}

vec4 rm (vec3 ro, vec3 rd){
    float t = 0.;
    vec3 col = vec3(0.);
    float d;
    for(float i =0.; i<64.; i++){
		vec3 p = ro + rd*t;
        d = map(p)*.5;
        if(d<0.02){
            break;
        }
        if(d>100.){
        	break;
        }
        col+=palette(length(p)*.1)/(400.*(d));
        t+=d;
    }
    return vec4(col,1./(d*100.));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-(iResolution.xy/2.))/iResolution.x;
	vec3 ro = vec3(0.,0.,-50.);
    ro.xz = rotate(ro.xz,iTime);
    vec3 cf = normalize(-ro);
    vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
    vec3 cu = normalize(cross(cf,cs));

    vec3 uuv = ro+cf*3. + uv.x*cs + uv.y*cu;

    vec3 rd = normalize(uuv-ro);

    vec4 col = rm(ro,rd);

    fragColor = col;
}
`;

export default function FractalPyramidPage() {
  return (
    <ShaderLayout>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <ShadertoyRenderer
          fragmentShader={FRACTAL_PYRAMID_SHADER}
          className="h-full w-full"
        />

        {/* Content Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-6 p-8 text-center">
            <h1 className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-bold text-transparent">
              Fractal Pyramid
            </h1>
            <p className="text-xl text-white/80">
              Raymarched fractal geometry with rotating transformations
            </p>
          </div>
        </div>
      </div>
    </ShaderLayout>
  );
}
