"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  CheckCircle,
  ClipboardList,
  FileText,
  Clock,
  MessageSquare,
  Layers,
  ArrowRight,
  Home,
  List,
  Heart,
  Shield,
  Calendar,
  FolderOpen,
  Compass,
  Star,
  Sparkles,
  Brain,
  Handshake,
  TrendingUp,
  Lock,
  RefreshCw,
  Award,
  ChevronRight,
  ChevronUp,
  Play,
  Pause,
  Volume2,
} from "lucide-react";

// Brand colors
const colors = {
  primary: "#2E8A92", // teal
  primaryLight: "#3AA3AC",
  primaryDark: "#247078",
  secondary: "#C76A4A", // coral
  secondaryLight: "#D87F62",
  accent: "#D8A75F", // gold
  accentLight: "#E4BC7D",
  sage: "#7A8F66",
  sageLight: "#91A67E",
  background: "#E8D9C5", // cream
  backgroundDark: "#D9C9B4",
  text: "#1A1A1A",
  textLight: "#4A4A4A",
};

// Module 1 slide content with enhanced metadata
const slides = [
  {
    num: 1,
    title: "Organizational Skills Course Overview",
    content: "Organizational skills help Community Health Workers manage time, information, tasks, and responsibilities effectively. This course introduces foundational organizational practices that support reliable, ethical, and sustainable CHW work across Texas settings.",
    subtitle: "Part 1: Foundation",
    icon: "layers"
  },
  {
    num: 2,
    title: "Pre-Test (Knowledge Check Placeholder)",
    content: "This pre-test includes five questions assessing baseline understanding of organization, time management, and documentation concepts. A QR code will be added later.",
    subtitle: "Assess Your Starting Point"
  },
  {
    num: 3,
    title: "Learning Objective 1",
    content: "Learners will be able to explain why organizational skills are essential to effective Community Health Worker practice.",
    icon: "heart"
  },
  {
    num: 4,
    title: "Learning Objective 2",
    content: "Learners will be able to identify core organizational tasks commonly performed by CHWs in community and organizational settings.",
    icon: "clipboard"
  },
  {
    num: 5,
    title: "Learning Objective 3",
    content: "Learners will be able to recognize how organization supports accountability, follow-through, and trust with individuals and partners.",
    icon: "handshake"
  },
  {
    num: 6,
    title: "Learning Objective 4",
    content: "Learners will be able to describe basic strategies for organizing time, information, and responsibilities within CHW scope of practice.",
    icon: "calendar"
  },
  { num: 7, title: "Purpose of Organizational Skills", content: "Organizational skills support reliability and consistency. When CHWs stay organized, they are better able to follow through on commitments and support community trust.", keyPoints: ["Reliability", "Consistency", "Trust Building"] },
  { num: 8, title: "Organizational Skills as a Core Competency", content: "Organization is a core CHW competency because CHWs manage multiple responsibilities, relationships, and tasks across settings.", keyPoints: ["Multiple Responsibilities", "Diverse Relationships", "Varied Settings"] },
  { num: 9, title: "Module List", content: "This course includes modules on time management, task tracking, basic documentation, prioritization, and ethical organization practices.", modules: ["Time Management", "Task Tracking", "Documentation", "Prioritization", "Ethical Practices"] },
  { num: 10, title: "What Organization Looks Like in CHW Work", content: "Organization includes keeping track of appointments, referrals, information shared, and follow-up needs in a clear and respectful way.", examples: ["Appointments", "Referrals", "Shared Information", "Follow-up Needs"] },
  { num: 11, title: "Organization and Trust", content: "Community trust grows when CHWs are organized. Remembering details, following up, and being prepared shows respect and reliability.", keyPoints: ["Remember Details", "Follow Up", "Be Prepared"] },
  { num: 12, title: "Organization and Professional Boundaries", content: "Organization supports boundaries by helping CHWs manage workload, schedules, and expectations without overextending.", keyPoints: ["Manage Workload", "Control Schedule", "Set Expectations"] },
  { num: 13, title: "Common Organizational Responsibilities", content: "CHWs organize schedules, track referrals, document education, and manage communication with individuals and partners.", responsibilities: ["Schedule Management", "Referral Tracking", "Education Documentation", "Communication Management"] },
  { num: 14, title: "Time Management Basics", content: "Time management involves planning tasks, setting priorities, and using time intentionally to meet responsibilities.", keyPoints: ["Plan Tasks", "Set Priorities", "Use Time Intentionally"] },
  { num: 15, title: "Prioritizing Tasks", content: "Prioritization helps CHWs decide what needs attention first. Urgency, impact, and commitments guide priority decisions.", factors: ["Urgency", "Impact", "Commitments"] },
  { num: 16, title: "Managing Multiple Responsibilities", content: "CHWs often juggle outreach, documentation, and follow-up. Organization helps balance responsibilities without sacrificing quality." },
  { num: 17, title: "Organizing Information Ethically", content: "Ethical organization includes keeping information accurate, secure, and shared only as appropriate within role and policy.", principles: ["Accuracy", "Security", "Appropriate Sharing"] },
  { num: 18, title: "Case Example: Organized Follow-Up", content: "A CHW tracks referrals and schedules follow-up reminders to ensure individuals receive timely support.", scenario: "Maria, a CHW, uses a simple tracking system to ensure no community member falls through the cracks." },
  { num: 19, title: "Reflection Prompt: Organization Habits", content: "Reflect on your current organization habits. What helps you stay organized, and what feels challenging?", prompts: ["What systems do you currently use?", "What works well for you?", "Where do you struggle?"] },
  { num: 20, title: "Activity: Identifying Organizational Needs", content: "Participants identify common organizational challenges in their work and discuss simple strategies to address them.", instructions: ["Identify 3 organizational challenges", "Discuss with a partner", "Share one strategy with the group"] },
  { num: 21, title: "Organization and Daily Planning", content: "Daily planning helps CHWs manage time and responsibilities. Simple planning supports focus, follow-through, and reduced stress." },
  { num: 22, title: "Using Simple Planning Tools", content: "Planning tools may include calendars, checklists, or notebooks. CHWs choose tools that fit their work style and setting.", tools: ["Calendars", "Checklists", "Notebooks", "Digital Apps"] },
  { num: 23, title: "Organizing Appointments and Schedules", content: "Clear scheduling helps CHWs manage appointments and commitments. Organization reduces missed meetings and confusion." },
  { num: 24, title: "Tracking Follow-Up Tasks", content: "Follow-up tracking ensures continuity of support. CHWs use reminders or lists to remember next steps." },
  { num: 25, title: "Organizing Contacts and Resources", content: "CHWs maintain organized contact lists and resource information to provide timely referrals and support." },
  { num: 26, title: "Managing Information Overload", content: "Too much information can be overwhelming. CHWs organize information by relevance and purpose to stay focused." },
  { num: 27, title: "Organizing Paper and Digital Materials", content: "CHWs may use paper or digital systems. Clear labeling and consistent storage support easy access and accuracy." },
  { num: 28, title: "Organization and Confidentiality", content: "Organization supports confidentiality. CHWs store information securely and follow policies for access and sharing." },
  { num: 29, title: "Organizing Communication", content: "Clear organization of calls, messages, and emails helps CHWs respond appropriately and maintain professionalism." },
  { num: 30, title: "Time Blocking Basics", content: "Time blocking involves setting specific times for tasks. This helps CHWs manage competing responsibilities." },
  { num: 31, title: "Managing Interruptions", content: "Interruptions are common in CHW work. Organization helps CHWs return to tasks without losing track." },
  { num: 32, title: "Organizing Work Across Settings", content: "CHWs work in homes, offices, and community spaces. Portable organization tools support flexibility." },
  { num: 33, title: "Organization and Self-Care", content: "Good organization supports self-care. Clear boundaries and planning reduce overload and burnout." },
  { num: 34, title: "Common Organizational Challenges", content: "Challenges include competing priorities and limited time. Awareness helps CHWs choose realistic strategies." },
  { num: 35, title: "Case Example: Managing Multiple Referrals", content: "A CHW tracks referrals using a simple checklist to ensure follow-up and accurate communication.", scenario: "James manages 15 active referrals by reviewing his checklist each morning." },
  { num: 36, title: "Reflection: Organization Strengths", content: "Reflect on organizational strategies that work well for you. What helps you stay on track?", prompts: ["What is your greatest organizational strength?", "How can you build on it?"] },
  { num: 37, title: "Activity: Personal Organization Mapping", content: "Participants map daily tasks and identify where organization tools can improve workflow.", instructions: ["List your daily tasks", "Identify pain points", "Choose one tool to try"] },
  { num: 38, title: "Organization and Continuous Improvement", content: "Organization improves over time. CHWs adjust systems as responsibilities change." },
  { num: 39, title: "Preparing for Applied Organizational Skills", content: "This foundation prepares learners for applying organizational skills in real scenarios in Part 2." },
  { num: 40, title: "Part 1 Summary", content: "Organizational Skills — Part 1 introduced foundational practices for managing time, information, and responsibilities.", highlights: ["Core Competencies", "Time Management", "Task Tracking", "Ethical Practices"] },
  { num: 41, title: "Organization and Reliability", content: "Reliability depends on organization. When CHWs track tasks and follow through, individuals and partners experience consistent support." },
  { num: 42, title: "Organization and Professional Credibility", content: "Organized CHWs demonstrate professionalism. Preparedness and follow-through strengthen credibility with communities and organizations." },
  { num: 43, title: "Organization and Clear Communication", content: "Organization supports clear communication. Knowing next steps and details helps CHWs provide accurate information." },
  { num: 44, title: "Organizing Workload Expectations", content: "Clear organization helps manage expectations. CHWs communicate timelines and capacity honestly to avoid overcommitment." },
  { num: 45, title: "Organization and Ethical Practice", content: "Ethical practice includes managing information responsibly. Organization helps prevent errors and protect confidentiality." },
  { num: 46, title: "Organization and Accountability Systems", content: "Accountability systems include reminders, checklists, and documentation. These tools support consistent follow-through.", systems: ["Reminders", "Checklists", "Documentation", "Review Processes"] },
  { num: 47, title: "Organization Across Teams", content: "CHWs often work with teams. Organized communication and task tracking support collaboration and shared goals." },
  { num: 48, title: "Organization in High-Volume Work", content: "High workloads require simple systems. CHWs focus on efficiency without sacrificing quality or care." },
  { num: 49, title: "Organization and Adaptability", content: "Organized systems allow flexibility. CHWs adjust plans while keeping priorities visible." },
  { num: 50, title: "Organization and Self-Reflection", content: "Reflection helps improve organization. CHWs notice what systems work and make changes as needed." },
  { num: 51, title: "Reflection: Organization Impact", content: "Reflect on how organization affects your work. How does being organized support the people you serve?", prompts: ["How does organization help your clients?", "What would improve with better organization?"] },
  { num: 52, title: "Activity: Improving One System", content: "Participants identify one organizational system to improve and outline simple changes to try.", instructions: ["Choose one system to improve", "Identify specific changes", "Set a timeline to implement"] },
  { num: 53, title: "Preparing for Applied Organizational Skills", content: "Part 2 will focus on applying organizational skills in real-world CHW scenarios and workflows." },
  { num: 54, title: "Organizational Skills and Career Growth", content: "Strong organizational skills support career growth. CHWs demonstrate readiness for increased responsibility." },
  { num: 55, title: "Post-Test (Knowledge Check Placeholder)", content: "This post-test includes five questions assessing foundational organizational concepts. A QR code will be added later.", subtitle: "Measure Your Progress" },
  { num: 56, title: "Key Takeaways", content: "Organizational skills support reliability, accountability, and sustainability in CHW practice.", takeaways: ["Organization builds trust", "Systems support consistency", "Improvement is ongoing", "Self-care matters"] },
  { num: 57, title: "Closing Reflection", content: "Consider how improved organization can strengthen your CHW role and reduce stress." },
  { num: 58, title: "Part 1 Completion", content: "You have completed Organizational Skills — Part 1. This foundation supports applied organizational practice." },
  { num: 59, title: "Looking Ahead to Part 2", content: "Part 2 will focus on applying organizational skills to workflows, documentation, and coordination." },
  { num: 60, title: "Organizational Skills Foundation Summary", content: "Organizational Skills — Part 1 established core practices for managing time, information, and responsibilities effectively." },
  { num: 61, title: "Appendix and References", content: "References supporting this module include Texas DSHS CHW Core Competencies, CBPR and PAR literature, ethical evaluation frameworks, and professional standards published between 2020 and 2025. Full APA citations will be provided in the final appendix." },
];

// Slide type detection
type SlideType = "title" | "objective" | "test" | "content" | "case" | "reflection" | "activity" | "summary" | "appendix" | "moduleList";

function getSlideType(title: string, num: number): SlideType {
  const lower = title.toLowerCase();
  if (num === 1) return "title";
  if (lower.includes("objective")) return "objective";
  if (lower.includes("pre-test") || lower.includes("post-test")) return "test";
  if (lower.includes("case example")) return "case";
  if (lower.includes("reflection")) return "reflection";
  if (lower.includes("activity")) return "activity";
  if (lower.includes("module list")) return "moduleList";
  if (lower.includes("summary") || lower.includes("takeaway") || lower.includes("completion") || lower.includes("looking ahead") || lower.includes("key takeaways")) return "summary";
  if (lower.includes("appendix") || lower.includes("references")) return "appendix";
  return "content";
}

// Get objective icon based on number
function getObjectiveIcon(num: string) {
  const icons: Record<string, React.ElementType> = {
    "1": Heart,
    "2": ClipboardList,
    "3": Handshake,
    "4": Calendar,
  };
  return icons[num] || Target;
}

// Slide type configurations
const slideTypeConfig: Record<SlideType, {
  icon: React.ElementType;
  label: string;
  bgGradient: string;
  accentColor: string;
  iconBg: string;
  textColor: string;
  patternOpacity: string;
}> = {
  title: {
    icon: BookOpen,
    label: "Course Overview",
    bgGradient: "from-[#1a5a60] via-[#2E8A92] to-[#3AA3AC]",
    accentColor: "#D8A75F",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.08",
  },
  objective: {
    icon: Target,
    label: "Learning Objective",
    bgGradient: "from-[#5a7048] via-[#7A8F66] to-[#91A67E]",
    accentColor: "#E8D9C5",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.1",
  },
  test: {
    icon: ClipboardList,
    label: "Knowledge Check",
    bgGradient: "from-[#a85438] via-[#C76A4A] to-[#D87F62]",
    accentColor: "#E8D9C5",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.08",
  },
  content: {
    icon: FileText,
    label: "Key Concept",
    bgGradient: "from-[#1a5a60] via-[#2E8A92] to-[#3AA3AC]",
    accentColor: "#E8D9C5",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.06",
  },
  case: {
    icon: Users,
    label: "Case Study",
    bgGradient: "from-[#a85438] via-[#C76A4A] to-[#D87F62]",
    accentColor: "#E8D9C5",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.08",
  },
  reflection: {
    icon: Lightbulb,
    label: "Reflection",
    bgGradient: "from-[#c9954a] via-[#D8A75F] to-[#E4BC7D]",
    accentColor: "#1A1A1A",
    iconBg: "#2E8A92",
    textColor: "#1A1A1A",
    patternOpacity: "0.12",
  },
  activity: {
    icon: MessageSquare,
    label: "Activity",
    bgGradient: "from-[#5a7048] via-[#7A8F66] to-[#91A67E]",
    accentColor: "#E8D9C5",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.1",
  },
  summary: {
    icon: CheckCircle,
    label: "Summary",
    bgGradient: "from-[#1a5a60] via-[#2E8A92] to-[#3AA3AC]",
    accentColor: "#D8A75F",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.08",
  },
  appendix: {
    icon: Layers,
    label: "References",
    bgGradient: "from-gray-800 via-gray-700 to-gray-600",
    accentColor: "#E8D9C5",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.06",
  },
  moduleList: {
    icon: FolderOpen,
    label: "Course Modules",
    bgGradient: "from-[#1a5a60] via-[#2E8A92] to-[#3AA3AC]",
    accentColor: "#D8A75F",
    iconBg: "#D8A75F",
    textColor: "#ffffff",
    patternOpacity: "0.08",
  },
};

// Enhanced decorative patterns component
function SlidePattern({ type, opacity }: { type: SlideType; opacity: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {/* Geometric shapes */}
      {type === "title" && (
        <>
          {/* Large decorative circles */}
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full border-[20px] border-white/20" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full border-[16px] border-white/15" />
          <div className="absolute top-1/3 right-20 h-[200px] w-[200px] rotate-45 border-[8px] border-white/10" />
          {/* Floating dots */}
          <div className="absolute top-20 left-1/4 h-4 w-4 rounded-full bg-white/30" />
          <div className="absolute top-40 left-1/3 h-6 w-6 rounded-full bg-white/20" />
          <div className="absolute bottom-40 right-1/4 h-5 w-5 rounded-full bg-white/25" />
          {/* Accent lines */}
          <div className="absolute top-0 left-1/2 h-40 w-1 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="absolute bottom-0 right-1/3 h-32 w-1 bg-gradient-to-t from-white/20 to-transparent" />
        </>
      )}
      {type === "objective" && (
        <>
          <div className="absolute top-10 right-10 h-48 w-48 rounded-full border-[12px] border-white/15" />
          <div className="absolute bottom-20 left-20 h-32 w-32 rounded-full border-[8px] border-white/10" />
          <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full border-[8px] border-white/12" />
          {/* Target-like rings */}
          <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full border-4 border-white/20" />
          <div className="absolute top-1/2 right-1/4 translate-x-2 translate-y-2 h-16 w-16 rounded-full border-4 border-white/15" />
          {/* Diagonal lines */}
          <div className="absolute top-20 left-0 w-40 h-1 rotate-45 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </>
      )}
      {type === "test" && (
        <>
          {/* Quiz card shapes */}
          <div className="absolute top-1/4 right-16 h-32 w-24 rotate-12 border-4 border-white/20 rounded-2xl" />
          <div className="absolute bottom-1/4 left-16 h-40 w-32 -rotate-6 border-4 border-white/15 rounded-2xl" />
          <div className="absolute top-16 left-1/3 h-20 w-20 rotate-45 border-4 border-white/12" />
          {/* Checkmark decorations */}
          <div className="absolute bottom-32 right-1/3 h-16 w-8 border-b-4 border-r-4 border-white/20 rotate-45" />
          {/* Dots pattern */}
          <div className="absolute top-40 right-40 grid grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-white/20" />
            ))}
          </div>
        </>
      )}
      {type === "case" && (
        <>
          {/* Quote decoration */}
          <div className="absolute -top-8 right-1/4 text-[200px] font-serif text-white/10 leading-none">&ldquo;</div>
          <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full border-[12px] border-white/12" />
          {/* User silhouette shapes */}
          <div className="absolute bottom-20 right-20 h-20 w-20 rounded-full bg-white/08" />
          <div className="absolute bottom-10 right-24 h-16 w-24 rounded-t-full bg-white/08" />
        </>
      )}
      {type === "reflection" && (
        <>
          {/* Thought bubbles */}
          <div className="absolute top-24 right-24 h-32 w-32 rounded-full bg-black/08" />
          <div className="absolute bottom-40 left-24 h-24 w-24 rounded-full bg-black/06" />
          <div className="absolute top-1/2 left-1/3 h-16 w-16 rounded-full bg-black/05" />
          <div className="absolute top-1/3 right-1/3 h-12 w-12 rounded-full bg-black/07" />
          {/* Light rays */}
          <div className="absolute top-20 left-1/2 w-1 h-24 bg-gradient-to-b from-black/10 to-transparent rotate-12" />
          <div className="absolute top-24 left-[52%] w-1 h-20 bg-gradient-to-b from-black/08 to-transparent -rotate-12" />
          <div className="absolute top-28 left-[48%] w-1 h-16 bg-gradient-to-b from-black/06 to-transparent rotate-6" />
        </>
      )}
      {type === "activity" && (
        <>
          {/* Interactive elements */}
          <div className="absolute top-16 -right-16 h-56 w-56 rounded-full border-[10px] border-white/15" />
          <div className="absolute -bottom-16 left-16 h-44 w-44 rounded-full border-[8px] border-white/12" />
          <div className="absolute top-1/2 left-1/4 h-28 w-28 rounded-full border-[6px] border-white/10" />
          {/* Hand/gesture shapes */}
          <div className="absolute bottom-32 right-32 h-8 w-20 rounded-full bg-white/10 rotate-12" />
          {/* Dashed circles suggesting interaction */}
          <div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full border-4 border-dashed border-white/15" />
        </>
      )}
      {type === "summary" && (
        <>
          {/* Completion/achievement shapes */}
          <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full border-[16px] border-white/12" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full border-[20px] border-white/10" />
          {/* Checkmarks */}
          <div className="absolute top-40 right-40 h-12 w-6 border-b-4 border-r-4 border-white/20 rotate-45" />
          <div className="absolute bottom-48 left-48 h-8 w-4 border-b-4 border-r-4 border-white/15 rotate-45" />
          {/* Star shapes */}
          <div className="absolute top-1/4 right-1/3 w-16 h-16">
            <Sparkles className="w-full h-full text-white/15" />
          </div>
        </>
      )}
      {(type === "content" || type === "moduleList") && (
        <>
          <div className="absolute top-24 right-24 h-48 w-48 rounded-full border-[10px] border-white/12" />
          <div className="absolute bottom-24 left-16 h-40 w-40 rounded-full border-[8px] border-white/10" />
          {/* Grid pattern */}
          <div className="absolute top-1/2 right-1/3 grid grid-cols-4 gap-4 opacity-30">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-sm bg-white/20" />
            ))}
          </div>
          {/* Accent line */}
          <div className="absolute top-0 left-1/4 w-1 h-48 bg-gradient-to-b from-white/15 to-transparent" />
        </>
      )}
      {type === "appendix" && (
        <>
          <div className="absolute top-24 right-24 h-48 w-48 rounded-full border-[8px] border-white/10" />
          <div className="absolute bottom-24 left-16 h-40 w-40 rounded-full border-[6px] border-white/08" />
          {/* Book/document shapes */}
          <div className="absolute top-1/3 right-20 h-32 w-24 border-4 border-white/10 rounded-lg" />
          <div className="absolute top-1/3 right-24 h-32 w-24 border-4 border-white/08 rounded-lg" />
        </>
      )}

      {/* Universal subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

// Image placeholder component
function ImagePlaceholder({ description, className = "" }: { description: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/10 to-black/20 border-2 border-dashed border-white/30 ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
          <Sparkles className="h-6 w-6 text-white/60" />
        </div>
        <p className="text-sm text-white/60 font-medium">[AI-Generated Image]</p>
        <p className="text-xs text-white/40 mt-1">{description}</p>
      </div>
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

// Key point card component
function KeyPointCard({ point, index, icon: Icon }: { point: string; index: number; icon?: React.ElementType }) {
  const IconComponent = Icon || CheckCircle;
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-[#D8A75F] to-[#c9954a] flex items-center justify-center shadow-lg">
        <IconComponent className="h-6 w-6 text-white" />
      </div>
      <p className="text-lg font-medium text-white/90">{point}</p>
    </div>
  );
}

// Individual slide component
function Slide({
  slide,
  index,
  isActive,
  totalSlides,
}: {
  slide: (typeof slides)[0];
  index: number;
  isActive: boolean;
  totalSlides: number;
}) {
  const type = getSlideType(slide.title, slide.num);
  const config = slideTypeConfig[type];
  const Icon = config.icon;

  // Check if it's an objective slide to show the number
  const objectiveMatch = slide.title.match(/Learning Objective (\d+)/);
  const objectiveNum = objectiveMatch ? objectiveMatch[1] : null;
  const ObjectiveIcon = objectiveNum ? getObjectiveIcon(objectiveNum) : Target;

  return (
    <div
      id={`slide-${slide.num}`}
      className={`relative w-full min-h-screen bg-gradient-to-br ${config.bgGradient} transition-all duration-500`}
    >
      {/* Decorative pattern */}
      <SlidePattern type={type} opacity={config.patternOpacity} />

      {/* Content container - generous padding */}
      <div className="relative z-10 min-h-screen flex flex-col px-8 sm:px-16 lg:px-24 xl:px-32 py-12 lg:py-16">
        {/* Header row */}
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          {/* Type badge */}
          <div
            className="flex items-center gap-3 px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: config.iconBg }}
          >
            <Icon className="h-5 w-5 text-white" />
            <span className="text-sm font-bold text-white tracking-wide">{config.label}</span>
          </div>

          {/* Slide number */}
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: config.accentColor,
            }}
          >
            <span className="text-lg">{slide.num}</span>
            <span className="opacity-60">/</span>
            <span className="opacity-80">{totalSlides}</span>
          </div>
        </div>

        {/* Main content area - flex-1 to fill space */}
        <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
          {type === "title" ? (
            // Title slide layout - Hero style
            <div className="text-center space-y-8 lg:space-y-10">
              {/* Animated icon */}
              <div className="flex justify-center">
                <div
                  className="relative inline-flex items-center justify-center h-28 w-28 lg:h-36 lg:w-36 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Layers className="h-14 w-14 lg:h-18 lg:w-18 text-white" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent to-white/20" />
                </div>
              </div>

              {/* Main title */}
              <div className="space-y-4">
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none"
                  style={{ color: config.accentColor }}
                >
                  Organizational Skills
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/80 tracking-wide">
                  Part 1: Foundation
                </p>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-16 rounded-full" style={{ backgroundColor: config.accentColor }} />
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.accentColor }} />
                <div className="h-1 w-16 rounded-full" style={{ backgroundColor: config.accentColor }} />
              </div>

              {/* Description */}
              <p className="text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                {slide.content}
              </p>

              {/* Image placeholder */}
              <div className="pt-6">
                <ImagePlaceholder
                  description="CHW collaborating with community members in a warm, supportive setting"
                  className="h-48 lg:h-56 max-w-2xl mx-auto"
                />
              </div>
            </div>
          ) : type === "objective" && objectiveNum ? (
            // Objective slide layout - Timeline style
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Large number badge */}
              <div className="flex-shrink-0 relative">
                <div
                  className="flex items-center justify-center h-40 w-40 lg:h-52 lg:w-52 rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${config.iconBg} 0%, #c9954a 100%)`,
                  }}
                >
                  <span className="text-7xl lg:text-8xl font-black text-white">{objectiveNum}</span>
                </div>
                {/* Decorative ring */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-white/20 scale-110"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <ObjectiveIcon className="h-7 w-7 text-white" />
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    style={{ color: config.accentColor }}
                  >
                    Learning Objective {objectiveNum}
                  </h2>
                </div>

                <div className="h-1 w-24 rounded-full mx-auto lg:mx-0" style={{ backgroundColor: config.accentColor }} />

                <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 leading-relaxed">
                  {slide.content}
                </p>
              </div>
            </div>
          ) : type === "test" ? (
            // Test slide layout - Interactive quiz card design
            <div className="text-center space-y-10">
              {/* Icon with glow */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center h-24 w-24 lg:h-28 lg:w-28 rounded-3xl shadow-2xl"
                    style={{ backgroundColor: config.iconBg }}
                  >
                    <ClipboardList className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
                  </div>
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-3xl border-4 border-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                style={{ color: config.accentColor }}
              >
                {slide.title.includes("Pre") ? "Pre-Test" : "Post-Test"}
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-white/70 font-medium">
                {(slide as typeof slides[0] & { subtitle?: string }).subtitle || "Knowledge Assessment"}
              </p>

              {/* Content card */}
              <div className="max-w-3xl mx-auto p-8 lg:p-10 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                  {slide.content}
                </p>
              </div>

              {/* QR Code placeholder */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-28 w-28 lg:h-32 lg:w-32 rounded-2xl border-4 border-dashed border-white/40 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="grid grid-cols-3 gap-1 p-2">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="h-3 w-3 bg-white/40 rounded-sm" />
                      ))}
                    </div>
                    <span className="text-white/50 text-xs font-medium">QR Code</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm">Scan to begin assessment</p>
              </div>
            </div>
          ) : type === "case" ? (
            // Case study layout - Testimonial style
            <div className="space-y-8 lg:space-y-10">
              {/* Header */}
              <div className="flex items-center gap-5">
                <div
                  className="flex items-center justify-center h-16 w-16 lg:h-20 lg:w-20 rounded-2xl shadow-lg"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Users className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-1">Real-World Scenario</p>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    style={{ color: config.accentColor }}
                  >
                    {slide.title.replace("Case Example: ", "")}
                  </h2>
                </div>
              </div>

              {/* Quote card */}
              <div className="relative">
                {/* Large quote mark */}
                <div
                  className="absolute -top-8 -left-4 text-8xl lg:text-9xl font-serif opacity-20"
                  style={{ color: config.accentColor }}
                >
                  &ldquo;
                </div>

                <div
                  className="relative p-8 lg:p-12 rounded-3xl border-l-8 bg-white/10 backdrop-blur-sm shadow-xl"
                  style={{ borderColor: config.iconBg }}
                >
                  <p className="text-2xl lg:text-3xl text-white/90 leading-relaxed italic pl-6">
                    {slide.content}
                  </p>

                  {/* Scenario detail if available */}
                  {(slide as typeof slides[0] & { scenario?: string }).scenario && (
                    <p className="mt-6 pt-6 border-t border-white/20 text-lg text-white/70 pl-6">
                      <strong>Scenario:</strong> {(slide as typeof slides[0] & { scenario?: string }).scenario}
                    </p>
                  )}
                </div>
              </div>

              {/* Image placeholder */}
              <ImagePlaceholder
                description="CHW reviewing client tracking system on tablet"
                className="h-44 lg:h-52 max-w-xl"
              />
            </div>
          ) : type === "reflection" ? (
            // Reflection slide layout - Contemplative design
            <div className="text-center space-y-10 lg:space-y-12">
              {/* Icon with rays */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center h-24 w-24 lg:h-28 lg:w-28 rounded-full shadow-xl"
                    style={{ backgroundColor: config.iconBg }}
                  >
                    <Lightbulb className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
                  </div>
                  {/* Light rays */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <div
                        key={deg}
                        className="absolute h-1 w-8 bg-gradient-to-r from-[#2E8A92]/40 to-transparent origin-left"
                        style={{ transform: `translateX(60px) rotate(${deg}deg)` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                style={{ color: config.accentColor }}
              >
                {slide.title.replace("Reflection Prompt: ", "").replace("Reflection: ", "")}
              </h2>

              {/* Main prompt */}
              <div
                className="max-w-3xl mx-auto p-8 lg:p-10 rounded-3xl bg-black/10 backdrop-blur-sm shadow-inner"
              >
                <p className="text-xl lg:text-2xl leading-relaxed" style={{ color: config.textColor }}>
                  {slide.content}
                </p>
              </div>

              {/* Prompt questions if available */}
              {(slide as typeof slides[0] & { prompts?: string[] }).prompts && (
                <div className="max-w-2xl mx-auto space-y-4">
                  {(slide as typeof slides[0] & { prompts?: string[] }).prompts!.map((prompt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 border border-black/10"
                    >
                      <div
                        className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: config.iconBg }}
                      >
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-lg" style={{ color: config.textColor }}>{prompt}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Call to action */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <Clock className="h-5 w-5" style={{ color: config.accentColor }} />
                <span className="font-medium" style={{ color: config.accentColor }}>Take 2-3 minutes to reflect...</span>
              </div>
            </div>
          ) : type === "activity" ? (
            // Activity slide layout - Engaging callout design
            <div className="space-y-8 lg:space-y-10">
              {/* Header */}
              <div className="flex items-center gap-5">
                <div
                  className="flex items-center justify-center h-16 w-16 lg:h-20 lg:w-20 rounded-2xl shadow-lg"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <MessageSquare className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-white/60 uppercase tracking-widest">
                    <Play className="h-4 w-4" />
                    Interactive Activity
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-1"
                    style={{ color: config.accentColor }}
                  >
                    {slide.title.replace("Activity: ", "")}
                  </h2>
                </div>
              </div>

              {/* Main content card */}
              <div
                className="p-8 lg:p-10 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"
              >
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8">
                  {slide.content}
                </p>

                {/* Instructions if available */}
                {(slide as typeof slides[0] & { instructions?: string[] }).instructions && (
                  <div className="space-y-4 pt-6 border-t border-white/20">
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Instructions</p>
                    {(slide as typeof slides[0] & { instructions?: string[] }).instructions!.map((instruction, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4"
                      >
                        <div
                          className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: config.iconBg }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-lg text-white/90">{instruction}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity metadata */}
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10">
                  <Clock className="h-6 w-6" />
                  <span className="font-medium text-lg">10-15 minutes</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10">
                  <Users className="h-6 w-6" />
                  <span className="font-medium text-lg">Small groups (3-4 people)</span>
                </div>
              </div>

              {/* Image placeholder */}
              <ImagePlaceholder
                description="Group of CHWs collaborating around a table"
                className="h-40 lg:h-48 max-w-lg"
              />
            </div>
          ) : type === "summary" ? (
            // Summary slide layout - Key takeaways design
            <div className="text-center space-y-10 lg:space-y-12">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className="inline-flex items-center justify-center h-24 w-24 lg:h-28 lg:w-28 rounded-3xl shadow-2xl"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <CheckCircle className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                style={{ color: config.accentColor }}
              >
                {slide.title}
              </h2>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: config.accentColor }} />
                <Award className="h-6 w-6" style={{ color: config.accentColor }} />
                <div className="h-1 w-20 rounded-full" style={{ backgroundColor: config.accentColor }} />
              </div>

              {/* Main content */}
              <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                {slide.content}
              </p>

              {/* Takeaways/highlights grid */}
              {((slide as typeof slides[0] & { takeaways?: string[] }).takeaways || (slide as typeof slides[0] & { highlights?: string[] }).highlights) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-6">
                  {((slide as typeof slides[0] & { takeaways?: string[] }).takeaways || (slide as typeof slides[0] & { highlights?: string[] }).highlights)!.map((item, i) => (
                    <KeyPointCard key={i} point={item} index={i} icon={CheckCircle} />
                  ))}
                </div>
              )}

              {/* Completion badge for Part 1 Completion slide */}
              {slide.title.includes("Completion") && (
                <div className="pt-6">
                  <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D8A75F] to-[#c9954a] shadow-xl">
                    <Star className="h-8 w-8 text-white" />
                    <span className="text-xl font-bold text-white">Part 1 Complete!</span>
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          ) : type === "moduleList" ? (
            // Module list layout - Card grid
            <div className="space-y-10 lg:space-y-12">
              <div className="text-center">
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                  style={{ color: config.accentColor }}
                >
                  {slide.title}
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  {slide.content}
                </p>
              </div>

              {/* Module cards */}
              {(slide as typeof slides[0] & { modules?: string[] }).modules && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {(slide as typeof slides[0] & { modules?: string[] }).modules!.map((module, i) => {
                    const moduleIcons = [Clock, ClipboardList, FileText, TrendingUp, Shield] as const;
                    const ModuleIcon = moduleIcons[i % moduleIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div
                          className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                          style={{ backgroundColor: config.iconBg }}
                        >
                          <ModuleIcon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{module}</h3>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <ChevronRight className="h-4 w-4" />
                          <span>Module {i + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : type === "appendix" ? (
            // Appendix slide layout - Reference style
            <div className="space-y-10 lg:space-y-12">
              <div className="flex items-center gap-5">
                <div
                  className="flex items-center justify-center h-16 w-16 lg:h-20 lg:w-20 rounded-2xl shadow-lg"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Layers className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                  style={{ color: config.accentColor }}
                >
                  {slide.title}
                </h2>
              </div>

              <div
                className="p-8 lg:p-10 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <p className="text-xl text-white/90 leading-relaxed">
                  {slide.content}
                </p>
              </div>

              {/* Reference categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Texas DSHS CHW Competencies", "CBPR & PAR Literature", "Ethical Frameworks", "Professional Standards"].map((ref, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white/60" />
                    </div>
                    <span className="text-white/80">{ref}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 text-center border-t border-white/20">
                <p className="text-white/50 text-sm">
                  CHW360 | Educational Use Only | Not Medical Advice
                </p>
              </div>
            </div>
          ) : (
            // Default content slide layout - Enhanced with visual hierarchy
            <div className="space-y-10 lg:space-y-12">
              {/* Title with decorative line */}
              <div className="space-y-6">
                <h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                  style={{ color: config.accentColor }}
                >
                  {slide.title}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 rounded-full" style={{ backgroundColor: config.iconBg }} />
                  <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: config.iconBg, opacity: 0.5 }} />
                  <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: config.iconBg, opacity: 0.25 }} />
                </div>
              </div>

              {/* Main content */}
              <p className="text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-5xl">
                {slide.content}
              </p>

              {/* Key points if available */}
              {(slide as typeof slides[0] & { keyPoints?: string[] }).keyPoints && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {(slide as typeof slides[0] & { keyPoints?: string[] }).keyPoints!.map((point, i) => (
                    <KeyPointCard key={i} point={point} index={i} />
                  ))}
                </div>
              )}

              {/* Examples if available */}
              {(slide as typeof slides[0] & { examples?: string[] }).examples && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {(slide as typeof slides[0] & { examples?: string[] }).examples!.map((example, i) => (
                    <div
                      key={i}
                      className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 text-white/90 font-medium"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              )}

              {/* Responsibilities if available */}
              {(slide as typeof slides[0] & { responsibilities?: string[] }).responsibilities && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {(slide as typeof slides[0] & { responsibilities?: string[] }).responsibilities!.map((resp, i) => {
                    const respIcons = [Calendar, RefreshCw, FileText, MessageSquare];
                    const RespIcon = respIcons[i % respIcons.length];
                    return (
                      <KeyPointCard key={i} point={resp} index={i} icon={RespIcon} />
                    );
                  })}
                </div>
              )}

              {/* Tools if available */}
              {(slide as typeof slides[0] & { tools?: string[] }).tools && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {(slide as typeof slides[0] & { tools?: string[] }).tools!.map((tool, i) => {
                    const toolIcons = [Calendar, ClipboardList, BookOpen, Compass] as const;
                    const ToolIcon = toolIcons[i % toolIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/15"
                      >
                        <ToolIcon className="h-5 w-5 text-white/70" />
                        <span className="text-white/90 font-medium">{tool}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Principles if available */}
              {(slide as typeof slides[0] & { principles?: string[] }).principles && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {(slide as typeof slides[0] & { principles?: string[] }).principles!.map((principle, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/15"
                    >
                      <Shield className="h-5 w-5 text-white/70" />
                      <span className="text-white/90 font-medium">{principle}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Factors if available */}
              {(slide as typeof slides[0] & { factors?: string[] }).factors && (
                <div className="flex items-center gap-6 pt-4">
                  {(slide as typeof slides[0] & { factors?: string[] }).factors!.map((factor, i, arr) => (
                    <div key={i} className="flex items-center gap-6">
                      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/15">
                        <TrendingUp className="h-6 w-6 text-white/70" />
                        <span className="text-xl text-white/90 font-medium">{factor}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <ChevronRight className="h-6 w-6 text-white/40" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Systems if available */}
              {(slide as typeof slides[0] & { systems?: string[] }).systems && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {(slide as typeof slides[0] & { systems?: string[] }).systems!.map((system, i) => {
                    const sysIcons = [Clock, ClipboardList, FileText, RefreshCw] as const;
                    const SysIcon = sysIcons[i % sysIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="p-5 rounded-2xl bg-white/10 border border-white/15 text-center hover:bg-white/15 transition-colors"
                      >
                        <SysIcon className="h-8 w-8 text-white/70 mx-auto mb-3" />
                        <span className="text-white/90 font-medium">{system}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Context-appropriate image placeholder for some content slides */}
              {(slide.title.includes("Trust") ||
                slide.title.includes("Reliability") ||
                slide.title.includes("Communication") ||
                slide.title.includes("Self-Care")) && (
                <ImagePlaceholder
                  description={
                    slide.title.includes("Trust") ? "CHW building rapport with community member" :
                    slide.title.includes("Self-Care") ? "CHW practicing wellness and work-life balance" :
                    slide.title.includes("Communication") ? "CHW engaged in professional communication" :
                    "CHW demonstrating professional reliability"
                  }
                  className="h-40 lg:h-48 max-w-md"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 lg:pt-16 flex items-center justify-between text-white/40 text-sm border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-medium">CHW360 Training</span>
          </div>
          <span>Module 1: Organizational Skills</span>
        </div>
      </div>
    </div>
  );
}

// Table of contents component
function TableOfContents({
  isOpen,
  onClose,
  currentSlide,
  onNavigate,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: number;
  onNavigate: (num: number) => void;
}) {
  if (!isOpen) return null;

  // Group slides by type
  const sections = [
    { label: "Overview & Objectives", slides: slides.filter((s, i) => i < 9) },
    { label: "Core Concepts", slides: slides.filter((s, i) => i >= 9 && i < 20) },
    { label: "Practical Skills", slides: slides.filter((s, i) => i >= 20 && i < 40) },
    { label: "Advanced Topics & Summary", slides: slides.filter((s, i) => i >= 40) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg ml-auto h-full overflow-y-auto shadow-2xl"
        style={{ backgroundColor: colors.background }}
      >
        <div className="sticky top-0 z-10 p-8 border-b border-black/10" style={{ backgroundColor: colors.background }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                Table of Contents
              </h2>
              <p className="text-sm mt-1" style={{ color: colors.text + "99" }}>
                {slides.length} slides in this module
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-xl flex items-center justify-center transition-colors hover:bg-black/10"
            >
              <ArrowRight className="h-6 w-6" style={{ color: colors.text }} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              <h3
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{ color: colors.primary }}
              >
                {section.label}
              </h3>
              <div className="space-y-2">
                {section.slides.map((slide) => {
                  const type = getSlideType(slide.title, slide.num);
                  const config = slideTypeConfig[type];
                  const Icon = config.icon;
                  const isActive = currentSlide === slide.num;

                  return (
                    <button
                      key={slide.num}
                      onClick={() => {
                        onNavigate(slide.num);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                        isActive
                          ? "bg-[#2E8A92]/20 border-2 border-[#2E8A92]/40 shadow-md"
                          : "hover:bg-black/5 border-2 border-transparent"
                      }`}
                    >
                      <div
                        className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl text-white text-sm font-bold shadow-md"
                        style={{ backgroundColor: isActive ? colors.primary : colors.text + "40" }}
                      >
                        {slide.num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: colors.text }}
                        >
                          {slide.title}
                        </p>
                        <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: colors.text + "80" }}>
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main presentation component
export default function PresentationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showTOC, setShowTOC] = useState(false);
  const [showNav, setShowNav] = useState(true);

  // Use IntersectionObserver for reliable slide tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideNum = parseInt(entry.target.id.replace("slide-", ""), 10);
            setCurrentSlide(slideNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all slides
    slides.forEach((slide) => {
      const element = document.getElementById(`slide-${slide.num}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        navigateToSlide(Math.min(currentSlide + 1, slides.length));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateToSlide(Math.max(currentSlide - 1, 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        navigateToSlide(1);
      } else if (e.key === "End") {
        e.preventDefault();
        navigateToSlide(slides.length);
      } else if (e.key === "Escape") {
        setShowTOC(false);
      } else if (e.key === "h" || e.key === "H") {
        setShowNav((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const navigateToSlide = (num: number) => {
    const element = document.getElementById(`slide-${num}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const progress = (currentSlide / slides.length) * 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Custom CSS for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b shadow-lg backdrop-blur-md transition-all duration-300 ${
          showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          backgroundColor: colors.background + "F0",
          borderColor: colors.text + "15",
        }}
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-black/10">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
            }}
          />
        </div>

        <div className="px-6 lg:px-8 py-4 grid grid-cols-3 items-center">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Link
              href={`/portal/${slug}/demos/slides`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors hover:bg-black/5"
              style={{ color: colors.text }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-semibold">Back to Overview</span>
            </Link>
            <div className="hidden lg:block h-8 w-px bg-black/15" />
            <div className="hidden lg:flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg" style={{ color: colors.text }}>
                  Module 1
                </h1>
                <p className="text-xs font-medium" style={{ color: colors.text + "80" }}>
                  Organizational Skills - Part 1
                </p>
              </div>
            </div>
          </div>

          {/* Center - Slide counter */}
          <div className="flex justify-center">
            <div
              className="flex items-center gap-3 px-6 py-3 rounded-full shadow-inner"
              style={{ backgroundColor: colors.text + "08" }}
            >
              <span className="text-xl font-bold" style={{ color: colors.primary }}>
                {currentSlide}
              </span>
              <span className="text-lg" style={{ color: colors.text + "40" }}>/</span>
              <span className="text-lg font-medium" style={{ color: colors.text + "80" }}>{slides.length}</span>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => navigateToSlide(1)}
              className="h-12 w-12 rounded-xl flex items-center justify-center transition-all hover:bg-black/10 hover:scale-105"
              title="Go to start"
            >
              <Home className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setShowTOC(true)}
              className="h-12 w-12 rounded-xl flex items-center justify-center transition-all hover:bg-black/10 hover:scale-105"
              title="Table of contents"
            >
              <List className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setShowNav(false)}
              className="h-12 w-12 rounded-xl flex items-center justify-center transition-all hover:bg-black/10 hover:scale-105"
              title="Hide navigation (H)"
            >
              <ChevronUp className="h-5 w-5" style={{ color: colors.text }} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {slides.map((slide, index) => (
          <Slide
            key={slide.num}
            slide={slide}
            index={index}
            isActive={currentSlide === slide.num}
            totalSlides={slides.length}
          />
        ))}
      </main>

      {/* Floating nav toggle button (visible when nav is hidden) */}
      <button
        onClick={() => setShowNav(true)}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
          showNav ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100 translate-y-0"
        }`}
        style={{ backgroundColor: colors.text + "E0" }}
        title="Show navigation (press H)"
      >
        <span className="text-sm font-medium text-white">{currentSlide} / {slides.length}</span>
        <span className="text-xs text-white/60 hidden sm:inline">Press H to toggle</span>
      </button>

      {/* Table of Contents */}
      <TableOfContents
        isOpen={showTOC}
        onClose={() => setShowTOC(false)}
        currentSlide={currentSlide}
        onNavigate={navigateToSlide}
      />
    </div>
  );
}
