"use client";

import { ShaderLayout } from "~/components/shaders/shader-layout";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

// Icosahedron shader code - WebGL compatible (no dynamic array indexing)
const ICOSAHEDRON_SHADER = `
// Icosahedron - Floating 3D Platonic Solid
// Wireframe visualization with glowing edges

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.3, 0.2, 0.5);
    return a + b * cos(6.28318 * (c * t + d));
}

// 3D rotation matrix
mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

// Project 3D point to 2D screen space
vec2 project(vec3 p, float fov) {
    float z = p.z + 4.0; // Distance from camera
    return p.xy / (z * fov);
}

// Distance from point to line segment
float distanceToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float time = iTime * 0.5;

    // Golden ratio for icosahedron vertices
    float phi = 1.618033988749895;
    float scale = 1.2;

    // 12 vertices of an icosahedron (normalized and scaled)
    vec3 v0 = normalize(vec3(0.0, 1.0, phi)) * scale;
    vec3 v1 = normalize(vec3(0.0, -1.0, phi)) * scale;
    vec3 v2 = normalize(vec3(0.0, 1.0, -phi)) * scale;
    vec3 v3 = normalize(vec3(0.0, -1.0, -phi)) * scale;
    vec3 v4 = normalize(vec3(1.0, phi, 0.0)) * scale;
    vec3 v5 = normalize(vec3(-1.0, phi, 0.0)) * scale;
    vec3 v6 = normalize(vec3(1.0, -phi, 0.0)) * scale;
    vec3 v7 = normalize(vec3(-1.0, -phi, 0.0)) * scale;
    vec3 v8 = normalize(vec3(phi, 0.0, 1.0)) * scale;
    vec3 v9 = normalize(vec3(-phi, 0.0, 1.0)) * scale;
    vec3 v10 = normalize(vec3(phi, 0.0, -1.0)) * scale;
    vec3 v11 = normalize(vec3(-phi, 0.0, -1.0)) * scale;

    // Rotation matrices
    mat3 rot = rotateY(time * 0.7) * rotateX(time * 0.5) * rotateZ(time * 0.3);

    // Floating motion
    float floatY = sin(time * 0.8) * 0.15;

    // Apply rotation and floating, then project to 2D
    vec2 p0 = project(rot * v0 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p1 = project(rot * v1 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p2 = project(rot * v2 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p3 = project(rot * v3 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p4 = project(rot * v4 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p5 = project(rot * v5 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p6 = project(rot * v6 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p7 = project(rot * v7 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p8 = project(rot * v8 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p9 = project(rot * v9 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p10 = project(rot * v10 + vec3(0.0, floatY, 0.0), 0.5);
    vec2 p11 = project(rot * v11 + vec3(0.0, floatY, 0.0), 0.5);

    vec3 col = vec3(0.0);

    // Background gradient
    float bgGradient = length(uv) * 0.5;
    col += palette(bgGradient + time * 0.1) * 0.15;

    // Draw all 30 edges
    float minDist = 1e10;
    minDist = min(minDist, distanceToSegment(uv, p0, p1));
    minDist = min(minDist, distanceToSegment(uv, p0, p4));
    minDist = min(minDist, distanceToSegment(uv, p0, p5));
    minDist = min(minDist, distanceToSegment(uv, p0, p8));
    minDist = min(minDist, distanceToSegment(uv, p0, p9));
    minDist = min(minDist, distanceToSegment(uv, p1, p6));
    minDist = min(minDist, distanceToSegment(uv, p1, p7));
    minDist = min(minDist, distanceToSegment(uv, p1, p8));
    minDist = min(minDist, distanceToSegment(uv, p1, p9));
    minDist = min(minDist, distanceToSegment(uv, p2, p3));
    minDist = min(minDist, distanceToSegment(uv, p2, p4));
    minDist = min(minDist, distanceToSegment(uv, p2, p5));
    minDist = min(minDist, distanceToSegment(uv, p2, p10));
    minDist = min(minDist, distanceToSegment(uv, p2, p11));
    minDist = min(minDist, distanceToSegment(uv, p3, p6));
    minDist = min(minDist, distanceToSegment(uv, p3, p7));
    minDist = min(minDist, distanceToSegment(uv, p3, p10));
    minDist = min(minDist, distanceToSegment(uv, p3, p11));
    minDist = min(minDist, distanceToSegment(uv, p4, p5));
    minDist = min(minDist, distanceToSegment(uv, p4, p8));
    minDist = min(minDist, distanceToSegment(uv, p4, p10));
    minDist = min(minDist, distanceToSegment(uv, p5, p9));
    minDist = min(minDist, distanceToSegment(uv, p5, p11));
    minDist = min(minDist, distanceToSegment(uv, p6, p7));
    minDist = min(minDist, distanceToSegment(uv, p6, p8));
    minDist = min(minDist, distanceToSegment(uv, p6, p10));
    minDist = min(minDist, distanceToSegment(uv, p7, p9));
    minDist = min(minDist, distanceToSegment(uv, p7, p11));
    minDist = min(minDist, distanceToSegment(uv, p8, p10));
    minDist = min(minDist, distanceToSegment(uv, p9, p11));

    // Edge rendering with glow
    float edgeThickness = 0.008;
    float edge = smoothstep(edgeThickness, 0.0, minDist);
    float edgeGlow = 0.005 / (minDist + 0.001);

    vec3 edgeColor = palette(time * 0.2 + minDist * 2.0);
    col += edgeColor * (edge * 1.5 + edgeGlow * 0.4);

    // Draw vertices with glow - unrolled loop
    float d, vertexGlow, pulse;
    vec3 pointColor;

    d = length(uv - p0);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0) * 0.5 + 0.5;
    pointColor = palette(time * 0.3);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p1);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 0.5) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.1);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p2);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 1.0) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.2);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p3);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 1.5) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.3);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p4);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 2.0) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.4);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p5);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 2.5) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.5);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p6);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 3.0) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.6);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p7);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 3.5) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.7);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p8);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 4.0) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.8);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p9);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 4.5) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 0.9);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p10);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 5.0) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 1.0);
    col += pointColor * vertexGlow * pulse * 0.3;

    d = length(uv - p11);
    vertexGlow = 0.008 / (d * d + 0.001);
    pulse = sin(time * 2.0 + 5.5) * 0.5 + 0.5;
    pointColor = palette(time * 0.3 + 1.1);
    col += pointColor * vertexGlow * pulse * 0.3;

    // Center glow
    float centerDist = length(uv);
    float centerGlow = 0.3 / (centerDist * centerDist * 10.0 + 1.0);
    col += palette(time * 0.15) * centerGlow * 0.2;

    // Vignette
    float vignette = 1.0 - length(uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    col *= vignette;

    // Color variation
    col *= 1.0 + sin(time * 0.4) * 0.1;

    fragColor = vec4(col, 1.0);
}
`;

export default function IcosahedronPage() {
  return (
    <ShaderLayout>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <ShadertoyRenderer
          fragmentShader={ICOSAHEDRON_SHADER}
          className="h-full w-full"
        />

        {/* Content Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-6 p-8 text-center">
            <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-5xl font-bold text-transparent">
              Icosahedron
            </h1>
            <p className="text-xl text-white/80">
              Floating 3D Platonic solid with 20 triangular faces, rotating in
              space
            </p>
          </div>
        </div>
      </div>
    </ShaderLayout>
  );
}
