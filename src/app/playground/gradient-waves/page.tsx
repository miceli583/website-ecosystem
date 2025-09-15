"use client";

import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";

export default function GradientWavesPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="relative min-h-full overflow-hidden bg-black">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0">
            {/* Wave 1 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 animate-pulse"></div>

            {/* Wave 2 */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-violet-500/20 to-purple-500/20 transform scale-110"
              style={{
                animation: 'wave-float 8s ease-in-out infinite alternate',
              }}
            ></div>

            {/* Wave 3 */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-blue-500/15 transform scale-125"
              style={{
                animation: 'wave-float 12s ease-in-out infinite alternate-reverse',
              }}
            ></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-xl opacity-50 animate-bounce"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full blur-xl opacity-40" style={{ animation: 'float-slow 6s ease-in-out infinite' }}></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full blur-2xl opacity-30 transform -translate-x-1/2 -translate-y-1/2" style={{ animation: 'float-slow 10s ease-in-out infinite reverse' }}></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex min-h-full flex-col items-center justify-center p-8 text-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Gradient Waves
              </h1>
              <p className="text-xl text-gray-300">
                Flowing animated gradients with floating orbs creating a mesmerizing background effect
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-8">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white">
                  CSS Gradients
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white">
                  Keyframe Animations
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white">
                  Blur Effects
                </div>
              </div>
            </div>
          </div>

          {/* Custom Animations */}
          <style jsx>{`
            @keyframes wave-float {
              0% { transform: translateY(0px) rotate(0deg) scale(1); }
              50% { transform: translateY(-20px) rotate(3deg) scale(1.05); }
              100% { transform: translateY(10px) rotate(-2deg) scale(0.95); }
            }

            @keyframes float-slow {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-30px); }
            }
          `}</style>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}