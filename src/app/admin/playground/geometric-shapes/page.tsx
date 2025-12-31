"use client";
import { Suspense } from "react";

import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";

export const dynamic = "force-dynamic";

function GeometricShapesPageContent() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
          {/* Animated SVG Background */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Rotating Triangles */}
            <polygon
              points="200,100 350,350 50,350"
              fill="url(#grad1)"
              transform="rotate(0 200 267)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 200 267"
                to="360 200 267"
                dur="20s"
                repeatCount="indefinite"
              />
            </polygon>

            <polygon
              points="800,200 900,400 700,400"
              fill="url(#grad2)"
              transform="rotate(0 800 333)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 800 333"
                to="-360 800 333"
                dur="15s"
                repeatCount="indefinite"
              />
            </polygon>

            {/* Scaling Circles */}
            <circle cx="150" cy="600" r="50" fill="url(#grad3)">
              <animate
                attributeName="r"
                values="50;100;50"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.7;0.3"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="850" cy="700" r="75" fill="url(#grad1)">
              <animate
                attributeName="r"
                values="75;125;75"
                dur="12s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Morphing Rectangles */}
            <rect
              x="400"
              y="100"
              width="200"
              height="100"
              fill="url(#grad2)"
              rx="20"
            >
              <animate
                attributeName="width"
                values="200;300;200"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="height"
                values="100;150;100"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="20;50;20"
                dur="10s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Floating Hexagons */}
            <polygon
              points="500,500 550,525 550,575 500,600 450,575 450,525"
              fill="url(#grad3)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values="0,0; 20,-20; 0,0; -20,20; 0,0"
                dur="6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="6s"
                repeatCount="indefinite"
              />
            </polygon>

            <polygon
              points="300,750 350,775 350,825 300,850 250,825 250,775"
              fill="url(#grad1)"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="translate"
                values="0,0; -15,15; 0,0; 15,-15; 0,0"
                dur="8s"
                repeatCount="indefinite"
              />
            </polygon>

            {/* Pulsing Stars */}
            <path
              d="M 700,500 L 710,520 L 730,520 L 716,535 L 720,555 L 700,545 L 680,555 L 684,535 L 670,520 L 690,520 Z"
              fill="url(#grad2)"
            >
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="4s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="scale"
                values="1;1.5;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-5xl font-bold text-transparent">
                Geometric Shapes
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Animated SVG patterns with rotating, scaling, and morphing
                geometric elements
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="rounded-full border border-orange-200 bg-orange-100/80 px-6 py-3 text-orange-800 backdrop-blur-sm dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
                  SVG Animations
                </div>
                <div className="rounded-full border border-amber-200 bg-amber-100/80 px-6 py-3 text-amber-800 backdrop-blur-sm dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                  Geometric Patterns
                </div>
                <div className="rounded-full border border-yellow-200 bg-yellow-100/80 px-6 py-3 text-yellow-800 backdrop-blur-sm dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">
                  Transform Effects
                </div>
              </div>
            </div>
          </div>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}

export default function GeometricShapesPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <GeometricShapesPageContent />
    </Suspense>
  );
}
