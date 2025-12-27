"use client";

export const dynamic = "force-dynamic";

import { ShaderLayout } from "~/components/shaders/shader-layout";
import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

// The Way shader code
const THE_WAY_SHADER = `
// The Way - A journey through flowing light and consciousness

// Smooth color palette for the path
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
}

// Noise function for organic flow
float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
}

// Smooth flowing noise
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}

// Create flowing river-like paths
float flowingPath(vec2 p, float time) {
    // Create multiple layers of flowing paths
    float path = 0.0;

    // Main central path - the way
    vec2 flow = p;
    flow.x += sin(p.y * 2.0 + time) * 0.3;
    flow.y += cos(p.x * 1.5 + time * 0.7) * 0.2;

    // Distance from center creates the path
    float dist = length(flow);

    // Add flowing noise for organic movement
    float flowNoise = fbm(flow * 2.0 + time * 0.1);
    dist += flowNoise * 0.2;

    // Create bands/rings along the path
    float bands = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;

    return bands;
}

// Spiral paths converging to center
float spiralPath(vec2 p, float time) {
    float angle = atan(p.y, p.x);
    float radius = length(p);

    // Create spiral
    float spiral = sin(angle * 3.0 + radius * 10.0 - time * 2.0);

    // Multiple spirals
    float spiral2 = sin(angle * 5.0 - radius * 8.0 + time * 1.5);

    return (spiral + spiral2) * 0.5;
}

// Tunnel effect - the journey inward
float tunnel(vec2 p, float time) {
    float radius = length(p);
    float angle = atan(p.y, p.x);

    // Rotating tunnel
    float t = angle / 6.28318 + time * 0.2;
    float rings = sin((1.0 / radius) * 10.0 - time * 3.0) * 0.5 + 0.5;

    // Add rotation segments
    float segments = sin(angle * 8.0 + time) * 0.5 + 0.5;

    return rings * segments;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalize coordinates
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float time = iTime * 0.5;

    // Zoom pulsation - breathing effect
    float zoom = 2.0 + sin(time * 0.5) * 0.3;
    uv *= zoom;

    // Rotate the entire scene
    float rotAngle = time * 0.1;
    float c = cos(rotAngle);
    float s = sin(rotAngle);
    mat2 rot = mat2(c, -s, s, c);
    uv = rot * uv;

    vec3 col = vec3(0.0);

    // Layer 1: Flowing paths
    float flow = flowingPath(uv, time);
    vec3 flowColor = palette(time * 0.1 + length(uv) * 0.3);
    col += flowColor * flow * 0.5;

    // Layer 2: Spiral convergence
    float spiral = spiralPath(uv, time);
    vec3 spiralColor = palette(time * 0.15 + spiral * 0.5);
    col += spiralColor * max(spiral, 0.0) * 0.4;

    // Layer 3: Tunnel/journey inward
    float tunnelEffect = tunnel(uv, time);
    vec3 tunnelColor = palette(time * 0.2 + tunnelEffect);
    col += tunnelColor * tunnelEffect * 0.6;

    // Add glow at center - the destination
    float centerGlow = 1.0 / (length(uv) * 3.0 + 1.0);
    vec3 centerColor = vec3(1.0, 0.9, 0.7); // Warm enlightenment glow
    col += centerColor * centerGlow * 0.5;

    // Radial glow from center
    float radialGlow = exp(-length(uv) * 0.5);
    col += vec3(0.2, 0.3, 0.5) * radialGlow * 0.3;

    // Add flowing particles along the path
    vec2 particleUV = uv * 5.0;
    particleUV.y += time;
    float particles = sin(particleUV.x * 20.0) * sin(particleUV.y * 20.0);
    particles = pow(max(particles, 0.0), 30.0);
    col += vec3(particles) * 0.8;

    // Vignette for depth
    float vignette = 1.0 - length(uv * 0.4);
    vignette = smoothstep(0.0, 1.0, vignette);
    col *= vignette;

    // Add subtle color shifting over time
    col *= 1.0 + sin(time * 0.3) * 0.1;

    fragColor = vec4(col, 1.0);
}
`;

export default function TheWayPage() {
  return (
    <ShaderLayout>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <ShadertoyRenderer
          fragmentShader={THE_WAY_SHADER}
          className="h-full w-full"
        />

        {/* Content Overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-2xl space-y-6 p-8 text-center">
            <h1 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-5xl font-bold text-transparent">
              The Way
            </h1>
            <p className="text-xl text-white/80">
              A journey through flowing light, spiraling paths, and infinite
              consciousness
            </p>
          </div>
        </div>
      </div>
    </ShaderLayout>
  );
}
