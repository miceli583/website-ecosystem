"use client";

import Image from "next/image";
import { MapPin, Mail } from "lucide-react";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

const NEURAL_NET_SHADER = `
// The Universe Within - by Martijn Steinrucken aka BigWings 2018
// Email:countfrolic@gmail.com Twitter:@The_ArtOfCode
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define S(a, b, t) smoothstep(a, b, t)
#define NUM_LAYERS 2.

float N21(vec2 p) {
	vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));
    a += dot(a, a.yzx + 79.76);
    return fract((a.x + a.y) * a.z);
}

vec2 GetPos(vec2 id, vec2 offs, float t) {
    float n = N21(id+offs);
    float n1 = fract(n*10.);
    float n2 = fract(n*100.);
    float a = t+n;
    return offs + vec2(sin(a*n1), cos(a*n2))*.4;
}

float GetT(vec2 ro, vec2 rd, vec2 p) {
	return dot(p-ro, rd);
}

float LineDist(vec3 a, vec3 b, vec3 p) {
	return length(cross(b-a, p-a))/length(p-a);
}

float df_line( in vec2 a, in vec2 b, in vec2 p)
{
    vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa,ba) / dot(ba,ba), 0., 1.);
	return length(pa - ba * h);
}

float line(vec2 a, vec2 b, vec2 uv) {
    float r1 = .04;
    float r2 = .01;

    float d = df_line(a, b, uv);
    float d2 = length(a-b);
    float fade = S(1.5, .5, d2);

    fade += S(.05, .02, abs(d2-.75));
    return S(r1, r2, d)*fade;
}

float NetLayer(vec2 st, float n, float t) {
    vec2 id = floor(st)+n;

    st = fract(st)-.5;

    vec2 p[9];
    p[0] = GetPos(id, vec2(-1.,-1.), t);
    p[1] = GetPos(id, vec2(0.,-1.), t);
    p[2] = GetPos(id, vec2(1.,-1.), t);
    p[3] = GetPos(id, vec2(-1.,0.), t);
    p[4] = GetPos(id, vec2(0.,0.), t);
    p[5] = GetPos(id, vec2(1.,0.), t);
    p[6] = GetPos(id, vec2(-1.,1.), t);
    p[7] = GetPos(id, vec2(0.,1.), t);
    p[8] = GetPos(id, vec2(1.,1.), t);

    float m = 0.;
    float sparkle = 0.;

    for(int i=0; i<9; i++) {
        vec2 pi;
        if(i==0) pi = p[0];
        else if(i==1) pi = p[1];
        else if(i==2) pi = p[2];
        else if(i==3) pi = p[3];
        else if(i==4) pi = p[4];
        else if(i==5) pi = p[5];
        else if(i==6) pi = p[6];
        else if(i==7) pi = p[7];
        else pi = p[8];

        m += line(p[4], pi, st);

        float d = length(st-pi);

        float s = (.005/(d*d));
        s *= S(1., .7, d);
        float pulse = sin((fract(pi.x)+fract(pi.y)+t)*5.)*.4+.6;
        pulse = pow(pulse, 20.);

        s *= pulse;
        sparkle += s;
    }

    m += line(p[1], p[3], st);
	m += line(p[1], p[5], st);
    m += line(p[7], p[5], st);
    m += line(p[7], p[3], st);

    float sPhase = (sin(t+n)+sin(t*.1))*.25+.5;
    sPhase += pow(sin(t*.1)*.5+.5, 50.)*.5;
    m += sparkle*sPhase*0.3;

    return m;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
	vec2 M = vec2(0.0);

    float t = iTime*.005;

    float s = sin(t);
    float c = cos(t);
    mat2 rot = mat2(c, -s, s, c);
    vec2 st = uv*rot;
	M *= rot*2.;

    float m = 0.;
    for(float i=0.; i<1.; i+=1./NUM_LAYERS) {
        float z = fract(t+i);
        float size = mix(15., 1., z);
        float fade = S(0., .6, z)*S(1., .8, z);

        m += fade * NetLayer(st*size-M*z, i, iTime);
    }

    float glow = -uv.y*0.2;

    vec3 baseCol = vec3(0.831, 0.686, 0.216);

    vec3 col = baseCol*m;
    col += baseCol*glow;

    col *= 1.-dot(uv,uv);
    t = mod(iTime, 230.);
    col *= S(0., 20., t)*S(224., 200., t);

    fragColor = vec4(col,1);
}
`;

export function HeroSection() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Shader background */}
      <div className="absolute inset-0 opacity-15">
        <ShadertoyRenderer
          fragmentShader={NEURAL_NET_SHADER}
          className="h-full w-full"
          resolutionScale={0.5}
          targetFps={30}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 sm:flex-row sm:gap-10 md:gap-14">
        {/* Text */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <h1 className="font-[family-name:var(--font-quattrocento-sans)] text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
            Hi, I&apos;m Matthew Miceli
          </h1>
          <p className="text-sm text-gray-100 drop-shadow-md sm:text-base md:text-lg">
            Founder &amp; Lead Developer at{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <span style={{ fontWeight: 300 }}>MIRACLE</span>{" "}
              <span style={{ fontWeight: 700 }}>MIND</span>
            </span>
          </p>
          <p className="max-w-lg text-sm leading-relaxed text-white/50 drop-shadow-md sm:text-base md:text-lg">
            Integrating disciplines to design systems that honor what makes us
            human.
          </p>
          <div className="flex flex-col gap-2 text-xs text-gray-200 sm:flex-row sm:gap-4 sm:text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Austin, TX</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <a
                href="mailto:matthewmiceli@miraclemind.live"
                className="hover:underline"
                style={{ color: "#D4AF37" }}
              >
                matthewmiceli@miraclemind.live
              </a>
            </div>
          </div>
        </div>

        {/* Profile photo */}
        <div className="shrink-0">
          <div
            className="h-28 w-28 overflow-hidden rounded-full border-2 shadow-2xl sm:h-36 sm:w-36 md:h-44 md:w-44"
            style={{
              borderColor: "#D4AF37",
              boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.25)",
            }}
          >
            <Image
              src="/images/profile.jpg"
              alt="Matthew Miceli"
              width={176}
              height={176}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
