// Electric Mycelial Network - Delicate web of interconnected threads
// Inspired by real fungal mycelium networks

// Hash functions for randomness
float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(vec2(p.x * p.y, p.y * p.x));
}

// Distance to line segment
float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

// Smooth curve between two points using cubic bezier
vec2 bezierPoint(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
    float t2 = t * t;
    float t3 = t2 * t;
    float mt = 1.0 - t;
    float mt2 = mt * mt;
    float mt3 = mt2 * mt;

    return mt3 * p0 +
           3.0 * mt2 * t * p1 +
           3.0 * mt * t2 * p2 +
           t3 * p3;
}

// Distance to bezier curve (approximated)
float sdBezier(vec2 pos, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
    float minDist = 10000.0;
    vec2 prev = p0;

    for(float i = 1.0; i <= 20.0; i++) {
        float t = i / 20.0;
        vec2 curr = bezierPoint(p0, p1, p2, p3, t);
        float d = sdSegment(pos, prev, curr);
        minDist = min(minDist, d);
        prev = curr;
    }

    return minDist;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float t = iTime;

    // Generate network nodes distributed across screen and beyond
    const int NUM_NODES = 36;
    vec2 nodes[NUM_NODES];

    // Grid that extends off-screen with good density
    int idx = 0;
    for(int y = 0; y < 6; y++) {
        for(int x = 0; x < 6; x++) {
            vec2 gridPos = vec2(float(x) - 2.5, float(y) - 2.5) * 0.38;
            // Random offset for organic spread
            vec2 offset = (hash22(gridPos * 10.0) - 0.5) * 0.28;
            nodes[idx] = gridPos + offset;
            idx++;
        }
    }

    float minDist = 10000.0;
    float pulseGlow = 0.0;

    // Draw connections between nearby nodes with smooth curves
    for(int i = 0; i < NUM_NODES; i++) {
        vec2 nodeA = nodes[i];

        for(int j = i + 1; j < NUM_NODES; j++) {
            vec2 nodeB = nodes[j];
            float dist = length(nodeA - nodeB);

            // Connect nearby nodes with good balance
            if(dist > 0.25 && dist < 0.6) {
                // Create control points for bezier curve
                vec2 midpoint = (nodeA + nodeB) * 0.5;
                vec2 perpendicular = normalize(vec2(-(nodeB.y - nodeA.y), nodeB.x - nodeA.x));

                // Random curve amount
                float curveAmount = (hash21(nodeA + nodeB * 10.0) - 0.5) * 0.15;
                vec2 control1 = mix(nodeA, midpoint, 0.5) + perpendicular * curveAmount;
                vec2 control2 = mix(midpoint, nodeB, 0.5) - perpendicular * curveAmount * 0.8;

                // Distance to curved connection
                float d = sdBezier(uv, nodeA, control1, control2, nodeB);
                minDist = min(minDist, d);

                // Pulses traveling along connections - tighter glow
                float pulseSpeed = 0.3 + hash21(vec2(float(i), float(j))) * 0.2;
                float pulseOffset = hash21(vec2(float(i) * 100.0, float(j))) * 10.0;

                for(float p = 0.0; p < 2.0; p++) {
                    float pulseT = fract((t * pulseSpeed + pulseOffset + p * 0.5) * 0.2);
                    vec2 pulsePos = bezierPoint(nodeA, control1, control2, nodeB, pulseT);
                    float pulseDist = length(uv - pulsePos);
                    // Subtle pulse glow
                    pulseGlow += 0.0012 / (pulseDist * pulseDist + 0.01);
                }
            }
        }

        // Node glow - subtle
        float nodeDist = length(uv - nodeA);
        pulseGlow += 0.0015 / (nodeDist * nodeDist + 0.04) * (sin(t * 1.5 + float(i) * 0.5) * 0.4 + 0.6);
    }

    // Thin crisp lines
    float line = smoothstep(0.003, 0.0, minDist);
    // Very subtle line glow
    float lineGlow = 0.0001 / (minDist + 0.003);

    // Color scheme - cyan/green like the reference
    vec3 lineColor = vec3(0.2, 0.8, 0.6);    // Cyan-green
    vec3 pulseColor = vec3(0.5, 1.0, 0.8);   // Bright cyan-green for pulses
    vec3 accentColor = vec3(0.6, 1.0, 0.8);  // Light cyan

    // Combine
    vec3 col = vec3(0.0);
    col += lineColor * (line * 0.9 + lineGlow * 0.2);
    // Subtle pulses
    col += pulseColor * pulseGlow * 0.3;

    // Subtle color variation
    col = mix(col, accentColor * 0.6, sin(length(uv) * 5.0 + t * 0.5) * 0.1 + 0.1);

    // Dark blue background with subtle texture
    vec3 bgColor = vec3(0.02, 0.05, 0.1);
    float bgNoise = hash21(uv * 100.0) * 0.02;
    col += bgColor + bgNoise;

    // Vignette
    float vignette = 1.0 - length(uv * 0.55);
    vignette = smoothstep(0.0, 1.0, vignette);
    col *= vignette * 0.9 + 0.1;

    fragColor = vec4(col, 1.0);
}
