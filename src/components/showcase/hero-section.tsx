"use client";

import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";
import { ChevronDown } from "lucide-react";

const ORBIT_STAR_SHADER = `
float saturate(float x) { return clamp(x, 0.0, 1.0); }

float sdRing(vec2 p, float r, float thickness) {
    return abs(length(p) - r) - thickness;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec2 uvOrig = uv;
    float time = iTime;

    float tiltX = sin(time * 0.3) * 0.06;
    float tiltY = cos(time * 0.25) * 0.04;
    float perspective = 1.0 + uvOrig.y * tiltX + uvOrig.x * tiltY;
    uv *= perspective;

    float breathe = sin(time * 0.6) * 0.15 + 0.85;
    float pulse = sin(time * 1.2) * 0.1 + 0.9;

    vec3 goldLight = vec3(0.965, 0.902, 0.757);
    vec3 goldMid = vec3(0.847, 0.678, 0.329);
    vec3 goldDark = vec3(0.549, 0.361, 0.149);

    float r = length(uv);
    vec3 col = vec3(0.0);

    float outerRing = sdRing(uv, 0.36, 0.012);
    float outerGlow = saturate(0.005 / (abs(outerRing) + 0.003)) * breathe;
    col += mix(goldMid, goldLight, saturate(1.0 - abs(outerRing) * 20.0)) * outerGlow;

    float innerRing = sdRing(uv, 0.29, 0.006);
    float innerGlow = saturate(0.003 / (abs(innerRing) + 0.002)) * 0.45 * breathe;
    col += goldLight * innerGlow;

    float squareSize = 0.26;
    float sqAngle = -time * 0.1;
    float sc = cos(sqAngle), ss = sin(sqAngle);
    mat2 sqRot = mat2(sc, -ss, ss, sc);
    vec2 uvSq = sqRot * uv;

    float sq45 = 0.7071;
    vec2 uvDiamond = vec2(uvSq.x * sq45 + uvSq.y * sq45, -uvSq.x * sq45 + uvSq.y * sq45);

    float pureSq = max(abs(uvDiamond.x), abs(uvDiamond.y)) - squareSize;
    float circ = length(uvDiamond) - squareSize * 1.15;
    float squareDist = mix(pureSq, circ, 0.12);

    float lineWidth = 0.010;
    float coreLine = 1.0 - smoothstep(0.0, lineWidth, abs(squareDist));
    float squareGlow = saturate(0.012 / (abs(squareDist) + 0.008)) * breathe;

    col += goldLight * coreLine * 0.8;
    col += goldMid * squareGlow * 0.35;

    float arcIntensity = 0.0;
    for (int i = 0; i < 4; i++) {
        float startAngle = float(i) * 1.5708;
        float a = startAngle + time * 0.2;
        float c = cos(a), s = sin(a);
        vec2 rp = mat2(c, -s, s, c) * uv;
        float pAngle = atan(rp.y, rp.x);
        float pr = length(rp);
        float t = (pAngle + 3.14159) / 6.28318;
        t = mod(t + 0.25, 1.0);
        if (t < 0.28) {
            float progress = t / 0.25;
            progress = saturate(progress);
            float outerR = 0.36;
            float innerR = 0.29;
            float ctrl = 0.38;
            float t2 = progress;
            float targetR = (1.0-t2)*(1.0-t2)*outerR + 2.0*(1.0-t2)*t2*ctrl + t2*t2*innerR;
            float d = abs(pr - targetR);
            float endFade = smoothstep(0.0, 0.05, progress) * smoothstep(0.0, 0.05, 1.0 - progress);
            float arc = saturate(0.005 / (d + 0.002)) * endFade;
            arcIntensity += arc;
        }
    }

    float energy = sin(time * 2.0) * 0.3 + 0.7;
    col += mix(goldMid, goldLight, 0.5) * arcIntensity * breathe * energy * 0.5;

    float centerDot = saturate(0.010 / (r + 0.008)) * pulse;
    float centerHalo = saturate(0.002 / (r + 0.015)) * 0.4 * breathe;
    col += goldLight * centerDot;
    col += goldMid * centerHalo;

    for (int i = 0; i < 3; i++) {
        float particleAngle = -time * (0.15 + float(i) * 0.03) + float(i) * 2.094;
        float particleR = 0.32 + sin(time * 0.5 + float(i)) * 0.02;
        vec2 particlePos = vec2(cos(particleAngle), sin(particleAngle)) * particleR;
        float particleDist = length(uv - particlePos);
        float particle = saturate(0.002 / (particleDist + 0.001)) * 0.5;
        col += goldLight * particle * pulse;
    }

    float ambientGlow = saturate(0.05 / (r + 0.15)) * 0.08;
    col += goldDark * ambientGlow * breathe;

    float shimmer = sin(time * 0.7) * 0.08 + 0.92;
    col *= shimmer;
    col *= smoothstep(0.8, 0.2, r);
    col = 1.0 - exp(-col * 1.5);

    fragColor = vec4(col, 1.0);
}
`;

export function HeroSection() {
  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black">
      {/* Shader background */}
      <div className="absolute inset-0 opacity-40">
        <ShadertoyRenderer
          fragmentShader={ORBIT_STAR_SHADER}
          className="h-full w-full"
          resolutionScale={0.5}
          targetFps={30}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1
          className="mb-4 font-[family-name:var(--font-quattrocento-sans)] text-5xl font-bold tracking-[0.08em] sm:text-6xl md:text-7xl"
          style={{
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hi, I&apos;m Matthew.
        </h1>
        <p className="mb-3 font-[family-name:var(--font-muli)] text-xl font-light text-white/80 sm:text-2xl">
          Founder &amp; Lead Developer at MiracleMind
        </p>
        <p className="mx-auto max-w-xl text-base text-white/50 sm:text-lg">
          I build the custom backend systems that power regenerative ventures.
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/30 transition-colors hover:text-white/60"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
}
