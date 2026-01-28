// Orbit Star - Miracle Mind logo shader
// Two concentric rings, bowed square curves, swirling orbital paths, glowing center

float saturate(float x) { return clamp(x, 0.0, 1.0); }

// Signed distance to a circle ring
float sdRing(vec2 p, float r, float thickness) {
    return abs(length(p) - r) - thickness;
}

// Quadratic bezier curve distance (via sampling)
float sdBezierQuad(vec2 p, vec2 a, vec2 b, vec2 c) {
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

    // === BOWED SQUARE (four bezier curves connecting cardinal points) ===
    // Prominent overlay - the iconic shape from the logo
    float bowedR = 0.32;  // Slightly inside the rings
    float bowAmount = 0.12; // How much the curves bow outward

    // Cardinal points (rotated 45 degrees so corners point to diagonals)
    float sq = 0.7071; // sqrt(2)/2
    vec2 topRight = vec2(sq, -sq) * bowedR;
    vec2 bottomRight = vec2(sq, sq) * bowedR;
    vec2 bottomLeft = vec2(-sq, sq) * bowedR;
    vec2 topLeft = vec2(-sq, -sq) * bowedR;

    // Control points (bowed outward along cardinal directions)
    vec2 ctrlTop = vec2(0.0, -(bowedR + bowAmount));
    vec2 ctrlRight = vec2(bowedR + bowAmount, 0.0);
    vec2 ctrlBottom = vec2(0.0, bowedR + bowAmount);
    vec2 ctrlLeft = vec2(-(bowedR + bowAmount), 0.0);

    // Slow rotation for the bowed square
    float bowAngle = time * 0.1;
    float bc = cos(bowAngle), bs = sin(bowAngle);
    mat2 bowRot = mat2(bc, -bs, bs, bc);
    vec2 uvBow = bowRot * uv;

    // Distance to each curved segment (corner to corner, bowing outward)
    float d1 = sdBezierQuad(uvBow, topLeft, ctrlTop, topRight);
    float d2 = sdBezierQuad(uvBow, topRight, ctrlRight, bottomRight);
    float d3 = sdBezierQuad(uvBow, bottomRight, ctrlBottom, bottomLeft);
    float d4 = sdBezierQuad(uvBow, bottomLeft, ctrlLeft, topLeft);

    float bowedSquareDist = min(min(d1, d2), min(d3, d4));

    // Solid core line
    float lineWidth = 0.012;
    float coreLine = smoothstep(lineWidth, lineWidth * 0.3, bowedSquareDist);

    // Outer glow
    float outerGlowBow = saturate(0.025 / (bowedSquareDist + 0.008)) * breathe;

    // Inner bright glow
    float innerGlowBow = saturate(0.008 / (bowedSquareDist + 0.002));

    // Energy pulse traveling along the bowed square
    float angle = atan(uvBow.y, uvBow.x);
    float travelPulse = sin(angle * 4.0 - time * 2.0) * 0.3 + 0.7;

    // Combine: solid gold core + glow
    col += goldLight * coreLine * 0.9;
    col += goldMid * outerGlowBow * travelPulse;
    col += goldLight * innerGlowBow * 0.5;

    // === ORBITAL SWIRL ARCS (rotating opposite direction) ===
    float arcIntensity = 0.0;

    for (int i = 0; i < 4; i++) {
        float startAngle = float(i) * 1.5708; // 90 degrees apart

        // Rotate point (opposite direction from bowed square)
        float a = startAngle - time * 0.2;
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
    col += mix(goldMid, goldLight, 0.5) * arcIntensity * breathe * energy * 0.8;

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
    float ambientGlow = saturate(0.08 / (r + 0.15)) * 0.12;
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
