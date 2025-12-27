"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef } from "react";
import { DomainLayout } from "~/components/domain-layout";
import { ShaderLayout } from "~/components/shaders/shader-layout";

export default function FractalNoisePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader - Simple fractal noise
    const fragmentShaderSource = `
      precision highp float;
      uniform float time;
      uniform vec2 resolution;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / resolution.xy;
        st.x *= resolution.x / resolution.y;

        vec2 pos = st * 3.0 + time * 0.1;
        float n = fbm(pos);

        vec3 color = vec3(n);
        color = mix(vec3(0.1, 0.0, 0.2), vec3(0.8, 0.3, 0.9), n);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shaders
    function compileShader(
      glContext: WebGLRenderingContext,
      source: string,
      type: number
    ) {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error(
          "Shader compile error:",
          glContext.getShaderInfoLog(shader)
        );
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER
    );
    const fragmentShader = compileShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "time");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");

    // Animation loop
    let startTime = Date.now();
    function render() {
      if (!gl || !canvas) return;
      const time = (Date.now() - startTime) / 1000;

      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }
    render();

    // Handle resize
    const handleResize = () => {
      if (!gl || !canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DomainLayout>
      <ShaderLayout>
        <div className="relative h-screen w-full overflow-hidden bg-black">
          <canvas ref={canvasRef} className="h-full w-full" />

          {/* Content Overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="max-w-2xl space-y-6 p-8 text-center">
              <h1 className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
                Fractal Noise
              </h1>
              <p className="text-xl text-white/80">
                Procedural noise patterns generated with fractal Brownian motion
              </p>
            </div>
          </div>
        </div>
      </ShaderLayout>
    </DomainLayout>
  );
}
