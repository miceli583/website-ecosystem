"use client";

import { useEffect, useRef } from "react";

interface ShadertoyRendererProps {
  fragmentShader: string;
  className?: string;
}

export function ShadertoyRenderer({
  fragmentShader,
  className = "",
}: ShadertoyRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use proper WebGL context settings to match Shadertoy
    const gl = canvas.getContext("webgl", {
      alpha: false,
      premultipliedAlpha: false,
      antialias: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Set canvas size with proper pixel ratio handling
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    // Vertex shader (simple full-screen quad)
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Wrap the fragment shader to be compatible with Shadertoy format
    const wrappedFragmentShader = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec4 iMouse;

      ${fragmentShader}

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    // Compile shader
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
    const fragShader = compileShader(
      gl,
      wrappedFragmentShader,
      gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragShader) {
      console.error("Failed to compile shaders");
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Disable blending to prevent alpha compositing issues
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    // Set up geometry (full-screen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let mouseClick = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = canvas.height - e.clientY;
    };

    const handleMouseDown = () => {
      mouseClick = 1;
    };

    const handleMouseUp = () => {
      mouseClick = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Animation loop
    const startTime = Date.now();
    let animationFrameId: number;

    function render() {
      if (!gl || !canvas) return;
      const time = (Date.now() - startTime) / 1000;

      gl.uniform1f(iTimeLocation, time);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform4f(iMouseLocation, mouseX, mouseY, mouseClick, mouseClick);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    }
    render();

    // Handle resize
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fragmentShader]);

  return <canvas ref={canvasRef} className={className} />;
}
