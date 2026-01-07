"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

export default function ResumePage() {
  useEffect(() => {
    document.title = "Matthew Miceli - Resume";
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 print:bg-white print:py-0">
        <div className="mx-auto max-w-4xl animate-fade-in-up">
          {/* Resume Container */}
          <div className="resume-container bg-white shadow-2xl print:shadow-none">
            {/* Header */}
            <header className="resume-header border-b-4 border-[#D4AF37] bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8 text-white print:border-b-2 print:bg-gray-900 print:py-6">
              <div className="flex items-start justify-between gap-6">
                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="mb-2 text-4xl font-bold tracking-tight print:text-3xl">
                    Matthew Miceli
                  </h1>
                  <p className="mb-4 text-xl text-gray-300 print:text-lg">
                    Systems Engineer
                  </p>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href="mailto:mmicel583@gmail.com" className="hover:text-[#D4AF37] transition-colors">
                        mmicel583@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+1 504-952-6225</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Austin, TX</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href="https://matthewmiceli.com" className="hover:text-[#D4AF37] transition-colors">
                        matthewmiceli.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#D4AF37] shadow-xl print:h-28 print:w-28 print:border-2">
                    <Image
                      src="/images/profile.jpg"
                      alt="Matthew Miceli"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="resume-content px-8 py-8 print:py-6">
              {/* Professional Summary */}
              <section className="resume-section mb-8">
                <h2 className="resume-section-title mb-3 border-b-2 border-[#D4AF37] pb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Cross-domain systems engineer with experience in satellite communications, IoT testing, and automation-driven workflows.
                  Core strength lies in bridging technical disciplines—connecting engineering and operations, translating complex concepts
                  across teams, and integrating insights from diverse domains into coherent solutions. Proven ability to design comprehensive
                  test frameworks for satellite IoT hardware, develop AI-driven applications, and automate complex engineering workflows using
                  Python scripting. Background spanning robotics (MS), satellite testing, and technical support enables rapid learning,
                  cross-functional collaboration, and optimization across domain boundaries. Seeking to return to Globalstar to apply
                  enhanced automation capabilities, data-driven analysis, and cross-domain integration skills to gateway engineering and
                  network performance optimization.
                </p>
              </section>

              {/* Professional Experience */}
              <section className="resume-section mb-8">
                <h2 className="resume-section-title mb-4 border-b-2 border-[#D4AF37] pb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  Professional Experience
                </h2>

                {/* The MathWorks */}
                <div className="resume-job mb-6 last:mb-0">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Application Support Engineer</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">The MathWorks</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">Jan 2022 - Sept 2023</p>
                      <p>Boston, MA</p>
                    </div>
                  </div>
                  <ul className="ml-5 list-disc space-y-1 text-gray-700">
                    <li>Provided real-time technical support to customers in Control Design, Signal Processing, and Robotics, translating complex technical concepts across engineering disciplines</li>
                    <li>Led R&D projects including AI-driven quadcopter training for acrobatic maneuvers using reinforcement learning and control systems</li>
                    <li>Built collision-aware robotic arm controller integrating MATLAB with third-party mapping tools, demonstrating cross-platform integration skills</li>
                    <li>Collaborated across departments to bridge customer needs with internal engineering capabilities</li>
                  </ul>
                </div>

                {/* Globalstar */}
                <div className="resume-job mb-6 last:mb-0">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Associate Test Engineer</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">Globalstar, Inc.</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">May 2020 - July 2021</p>
                      <p>Covington, LA</p>
                    </div>
                  </div>
                  <ul className="ml-5 list-disc space-y-1 text-gray-700">
                    <li>Designed and executed comprehensive test frameworks for satellite IoT communication devices</li>
                    <li>Collaborated across engineering, operations, and QA departments to develop integrated testing solutions, bridging technical requirements with operational constraints</li>
                    <li>Authored detailed QA documentation, technical specifications, and procedural test documentation for hardware validation</li>
                    <li>Led cross-functional test plan reviews, translating complex technical requirements across departments</li>
                    <li>Interfaced with embedded systems during IoT device testing</li>
                    <li>Conducted proactive data collection and performance analysis to identify system issues and optimization opportunities</li>
                    <li>Developed troubleshooting workflows and documented solutions for recurring operational challenges</li>
                  </ul>
                </div>

                {/* LSU Teaching Assistant */}
                <div className="resume-job mb-6 last:mb-0">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Teaching Assistant - Machine Design</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">Louisiana State University</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">Jan 2019 - Jan 2020</p>
                      <p>Baton Rouge, LA</p>
                    </div>
                  </div>
                  <ul className="ml-5 list-disc space-y-1 text-gray-700">
                    <li>Mentored 150+ engineering students in advanced machine design, fatigue analysis, and systems thinking</li>
                    <li>Developed curriculum materials and delivered technical lectures on mechanical systems</li>
                    <li>Provided one-on-one guidance on complex engineering problem-solving and design optimization</li>
                  </ul>
                </div>

                {/* Vector Marketing */}
                <div className="resume-job mb-6 last:mb-0">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Sales Manager</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">Vector Marketing Corporation</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">Summer 2017</p>
                      <p>Baton Rouge, LA</p>
                    </div>
                  </div>
                  <ul className="ml-5 list-disc space-y-1 text-gray-700">
                    <li>Led team of 25+ representatives, fostering collaborative culture and coordinating cross-functional activities</li>
                    <li>Developed and delivered comprehensive training programs on performance optimization and effective communication</li>
                  </ul>
                </div>
              </section>

              {/* Education */}
              <section className="resume-section mb-8">
                <h2 className="resume-section-title mb-4 border-b-2 border-[#D4AF37] pb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  Education
                </h2>

                <div className="resume-education mb-4 last:mb-0">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Master of Science in Robotics and Autonomous Systems</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">Boston University</p>
                      <p className="text-sm text-gray-600 mt-1">GPA: 3.76</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">Jan 2019 - Dec 2022</p>
                    </div>
                  </div>
                </div>

                <div className="resume-education mb-4 last:mb-0">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Bachelor of Science in Mechanical Engineering</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">Louisiana State University</p>
                      <p className="text-sm text-gray-600 mt-1">GPA: 3.99 • Summa Cum Laude</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">Aug 2016 - May 2020</p>
                    </div>
                  </div>
                </div>

                <div className="resume-education mb-4 last:mb-0">
                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Bachelor of Science in Computer Science</h3>
                      <p className="text-base font-semibold text-[#D4AF37]">Louisiana State University</p>
                      <p className="text-sm text-gray-600 mt-1">GPA: 3.99 • Summa Cum Laude</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-semibold">Jan 2017 - Dec 2020</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Core Competencies */}
              <section className="resume-section mb-8">
                <h2 className="resume-section-title mb-4 border-b-2 border-[#D4AF37] pb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  Core Competencies
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4">
                  <div className="text-gray-700">Cross-Functional Collaboration</div>
                  <div className="text-gray-700">Systems Architecture</div>
                  <div className="text-gray-700">Technical Communication</div>
                  <div className="text-gray-700">Process Optimization</div>
                  <div className="text-gray-700">Interdisciplinary Integration</div>
                  <div className="text-gray-700">Project Leadership</div>
                  <div className="text-gray-700">Problem-Solving</div>
                  <div className="text-gray-700">Team Training & Development</div>
                </div>
              </section>

              {/* Technical Skills */}
              <section className="resume-section mb-8">
                <h2 className="resume-section-title mb-4 border-b-2 border-[#D4AF37] pb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  Technical Skills
                </h2>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Programming & Scripting</h3>
                    <p className="text-gray-700">Python, MATLAB, Bash, JavaScript, C++</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Engineering Tools & Platforms</h3>
                    <p className="text-gray-700">MATLAB/Simulink, Control Design, Signal Processing, Git, JIRA</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Automation & Integration</h3>
                    <p className="text-gray-700">AI Workflows, Zapier, n8n, API Integration, Workflow Automation</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-bold text-gray-900">Domain Experience</h3>
                    <p className="text-gray-700">Satellite Communications, IoT Testing, Robotics, Networking Concepts, Data Analysis, Technical Documentation, Sales & Team Leadership</p>
                  </div>
                </div>
              </section>

              {/* Notable Projects */}
              <section className="resume-section">
                <h2 className="resume-section-title mb-4 border-b-2 border-[#D4AF37] pb-2 text-2xl font-bold text-gray-900 print:text-xl">
                  Notable Projects
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Banyan - AI-Assisted Life Operating System</h3>
                    <p className="text-sm text-gray-600 mb-1">Personal Project | 2025 - Present</p>
                    <p className="text-gray-700">
                      Developing an integrated system that connects habits, projects, finances, and wellbeing as interdependent
                      elements. Built using modern web technologies (Next.js, TypeScript, tRPC, PostgreSQL) with automated workflows
                      and AI-driven insights to bridge inspiration and execution across life domains.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">AI-Trained Quadcopter Acrobatics</h3>
                    <p className="text-sm text-gray-600 mb-1">The MathWorks R&D | 2022 - 2023</p>
                    <p className="text-gray-700">
                      Led research project training autonomous quadcopters to perform acrobatic maneuvers using reinforcement learning
                      and control systems in MATLAB/Simulink environment.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">Collision-Aware Robotic Arm Controller</h3>
                    <p className="text-sm text-gray-600 mb-1">The MathWorks | 2022 - 2023</p>
                    <p className="text-gray-700">
                      Designed and implemented real-time collision detection and path planning system for robotic manipulators,
                      integrating MATLAB with third-party mapping and visualization tools.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .resume-section {
          animation: fade-in-up 0.6s ease-out both;
        }

        .resume-section:nth-child(1) { animation-delay: 0.1s; }
        .resume-section:nth-child(2) { animation-delay: 0.2s; }
        .resume-section:nth-child(3) { animation-delay: 0.3s; }
        .resume-section:nth-child(4) { animation-delay: 0.4s; }
        .resume-section:nth-child(5) { animation-delay: 0.5s; }

        .resume-job,
        .resume-education {
          transition: all 0.2s ease;
        }

        .resume-job:hover,
        .resume-education:hover {
          transform: translateX(4px);
        }

        /* Print Styles */
        @media print {
          @page {
            margin: 0.25in;
            size: letter;
          }

          * {
            margin: 0 !important;
            padding: 0 !important;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            margin: 0 !important;
            padding: 0 !important;
          }

          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
          }

          .animate-fade-in-up,
          .resume-section {
            animation: none !important;
          }

          .resume-container {
            box-shadow: none !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .resume-header {
            background: linear-gradient(to right, #1f2937, #374151) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            padding: 0.75rem 1rem !important;
            margin: 0 !important;
          }

          .resume-header h1 {
            font-size: 1.75rem !important;
            margin-bottom: 0.25rem !important;
          }

          .resume-header p {
            margin-bottom: 0.5rem !important;
          }

          .resume-header .flex {
            gap: 0.75rem !important;
          }

          .resume-content {
            padding: 0.75rem 1rem !important;
            margin: 0 !important;
          }

          .resume-section {
            margin-bottom: 0.75rem !important;
            padding: 0 !important;
          }

          .resume-section-title {
            margin-bottom: 0.5rem !important;
            padding-bottom: 0.25rem !important;
            font-size: 1.1rem !important;
          }

          .resume-section p {
            line-height: 1.3 !important;
            margin-bottom: 0.25rem !important;
          }

          .resume-job,
          .resume-education {
            margin-bottom: 0.65rem !important;
            padding: 0 !important;
          }

          .resume-job .mb-2,
          .resume-education .mb-1 {
            margin-bottom: 0.25rem !important;
          }

          .resume-job h3,
          .resume-education h3 {
            font-size: 1rem !important;
            margin: 0 !important;
          }

          .resume-job p,
          .resume-education p {
            font-size: 0.875rem !important;
            margin: 0 !important;
          }

          .resume-job:hover,
          .resume-education:hover {
            transform: none !important;
          }

          .resume-job ul,
          .resume-education ul {
            margin-top: 0.25rem !important;
            margin-bottom: 0 !important;
            margin-left: 1.25rem !important;
            padding: 0 !important;
          }

          .resume-job li,
          .resume-education li {
            margin-bottom: 0.15rem !important;
            line-height: 1.3 !important;
            font-size: 0.85rem !important;
            padding: 0 !important;
          }

          /* Reduce spacing in skills grid */
          .grid {
            gap: 0.35rem !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .grid > div {
            margin: 0 !important;
            padding: 0 !important;
          }

          .grid h3 {
            font-size: 0.9rem !important;
            margin-bottom: 0.25rem !important;
          }

          .grid p {
            font-size: 0.825rem !important;
            line-height: 1.3 !important;
          }

          /* Profile picture */
          .resume-header img {
            width: 5rem !important;
            height: 5rem !important;
          }

          /* Prevent page breaks inside sections */
          .resume-section,
          .resume-job,
          .resume-education {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Ensure proper page breaks */
          h2 {
            page-break-after: avoid;
            break-after: avoid;
          }

          h3 {
            page-break-after: avoid;
            break-after: avoid;
          }
        }

        /* Hide print artifacts on screen */
        @media screen {
          .resume-container {
            border-radius: 0.5rem;
            overflow: hidden;
          }
        }
      `}</style>
    </>
  );
}
