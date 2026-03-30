"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

const NORTH_STAR_SHADER = `
float saturate(float x){ return clamp(x, 0.0, 1.0); }

float spikeIntensity(vec2 uv, vec2 dir, float width, float falloff, float shimmer){
    dir = normalize(dir);
    vec2 n = vec2(-dir.y, dir.x);
    float d = abs(dot(uv, n));
    float along = abs(dot(uv, dir));
    float core = pow(saturate(1.0 - d/width), 4.0);
    float fade = 1.0 / (1.0 + falloff*along);
    float wave = sin(along * 12.0 - iTime * 3.0) * 0.5 + 0.5;
    wave = pow(wave, 2.0) * shimmer;
    return core * fade * (1.0 + wave * 1.5);
}

float spikeIntensityAsym(vec2 uv, vec2 dir, float width, float fallPos, float fallNeg, float shimmer){
    dir = normalize(dir);
    vec2 n = vec2(-dir.y, dir.x);
    float d = abs(dot(uv, n));
    float along = dot(uv, dir);
    float core = pow(saturate(1.0 - d/width), 4.0);
    float fade = 1.0 / (1.0 + (along >= 0.0 ? fallPos*along : fallNeg*(-along)));
    float wave = sin(abs(along) * 12.0 - iTime * 3.0) * 0.5 + 0.5;
    wave = pow(wave, 2.0) * shimmer;
    return core * fade * (1.0 + wave * 1.5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (fragCoord - 0.5*iResolution.xy) / iResolution.y;
    float zoom = 0.4;
    uv *= zoom;

    float breathe = sin(iTime * 0.5) * 0.25 + 0.75;
    float heartbeat = sin(iTime * 1.0) * 0.18 + 0.82;
    float shimmerAmount = 0.8;

    float star = 0.0;
    float baseWidth = 0.018;

    vec2 dirV = vec2(0.0, 1.0);
    vec2 dirH = vec2(1.0, 0.0);
    vec2 dirD  = normalize(vec2(1.0, 1.0));
    vec2 dirD2 = normalize(vec2(1.0, -1.0));

    float fallVTop = 100.0;
    float fallVBottom = 20.0;
    float fallH = 50.0;
    float fallDiagGlow = 800.0;
    float fallDiagTight = 300.0;
    float wGlow  = baseWidth * 4.5;
    float wTight = baseWidth * 2.5;

    star += spikeIntensityAsym(uv, dirV, baseWidth*2.5, fallVTop, fallVBottom, shimmerAmount * 0.8);
    star += spikeIntensity(uv, dirH, baseWidth*2.5, fallH, shimmerAmount);
    star += spikeIntensity(uv, dirD,  wGlow,  fallDiagGlow, shimmerAmount * 0.6);
    star += spikeIntensity(uv, dirD,  wTight, fallDiagTight, shimmerAmount * 0.4) * 0.6;
    star += spikeIntensity(uv, dirD2, wGlow,  fallDiagGlow, shimmerAmount * 0.6);
    star += spikeIntensity(uv, dirD2, wTight, fallDiagTight, shimmerAmount * 0.4) * 0.6;

    star *= breathe;

    float r = length(uv);
    float halo = pow(0.008 / (r + 0.0025), 1.4) * heartbeat;
    float softHalo = pow(0.15 / (r + 0.02), 0.7) * 0.18 * breathe;

    vec3 coreCol  = vec3(1.00, 0.95, 0.60);
    vec3 glowCol  = vec3(1.00, 0.85, 0.35);
    float warmMix = saturate(1.0 - r*25.0);
    vec3 col = mix(glowCol, coreCol, warmMix) * (star + halo + softHalo);

    float colorShimmer = sin(iTime * 0.8) * 0.12 + 0.88;
    col *= colorShimmer;
    col *= smoothstep(1.2, 0.15, r);
    col = 1.0 - exp(-col);

    fragColor = vec4(col, 1.0);
}
`;

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <ShadertoyRenderer
        fragmentShader={NORTH_STAR_SHADER}
        className="h-full w-full"
      />
      <Link
        href="/showcase#creative"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>
    </div>
  );
}
