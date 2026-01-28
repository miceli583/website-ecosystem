// Orbit Star - Miracle Mind logo shader
// Two concentric rings with swirling orbital paths and glowing center

float saturate(float x) { return clamp(x, 0.0, 1.0); }

// Signed distance to a circle ring
float sdRing(vec2 p, float r, float thickness) {
    return abs(length(p) - r) - thickness;
}

// Signed distance to a curved arc (bezier-like swirl)
float sdSwirl(vec2 p, float startAngle, float time) {
    // Rotate point to start angle
    float a = startAngle + time * 0.3;
    float c = cos(a), s = sin(a);
    vec2 rp = mat2(c, -s, s, c) * p;

    // Create curved path from outer to inner ring
    float outerR = 0.36;
    float innerR = 0.29;

    // Parametric curve following the swirl
    float angle = atan(rp.y, rp.x);
    float r = length(rp);

    // Swirl curve: radius decreases as angle increases (quarter turn)
    float targetAngle = mod(angle + 3.14159, 1.5708) - 0.7854; // Map to -45 to +45 degrees
    float targetR = mix(outerR, innerR, saturate((targetAngle + 0.7854) / 1.5708));

    // Distance to the curve
    float curveD = abs(r - targetR);

    // Only show in the quarter arc
    float angleMask = smoothstep(0.0, 0.1, targetAngle + 0.7854) * smoothstep(0.0, 0.1, 0.7854 - targetAngle);

    return curveD / max(angleMask, 0.01);
}

// Smooth orbital arc
float orbitalArc(vec2 p, float startAngle, float time) {
    float a = startAngle + time * 0.2;
    float c = cos(a), s = sin(a);
    vec2 rp = mat2(c, -s, s, c) * p;

    float angle = atan(rp.y, rp.x);
    float r = length(rp);

    // Arc parameters
    float outerR = 0.36;
    float innerR = 0.29;
    float midR = (outerR + innerR) * 0.5;

    // Curved path: starts at outer ring top, curves to inner ring right
    // Using a spiral-like function
    float t = (angle + 3.14159) / 6.28318; // 0 to 1 around circle
    t = mod(t + 0.25, 1.0); // Start from top

    // Only draw quarter arc
    if (t > 0.25) return 1000.0;

    // Interpolate radius along the arc
    float progress = t / 0.25;
    float targetR = mix(outerR, innerR, progress);

    // Add curve bulge
    float bulge = sin(progress * 3.14159) * 0.03;
    targetR += bulge;

    float d = abs(r - targetR);
    return d;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float time = iTime;

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
    float outerGlow = saturate(0.008 / (abs(outerRing) + 0.003)) * breathe;
    col += mix(goldMid, goldLight, saturate(1.0 - abs(outerRing) * 20.0)) * outerGlow;

    // === INNER RING (semi-transparent) ===
    float innerRing = sdRing(uv, 0.29, 0.006);
    float innerGlow = saturate(0.004 / (abs(innerRing) + 0.002)) * 0.55 * breathe;
    col += goldLight * innerGlow;

    // === ORBITAL SWIRL ARCS ===
    // Four curved paths at 90-degree intervals, slowly rotating
    float arcWidth = 0.018;
    float arcIntensity = 0.0;

    for (int i = 0; i < 4; i++) {
        float startAngle = float(i) * 1.5708; // 90 degrees apart

        // Rotate point
        float a = startAngle + time * 0.15;
        float c = cos(a), s = sin(a);
        vec2 rp = mat2(c, -s, s, c) * uv;

        float angle = atan(rp.y, rp.x);
        float pr = length(rp);

        // Normalize angle to 0-1
        float t = (angle + 3.14159) / 6.28318;
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

            float arc = saturate(0.006 / (d + 0.002)) * endFade;
            arcIntensity += arc;
        }
    }

    // Add traveling energy along arcs
    float energy = sin(time * 2.0) * 0.3 + 0.7;
    col += mix(goldMid, goldLight, 0.5) * arcIntensity * breathe * energy;

    // === CENTER GLOW ===
    float centerDot = saturate(0.015 / (r + 0.008)) * pulse;
    float centerHalo = saturate(0.003 / (r + 0.015)) * 0.6 * breathe;
    col += goldLight * centerDot;
    col += goldMid * centerHalo;

    // === ORBITING PARTICLES ===
    for (int i = 0; i < 3; i++) {
        float particleAngle = time * (0.4 + float(i) * 0.15) + float(i) * 2.094;
        float particleR = 0.32 + sin(time * 0.5 + float(i)) * 0.02;
        vec2 particlePos = vec2(cos(particleAngle), sin(particleAngle)) * particleR;
        float particleDist = length(uv - particlePos);
        float particle = saturate(0.003 / (particleDist + 0.001)) * 0.7;
        col += goldLight * particle * pulse;
    }

    // === AMBIENT GLOW ===
    float ambientGlow = saturate(0.08 / (r + 0.15)) * 0.15;
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
