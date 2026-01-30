"use client";

export const dynamic = "force-dynamic";

import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

/**
 * Orbit Star Shader - Embed Route (Public, No Auth)
 *
 * This is a public embed route specifically for use in iframes on landing pages.
 * Unlike /shaders/orbit-star/page.tsx, this has NO text overlay - just the shader.
 *
 * The main version has navigation and text overlays, making it unsuitable for backgrounds.
 * This embed version is clean and perfect for background iframes.
 */

const ORBIT_STAR_SHADER = `
// Orbit Star - Miracle Mind logo shader
// Two concentric rings, bowed square curves, swirling orbital paths, glowing center

float saturate(float x) { return clamp(x, 0.0, 1.0); }

// Signed distance to a circle ring
float sdRing(vec2 p, float r, float thickness) {
    return abs(length(p) - r) - thickness;
}

// Quadratic bezier curve distance (attempt via sampling)
float sdBezierQuad(vec2 p, vec2 a, vec2 b, vec2 c) {
    // Sample the bezier and find closest point
    float minD = 1000.0;
    for (int i = 0; i <= 16; i++) {
        float t = float(i) / 16.0;
        vec2 q = (1.0-t)*(1.0-t)*a + 2.0*(1.0-t)*t*b + t*t*c;
        minD = min(minD, length(p - q));
    }
    return minD;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    vec2 uvOrig = uv;

    float time = iTime;

    // === 3D PERSPECTIVE TILT ===
    float tiltX = sin(time * 0.3) * 0.06;
    float tiltY = cos(time * 0.25) * 0.04;
    float perspective = 1.0 + uvOrig.y * tiltX + uvOrig.x * tiltY;
    uv *= perspective;

    // Breathing animation
    float breathe = sin(time * 0.6) * 0.15 + 0.85;
    float pulse = sin(time * 1.2) * 0.1 + 0.9;

    // Gold color palette (from SVG gradient)
    vec3 goldLight = vec3(0.965, 0.902, 0.757);  // #F6E6C1
    vec3 goldMid = vec3(0.847, 0.678, 0.329);    // #D8AD54
    vec3 goldDark = vec3(0.549, 0.361, 0.149);   // #8C5C26

    float r = length(uv);
    vec3 col = vec3(0.0);

    // === OUTER RING ===
    float outerRing = sdRing(uv, 0.36, 0.012);
    float outerGlow = saturate(0.005 / (abs(outerRing) + 0.003)) * breathe;
    col += mix(goldMid, goldLight, saturate(1.0 - abs(outerRing) * 20.0)) * outerGlow;

    // === INNER RING (semi-transparent) ===
    float innerRing = sdRing(uv, 0.29, 0.006);
    float innerGlow = saturate(0.003 / (abs(innerRing) + 0.002)) * 0.45 * breathe;
    col += goldLight * innerGlow;

    // === ROTATED SQUARE (diamond orientation, straight edges) ===
    // Clean geometric square with glowing edges
    float squareSize = 0.26;

    // Slow rotation (inverted)
    float sqAngle = -time * 0.1;
    float sc = cos(sqAngle), ss = sin(sqAngle);
    mat2 sqRot = mat2(sc, -ss, ss, sc);
    vec2 uvSq = sqRot * uv;

    // Diamond orientation: rotate coords 45 degrees for axis-aligned SDF
    float sq45 = 0.7071;
    vec2 uvDiamond = vec2(uvSq.x * sq45 + uvSq.y * sq45, -uvSq.x * sq45 + uvSq.y * sq45);

    // Square with subtle smooth outward bow (blend toward circle)
    float pureSq = max(abs(uvDiamond.x), abs(uvDiamond.y)) - squareSize;
    float circ = length(uvDiamond) - squareSize * 1.15; // larger circle
    float squareDist = mix(pureSq, circ, 0.12); // 12% toward circle = gentle outward bow

    // Clean solid line
    float lineWidth = 0.010;
    float coreLine = 1.0 - smoothstep(0.0, lineWidth, abs(squareDist));

    // Soft glow around the square
    float squareGlow = saturate(0.012 / (abs(squareDist) + 0.008)) * breathe;

    // Combine: solid line + soft glow
    col += goldLight * coreLine * 0.8;
    col += goldMid * squareGlow * 0.35;

    // === ORBITAL SWIRL ARCS (your original - kept!) ===
    float arcIntensity = 0.0;

    for (int i = 0; i < 4; i++) {
        float startAngle = float(i) * 1.5708; // 90 degrees apart

        // Rotate point (opposite direction from square)
        float a = startAngle + time * 0.2;
        float c = cos(a), s = sin(a);
        vec2 rp = mat2(c, -s, s, c) * uv;

        float pAngle = atan(rp.y, rp.x);
        float pr = length(rp);

        // Normalize angle to 0-1
        float t = (pAngle + 3.14159) / 6.28318;
        t = mod(t + 0.25, 1.0);

        // Only draw in first quarter
        if (t < 0.28) {
            float progress = t / 0.25;
            progress = saturate(progress);

            // Bezier-like curve from outer to inner
            float outerR = 0.36;
            float innerR = 0.29;

            // Control point creates the bulge
            float ctrl = 0.38;
            float t2 = progress;
            float targetR = (1.0-t2)*(1.0-t2)*outerR + 2.0*(1.0-t2)*t2*ctrl + t2*t2*innerR;

            float d = abs(pr - targetR);

            // Fade at ends
            float endFade = smoothstep(0.0, 0.05, progress) * smoothstep(0.0, 0.05, 1.0 - progress);

            float arc = saturate(0.005 / (d + 0.002)) * endFade;
            arcIntensity += arc;
        }
    }

    // Add traveling energy along arcs
    float energy = sin(time * 2.0) * 0.3 + 0.7;
    col += mix(goldMid, goldLight, 0.5) * arcIntensity * breathe * energy * 0.5;

    // === CENTER GLOW ===
    float centerDot = saturate(0.010 / (r + 0.008)) * pulse;
    float centerHalo = saturate(0.002 / (r + 0.015)) * 0.4 * breathe;
    col += goldLight * centerDot;
    col += goldMid * centerHalo;

    // === ORBITING PARTICLES (counter-clockwise, slow) ===
    for (int i = 0; i < 3; i++) {
        float particleAngle = -time * (0.15 + float(i) * 0.03) + float(i) * 2.094;
        float particleR = 0.32 + sin(time * 0.5 + float(i)) * 0.02;
        vec2 particlePos = vec2(cos(particleAngle), sin(particleAngle)) * particleR;
        float particleDist = length(uv - particlePos);
        float particle = saturate(0.002 / (particleDist + 0.001)) * 0.5;
        col += goldLight * particle * pulse;
    }

    // === AMBIENT GLOW ===
    float ambientGlow = saturate(0.05 / (r + 0.15)) * 0.08;
    col += goldDark * ambientGlow * breathe;

    // Subtle color shimmer
    float shimmer = sin(time * 0.7) * 0.08 + 0.92;
    col *= shimmer;

    // Vignette
    col *= smoothstep(0.8, 0.2, r);

    // Tonemap
    col = 1.0 - exp(-col * 1.5);

    fragColor = vec4(col, 1.0);
}
`;

export default function OrbitStarEmbedPage() {
  return (
    <div className="h-screen w-screen">
      <ShadertoyRenderer fragmentShader={ORBIT_STAR_SHADER} />
    </div>
  );
}
