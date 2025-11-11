"use client";

import { ShadertoyRenderer } from "~/components/shaders/shadertoy-renderer";

/**
 * Flower of Life Shader - Embed Route (Public, No Auth)
 *
 * This is a public embed route specifically for use in iframes on landing pages.
 * Unlike /admin/shaders/flower-of-life/page.tsx, this has NO text overlay - just the shader.
 *
 * The admin version has navigation and text overlays, making it unsuitable for backgrounds.
 * This embed version is clean and perfect for background iframes.
 */

const SHADER_CODE = `// Flower of Life - Sacred Geometry Shader

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
}

// Distance to a circle
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Flower of Life pattern generator
float flowerOfLife(vec2 p, float scale, float time) {
    p *= scale;

    float r = 1.0; // Circle radius
    float minDist = 1e10;

    // Center circle
    minDist = min(minDist, abs(sdCircle(p, r)));

    // Six circles around the center (first ring)
    for(int i = 0; i < 6; i++) {
        float angle = float(i) * 3.14159265 / 3.0;
        vec2 offset = vec2(cos(angle), sin(angle)) * r;
        minDist = min(minDist, abs(sdCircle(p - offset, r)));
    }

    // Twelve circles in the second ring
    for(int i = 0; i < 12; i++) {
        float angle = float(i) * 3.14159265 / 6.0;
        vec2 offset = vec2(cos(angle), sin(angle)) * r * 1.732; // sqrt(3)
        minDist = min(minDist, abs(sdCircle(p - offset, r)));
    }

    // Add some animation - pulsating effect
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    minDist -= pulse * 0.05;

    return minDist;
}

// Create glowing effect
float glow(float d, float strength, float thickness) {
    return thickness / (d * strength);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized coordinates
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Animation
    float time = iTime * 0.3;

    // Rotate the entire pattern
    float angle = time * 0.2;
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    uv = rot * uv;

    // Add some zoom pulsation
    float zoom = 3.0 + sin(time) * 0.5;

    vec3 col = vec3(0.0);

    // Create multiple layers with different scales and colors
    for(float i = 1.0; i <= 3.0; i++) {
        float layerScale = zoom * i * 0.7;
        float layerTime = time * i;

        // Get distance to flower pattern
        float d = flowerOfLife(uv, layerScale, layerTime);

        // Create glowing lines
        float lineGlow = glow(d, 40.0 * i, 0.02);
        float innerGlow = glow(d, 10.0 * i, 0.1);

        // Color based on time and layer
        float colorShift = layerTime * 0.2 + i * 0.3;
        vec3 layerColor = palette(colorShift + length(uv) * 0.5);

        // Add the layer to the final color
        col += layerColor * (lineGlow + innerGlow * 0.3);
    }

    // Add a subtle vignette
    float vignette = 1.0 - length(uv * 0.5);
    vignette = smoothstep(0.0, 1.0, vignette);
    col *= vignette;

    // Add some sparkle/energy particles
    vec2 sparkleUV = uv * 10.0;
    sparkleUV += vec2(sin(time * 2.0), cos(time * 1.5));
    float sparkle = sin(sparkleUV.x * 20.0) * sin(sparkleUV.y * 20.0);
    sparkle = pow(max(sparkle, 0.0), 20.0);
    col += vec3(sparkle) * 0.3;

    // Output final color
    fragColor = vec4(col, 1.0);
}`;

export default function FlowerOfLifeEmbedPage() {
  return (
    <div className="h-screen w-screen">
      <ShadertoyRenderer fragmentShader={SHADER_CODE} />
    </div>
  );
}
