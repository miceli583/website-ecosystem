"use client";

import { ShaderLayout } from "~/components/shaders/shader-layout";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

// Metatron's Cube shader code
const METATRONS_CUBE_SHADER = `
// Metatron's Cube - Sacred Geometry Shader
// Contains all 5 Platonic Solids encoded in sacred geometric form

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.10, 0.20);
    return a + b * cos(6.28318 * (c * t + d));
}

// Distance to a circle
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Distance to a line segment
float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

// Create glowing effect
float glow(float d, float strength, float thickness) {
    return thickness / (d * strength + 0.001);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized coordinates
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float time = iTime * 0.3;

    // Rotate the entire pattern
    float angle = time * 0.15;
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    uv = rot * uv;

    // Breathing/pulsing zoom
    float zoom = 2.5 + sin(time * 0.8) * 0.3;
    float scale = 1.0 / zoom;

    vec3 col = vec3(0.0);

    // Background gradient - cosmic feel
    float bgGradient = length(uv) * 0.5;
    vec3 bgColor = palette(bgGradient + time * 0.1);
    col += bgColor * 0.15;

    float r = scale; // Base radius for circle positions

    // Calculate distances to all circles and lines
    float minCircleDist = 1e10;
    float minLineDist = 1e10;

    // Center circle (index 0)
    vec2 center0 = vec2(0.0, 0.0);
    minCircleDist = min(minCircleDist, abs(sdCircle(uv - center0, scale)));

    // Inner ring of 6 circles (indices 1-6)
    for(int i = 0; i < 6; i++) {
        float ang = float(i) * 3.14159265 / 3.0;
        vec2 center = vec2(cos(ang), sin(ang)) * r;
        minCircleDist = min(minCircleDist, abs(sdCircle(uv - center, scale)));

        // Lines from center to this circle
        minLineDist = min(minLineDist, sdSegment(uv, center0, center));
    }

    // Outer ring of 6 circles (indices 7-12)
    for(int i = 0; i < 6; i++) {
        float ang = float(i) * 3.14159265 / 3.0 + 3.14159265 / 6.0;
        vec2 center = vec2(cos(ang), sin(ang)) * r * 1.732; // sqrt(3)
        minCircleDist = min(minCircleDist, abs(sdCircle(uv - center, scale)));

        // Lines from center to this circle
        minLineDist = min(minLineDist, sdSegment(uv, center0, center));
    }

    // Lines between inner ring circles
    for(int i = 0; i < 6; i++) {
        float ang1 = float(i) * 3.14159265 / 3.0;
        vec2 center1 = vec2(cos(ang1), sin(ang1)) * r;

        for(int j = 0; j < 6; j++) {
            if(j > i) {
                float ang2 = float(j) * 3.14159265 / 3.0;
                vec2 center2 = vec2(cos(ang2), sin(ang2)) * r;
                minLineDist = min(minLineDist, sdSegment(uv, center1, center2));
            }
        }
    }

    // Lines between outer ring circles
    for(int i = 0; i < 6; i++) {
        float ang1 = float(i) * 3.14159265 / 3.0 + 3.14159265 / 6.0;
        vec2 center1 = vec2(cos(ang1), sin(ang1)) * r * 1.732;

        for(int j = 0; j < 6; j++) {
            if(j > i) {
                float ang2 = float(j) * 3.14159265 / 3.0 + 3.14159265 / 6.0;
                vec2 center2 = vec2(cos(ang2), sin(ang2)) * r * 1.732;
                minLineDist = min(minLineDist, sdSegment(uv, center1, center2));
            }
        }
    }

    // Lines between inner and outer rings
    for(int i = 0; i < 6; i++) {
        float ang1 = float(i) * 3.14159265 / 3.0;
        vec2 center1 = vec2(cos(ang1), sin(ang1)) * r;

        for(int j = 0; j < 6; j++) {
            float ang2 = float(j) * 3.14159265 / 3.0 + 3.14159265 / 6.0;
            vec2 center2 = vec2(cos(ang2), sin(ang2)) * r * 1.732;
            minLineDist = min(minLineDist, sdSegment(uv, center1, center2));
        }
    }

    // Draw lines with glow - EMPHASIZE THE CUBE STRUCTURE
    float lineThickness = 0.005;
    float lines = smoothstep(lineThickness, 0.0, minLineDist);
    float lineGlow = glow(minLineDist, 25.0, 0.015);
    vec3 lineColor = palette(time * 0.15 + length(uv) * 0.3);
    col += lineColor * (lines * 1.2 + lineGlow * 0.6); // Increased line prominence

    // Draw circles with glow - REDUCE CIRCLE DOMINANCE
    float circleThickness = 0.004;
    float circles = smoothstep(circleThickness, 0.0, minCircleDist);
    float circleGlow = glow(minCircleDist, 35.0, 0.012);
    vec3 circleColor = palette(time * 0.2 + 0.3);
    col += circleColor * (circles * 0.4 + circleGlow * 0.15); // Reduced circle intensity

    // Glow at center point - REDUCED
    float centerDist = length(uv - center0);
    float pointGlow = 0.008 / (centerDist * centerDist + 0.001);
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    vec3 pointColor = palette(time * 0.25);
    col += pointColor * pointGlow * pulse * 0.25; // Reduced center point glow

    // Glow at inner ring points - SUBTLE
    for(int i = 0; i < 6; i++) {
        float ang = float(i) * 3.14159265 / 3.0;
        vec2 center = vec2(cos(ang), sin(ang)) * r;
        float pointDist = length(uv - center);
        pointGlow = 0.008 / (pointDist * pointDist + 0.001);
        pulse = sin(time * 2.0 + float(i) * 0.5) * 0.5 + 0.5;
        pointColor = palette(time * 0.25 + float(i) * 0.08);
        col += pointColor * pointGlow * pulse * 0.25; // Reduced point glow
    }

    // Glow at outer ring points - SUBTLE
    for(int i = 0; i < 6; i++) {
        float ang = float(i) * 3.14159265 / 3.0 + 3.14159265 / 6.0;
        vec2 center = vec2(cos(ang), sin(ang)) * r * 1.732;
        float pointDist = length(uv - center);
        pointGlow = 0.008 / (pointDist * pointDist + 0.001);
        pulse = sin(time * 2.0 + float(i + 6) * 0.5) * 0.5 + 0.5;
        pointColor = palette(time * 0.25 + float(i + 6) * 0.08);
        col += pointColor * pointGlow * pulse * 0.25; // Reduced point glow
    }

    // Add center glow - MUCH REDUCED
    float centerGlow = 0.008 / (centerDist * centerDist + 0.002);
    vec3 centerColor = vec3(1.0, 0.95, 0.9);
    col += centerColor * centerGlow * 0.15; // Significantly reduced center glow

    // Vignette for depth and focus
    float vignette = 1.0 - length(uv * 0.45);
    vignette = smoothstep(0.0, 1.0, vignette);
    col *= vignette;

    // Subtle pulsing overall brightness
    col *= 1.0 + sin(time * 0.5) * 0.1;

    fragColor = vec4(col, 1.0);
}
`;

export default function MetatronsCubePage() {
  return (
    <ShaderLayout>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <ShadertoyRenderer
          fragmentShader={METATRONS_CUBE_SHADER}
          className="h-full w-full"
        />

        {/* Content Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-6 p-8 text-center">
            <h1 className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent">
              Metatron&apos;s Cube
            </h1>
            <p className="text-xl text-white/80">
              Sacred geometry containing all five Platonic solids and the
              blueprint of creation
            </p>
          </div>
        </div>
      </div>
    </ShaderLayout>
  );
}
