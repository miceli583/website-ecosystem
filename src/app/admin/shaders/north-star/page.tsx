"use client";

import { ShaderLayout } from "~/components/shaders/shader-layout";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

// North Star shader code
const NORTH_STAR_SHADER = `
 // North Star — diagonals rotate inline (two layers from same direction)
float saturate(float x){ return clamp(x, 0.0, 1.0); }

mat3 rotY(float a){
    float c = cos(a), s = sin(a);
    return mat3(
        c,   0.0,  s,
        0.0, 1.0,  0.0,
       -s,   0.0,  c
    );
}

float spikeIntensity(vec2 uv, vec2 dir, float width, float falloff, float shimmer){
    dir = normalize(dir);
    vec2 n = vec2(-dir.y, dir.x);
    float d = abs(dot(uv, n));
    float along = abs(dot(uv, dir));
    float core = pow(saturate(1.0 - d/width), 4.0);
    float fade = 1.0 / (1.0 + falloff*along);

    // Shimmer wave traveling along the ray - slower, smooth
    float wave = sin(along * 12.0 - iTime * 3.0) * 0.5 + 0.5;
    wave = pow(wave, 2.0) * shimmer; // Less power = broader waves

    return core * fade * (1.0 + wave * 1.5); // Increased multiplier
}

float spikeIntensityAsym(vec2 uv, vec2 dir, float width, float fallPos, float fallNeg, float shimmer){
    dir = normalize(dir);
    vec2 n = vec2(-dir.y, dir.x);
    float d = abs(dot(uv, n));
    float along = dot(uv, dir);
    float core = pow(saturate(1.0 - d/width), 4.0);
    float fade = 1.0 / (1.0 + (along >= 0.0 ? fallPos*along : fallNeg*(-along)));

    // Shimmer wave traveling along the ray - slower, smooth
    float wave = sin(abs(along) * 12.0 - iTime * 3.0) * 0.5 + 0.5;
    wave = pow(wave, 2.0) * shimmer; // Less power = broader waves

    return core * fade * (1.0 + wave * 1.5); // Increased multiplier
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (fragCoord - 0.5*iResolution.xy) / iResolution.y;

    // Zoom control (smaller = more zoomed in)
    float zoom = 0.4; // Try values like 0.3 (very zoomed in) to 1.0 (zoomed out)
    uv *= zoom;

    // Static - no rotation (star points straight up)

    // === ANIMATION PARAMETERS ===
    // Breathing pulse - slower and stays brighter
    float breathe = sin(iTime * 0.5) * 0.25 + 0.75;

    // Secondary pulse for depth - slower and stays brighter
    float heartbeat = sin(iTime * 1.0) * 0.18 + 0.82;

    // Shimmer intensity (controls traveling waves) - strong
    float shimmerAmount = 0.8;

    float star = 0.0;
    float baseWidth = 0.018;

    // --- Axes (simple 2D directions) ---
    vec2 dirV = vec2(0.0, 1.0);  // vertical (pointing up)
    vec2 dirH = vec2(1.0, 0.0);  // horizontal (pointing right)

    // --- Diagonals ---
    vec2 dirD  = normalize(vec2(1.0, 1.0));   // up-right diagonal
    vec2 dirD2 = normalize(vec2(1.0, -1.0));  // down-right diagonal

    // Tuning (your earlier intent kept)
    float fallVTop    = 100.0;
    float fallVBottom = 20.0;     // bottom ~1/3 longer
    float fallH       = 50.0;

    // Diagonals: two layers that SHARE the same dir -> rotate inline
    float fallDiagGlow = 800.0;   // softer, longer
    float fallDiagTight= 300.0;   // tighter, near the core
    float wGlow  = baseWidth * 4.5;
    float wTight = baseWidth * 2.5;

    // --- Accumulate (with shimmer waves) ---
    // Vertical (asymmetric) - main pointing ray
    star += spikeIntensityAsym(uv, dirV, baseWidth*2.5, fallVTop, fallVBottom, shimmerAmount * 0.8);
    // Horizontal
    star += spikeIntensity(uv, dirH, baseWidth*2.5, fallH, shimmerAmount);

    // Diagonal pair: two layers each, SAME directions (no drift)
    star += spikeIntensity(uv, dirD,  wGlow,  fallDiagGlow, shimmerAmount * 0.6);
    star += spikeIntensity(uv, dirD,  wTight, fallDiagTight, shimmerAmount * 0.4) * 0.6;

    star += spikeIntensity(uv, dirD2, wGlow,  fallDiagGlow, shimmerAmount * 0.6);
    star += spikeIntensity(uv, dirD2, wTight, fallDiagTight, shimmerAmount * 0.4) * 0.6;

    // Apply breathing pulse to rays
    star *= breathe;

    // --- Glow (with pulsing) ---
    float r = length(uv);
    float halo = pow(0.008 / (r + 0.0025), 1.4) * heartbeat;
    float softHalo = pow(0.15 / (r + 0.02), 0.7) * 0.18 * breathe;

    vec3 coreCol  = vec3(1.00, 0.95, 0.60);
    vec3 glowCol  = vec3(1.00, 0.85, 0.35);
    float warmMix = saturate(1.0 - r*25.0);
    vec3 col = mix(glowCol, coreCol, warmMix) * (star + halo + softHalo);

    // Add noticeable color shimmer to the glow - slower and brighter
    float colorShimmer = sin(iTime * 0.8) * 0.12 + 0.88;
    col *= colorShimmer;

    // vignette + simple tonemap
    col *= smoothstep(1.2, 0.15, r);
    col = 1.0 - exp(-col);

    fragColor = vec4(col, 1.0);
}
`;

export default function NorthStarPage() {
  return (
    <ShaderLayout>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <ShadertoyRenderer
          fragmentShader={NORTH_STAR_SHADER}
          className="h-full w-full"
        />

        {/* Content Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-6 p-8 text-center">
            <h1 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-5xl font-bold text-transparent">
              North Star
            </h1>
            <p className="text-xl text-white/80">
              A guiding beacon with golden rays, symbolizing direction, purpose,
              and unwavering light
            </p>
          </div>
        </div>
      </div>
    </ShaderLayout>
  );
}
