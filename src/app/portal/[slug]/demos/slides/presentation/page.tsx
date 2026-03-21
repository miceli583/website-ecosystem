"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
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
  ChevronLeft,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  Maximize,
  Minimize,
  Keyboard,
  X,
  Timer,
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
    content:
      "Organizational skills help Community Health Workers manage time, information, tasks, and responsibilities effectively. This course introduces foundational organizational practices that support reliable, ethical, and sustainable CHW work across Texas settings.",
    subtitle: "Part 1: Foundation",
    icon: "layers",
  },
  {
    num: 2,
    title: "Pre-Test (Knowledge Check Placeholder)",
    content:
      "This pre-test includes five questions assessing baseline understanding of organization, time management, and documentation concepts. A QR code will be added later.",
    subtitle: "Assess Your Starting Point",
  },
  {
    num: 3,
    title: "Learning Objective 1",
    content:
      "Learners will be able to explain why organizational skills are essential to effective Community Health Worker practice.",
    icon: "heart",
  },
  {
    num: 4,
    title: "Learning Objective 2",
    content:
      "Learners will be able to identify core organizational tasks commonly performed by CHWs in community and organizational settings.",
    icon: "clipboard",
  },
  {
    num: 5,
    title: "Learning Objective 3",
    content:
      "Learners will be able to recognize how organization supports accountability, follow-through, and trust with individuals and partners.",
    icon: "handshake",
  },
  {
    num: 6,
    title: "Learning Objective 4",
    content:
      "Learners will be able to describe basic strategies for organizing time, information, and responsibilities within CHW scope of practice.",
    icon: "calendar",
  },
  {
    num: 7,
    title: "Purpose of Organizational Skills",
    content:
      "Organizational skills support reliability and consistency. When CHWs stay organized, they are better able to follow through on commitments and support community trust.",
    keyPoints: ["Reliability", "Consistency", "Trust Building"],
  },
  {
    num: 8,
    title: "Organizational Skills as a Core Competency",
    content:
      "Organization is a core CHW competency because CHWs manage multiple responsibilities, relationships, and tasks across settings.",
    keyPoints: [
      "Multiple Responsibilities",
      "Diverse Relationships",
      "Varied Settings",
    ],
  },
  {
    num: 9,
    title: "Module List",
    content:
      "This course includes modules on time management, task tracking, basic documentation, prioritization, and ethical organization practices.",
    modules: [
      "Time Management",
      "Task Tracking",
      "Documentation",
      "Prioritization",
      "Ethical Practices",
    ],
  },
  {
    num: 10,
    title: "What Organization Looks Like in CHW Work",
    content:
      "Organization includes keeping track of appointments, referrals, information shared, and follow-up needs in a clear and respectful way.",
    examples: [
      "Appointments",
      "Referrals",
      "Shared Information",
      "Follow-up Needs",
    ],
  },
  {
    num: 11,
    title: "Organization and Trust",
    content:
      "Community trust grows when CHWs are organized. Remembering details, following up, and being prepared shows respect and reliability.",
    keyPoints: ["Remember Details", "Follow Up", "Be Prepared"],
  },
  {
    num: 12,
    title: "Organization and Professional Boundaries",
    content:
      "Organization supports boundaries by helping CHWs manage workload, schedules, and expectations without overextending.",
    keyPoints: ["Manage Workload", "Control Schedule", "Set Expectations"],
  },
  {
    num: 13,
    title: "Common Organizational Responsibilities",
    content:
      "CHWs organize schedules, track referrals, document education, and manage communication with individuals and partners.",
    responsibilities: [
      "Schedule Management",
      "Referral Tracking",
      "Education Documentation",
      "Communication Management",
    ],
  },
  {
    num: 14,
    title: "Time Management Basics",
    content:
      "Time management involves planning tasks, setting priorities, and using time intentionally to meet responsibilities.",
    keyPoints: ["Plan Tasks", "Set Priorities", "Use Time Intentionally"],
  },
  {
    num: 15,
    title: "Prioritizing Tasks",
    content:
      "Prioritization helps CHWs decide what needs attention first. Urgency, impact, and commitments guide priority decisions.",
    factors: ["Urgency", "Impact", "Commitments"],
  },
  {
    num: 16,
    title: "Managing Multiple Responsibilities",
    content:
      "CHWs often juggle outreach, documentation, and follow-up. Organization helps balance responsibilities without sacrificing quality.",
  },
  {
    num: 17,
    title: "Organizing Information Ethically",
    content:
      "Ethical organization includes keeping information accurate, secure, and shared only as appropriate within role and policy.",
    principles: ["Accuracy", "Security", "Appropriate Sharing"],
  },
  {
    num: 18,
    title: "Case Example: Organized Follow-Up",
    content:
      "A CHW tracks referrals and schedules follow-up reminders to ensure individuals receive timely support.",
    scenario:
      "Maria, a CHW, uses a simple tracking system to ensure no community member falls through the cracks.",
  },
  {
    num: 19,
    title: "Reflection Prompt: Organization Habits",
    content:
      "Reflect on your current organization habits. What helps you stay organized, and what feels challenging?",
    prompts: [
      "What systems do you currently use?",
      "What works well for you?",
      "Where do you struggle?",
    ],
  },
  {
    num: 20,
    title: "Activity: Identifying Organizational Needs",
    content:
      "Participants identify common organizational challenges in their work and discuss simple strategies to address them.",
    instructions: [
      "Identify 3 organizational challenges",
      "Discuss with a partner",
      "Share one strategy with the group",
    ],
  },
  {
    num: 21,
    title: "Organization and Daily Planning",
    content:
      "Daily planning helps CHWs manage time and responsibilities. Simple planning supports focus, follow-through, and reduced stress.",
  },
  {
    num: 22,
    title: "Using Simple Planning Tools",
    content:
      "Planning tools may include calendars, checklists, or notebooks. CHWs choose tools that fit their work style and setting.",
    tools: ["Calendars", "Checklists", "Notebooks", "Digital Apps"],
  },
  {
    num: 23,
    title: "Organizing Appointments and Schedules",
    content:
      "Clear scheduling helps CHWs manage appointments and commitments. Organization reduces missed meetings and confusion.",
  },
  {
    num: 24,
    title: "Tracking Follow-Up Tasks",
    content:
      "Follow-up tracking ensures continuity of support. CHWs use reminders or lists to remember next steps.",
  },
  {
    num: 25,
    title: "Organizing Contacts and Resources",
    content:
      "CHWs maintain organized contact lists and resource information to provide timely referrals and support.",
  },
  {
    num: 26,
    title: "Managing Information Overload",
    content:
      "Too much information can be overwhelming. CHWs organize information by relevance and purpose to stay focused.",
  },
  {
    num: 27,
    title: "Organizing Paper and Digital Materials",
    content:
      "CHWs may use paper or digital systems. Clear labeling and consistent storage support easy access and accuracy.",
  },
  {
    num: 28,
    title: "Organization and Confidentiality",
    content:
      "Organization supports confidentiality. CHWs store information securely and follow policies for access and sharing.",
  },
  {
    num: 29,
    title: "Organizing Communication",
    content:
      "Clear organization of calls, messages, and emails helps CHWs respond appropriately and maintain professionalism.",
  },
  {
    num: 30,
    title: "Time Blocking Basics",
    content:
      "Time blocking involves setting specific times for tasks. This helps CHWs manage competing responsibilities.",
  },
  {
    num: 31,
    title: "Managing Interruptions",
    content:
      "Interruptions are common in CHW work. Organization helps CHWs return to tasks without losing track.",
  },
  {
    num: 32,
    title: "Organizing Work Across Settings",
    content:
      "CHWs work in homes, offices, and community spaces. Portable organization tools support flexibility.",
  },
  {
    num: 33,
    title: "Organization and Self-Care",
    content:
      "Good organization supports self-care. Clear boundaries and planning reduce overload and burnout.",
  },
  {
    num: 34,
    title: "Common Organizational Challenges",
    content:
      "Challenges include competing priorities and limited time. Awareness helps CHWs choose realistic strategies.",
  },
  {
    num: 35,
    title: "Case Example: Managing Multiple Referrals",
    content:
      "A CHW tracks referrals using a simple checklist to ensure follow-up and accurate communication.",
    scenario:
      "James manages 15 active referrals by reviewing his checklist each morning.",
  },
  {
    num: 36,
    title: "Reflection: Organization Strengths",
    content:
      "Reflect on organizational strategies that work well for you. What helps you stay on track?",
    prompts: [
      "What is your greatest organizational strength?",
      "How can you build on it?",
    ],
  },
  {
    num: 37,
    title: "Activity: Personal Organization Mapping",
    content:
      "Participants map daily tasks and identify where organization tools can improve workflow.",
    instructions: [
      "List your daily tasks",
      "Identify pain points",
      "Choose one tool to try",
    ],
  },
  {
    num: 38,
    title: "Organization and Continuous Improvement",
    content:
      "Organization improves over time. CHWs adjust systems as responsibilities change.",
  },
  {
    num: 39,
    title: "Preparing for Applied Organizational Skills",
    content:
      "This foundation prepares learners for applying organizational skills in real scenarios in Part 2.",
  },
  {
    num: 40,
    title: "Part 1 Summary",
    content:
      "Organizational Skills — Part 1 introduced foundational practices for managing time, information, and responsibilities.",
    highlights: [
      "Core Competencies",
      "Time Management",
      "Task Tracking",
      "Ethical Practices",
    ],
  },
  {
    num: 41,
    title: "Organization and Reliability",
    content:
      "Reliability depends on organization. When CHWs track tasks and follow through, individuals and partners experience consistent support.",
  },
  {
    num: 42,
    title: "Organization and Professional Credibility",
    content:
      "Organized CHWs demonstrate professionalism. Preparedness and follow-through strengthen credibility with communities and organizations.",
  },
  {
    num: 43,
    title: "Organization and Clear Communication",
    content:
      "Organization supports clear communication. Knowing next steps and details helps CHWs provide accurate information.",
  },
  {
    num: 44,
    title: "Organizing Workload Expectations",
    content:
      "Clear organization helps manage expectations. CHWs communicate timelines and capacity honestly to avoid overcommitment.",
  },
  {
    num: 45,
    title: "Organization and Ethical Practice",
    content:
      "Ethical practice includes managing information responsibly. Organization helps prevent errors and protect confidentiality.",
  },
  {
    num: 46,
    title: "Organization and Accountability Systems",
    content:
      "Accountability systems include reminders, checklists, and documentation. These tools support consistent follow-through.",
    systems: ["Reminders", "Checklists", "Documentation", "Review Processes"],
  },
  {
    num: 47,
    title: "Organization Across Teams",
    content:
      "CHWs often work with teams. Organized communication and task tracking support collaboration and shared goals.",
  },
  {
    num: 48,
    title: "Organization in High-Volume Work",
    content:
      "High workloads require simple systems. CHWs focus on efficiency without sacrificing quality or care.",
  },
  {
    num: 49,
    title: "Organization and Adaptability",
    content:
      "Organized systems allow flexibility. CHWs adjust plans while keeping priorities visible.",
  },
  {
    num: 50,
    title: "Organization and Self-Reflection",
    content:
      "Reflection helps improve organization. CHWs notice what systems work and make changes as needed.",
  },
  {
    num: 51,
    title: "Reflection: Organization Impact",
    content:
      "Reflect on how organization affects your work. How does being organized support the people you serve?",
    prompts: [
      "How does organization help your clients?",
      "What would improve with better organization?",
    ],
  },
  {
    num: 52,
    title: "Activity: Improving One System",
    content:
      "Participants identify one organizational system to improve and outline simple changes to try.",
    instructions: [
      "Choose one system to improve",
      "Identify specific changes",
      "Set a timeline to implement",
    ],
  },
  {
    num: 53,
    title: "Preparing for Applied Organizational Skills",
    content:
      "Part 2 will focus on applying organizational skills in real-world CHW scenarios and workflows.",
  },
  {
    num: 54,
    title: "Organizational Skills and Career Growth",
    content:
      "Strong organizational skills support career growth. CHWs demonstrate readiness for increased responsibility.",
  },
  {
    num: 55,
    title: "Post-Test (Knowledge Check Placeholder)",
    content:
      "This post-test includes five questions assessing foundational organizational concepts. A QR code will be added later.",
    subtitle: "Measure Your Progress",
  },
  {
    num: 56,
    title: "Key Takeaways",
    content:
      "Organizational skills support reliability, accountability, and sustainability in CHW practice.",
    takeaways: [
      "Organization builds trust",
      "Systems support consistency",
      "Improvement is ongoing",
      "Self-care matters",
    ],
  },
  {
    num: 57,
    title: "Closing Reflection",
    content:
      "Consider how improved organization can strengthen your CHW role and reduce stress.",
  },
  {
    num: 58,
    title: "Part 1 Completion",
    content:
      "You have completed Organizational Skills — Part 1. This foundation supports applied organizational practice.",
  },
  {
    num: 59,
    title: "Looking Ahead to Part 2",
    content:
      "Part 2 will focus on applying organizational skills to workflows, documentation, and coordination.",
  },
  {
    num: 60,
    title: "Organizational Skills Foundation Summary",
    content:
      "Organizational Skills — Part 1 established core practices for managing time, information, and responsibilities effectively.",
  },
  {
    num: 61,
    title: "Appendix and References",
    content:
      "References supporting this module include Texas DSHS CHW Core Competencies, CBPR and PAR literature, ethical evaluation frameworks, and professional standards published between 2020 and 2025. Full APA citations will be provided in the final appendix.",
  },
];

// Slide type detection
type SlideType =
  | "title"
  | "objective"
  | "test"
  | "content"
  | "case"
  | "reflection"
  | "activity"
  | "summary"
  | "appendix"
  | "moduleList";

function getSlideType(title: string, num: number): SlideType {
  const lower = title.toLowerCase();
  if (num === 1) return "title";
  if (lower.includes("objective")) return "objective";
  if (lower.includes("pre-test") || lower.includes("post-test")) return "test";
  if (lower.includes("case example")) return "case";
  if (lower.includes("reflection")) return "reflection";
  if (lower.includes("activity")) return "activity";
  if (lower.includes("module list")) return "moduleList";
  if (
    lower.includes("summary") ||
    lower.includes("takeaway") ||
    lower.includes("completion") ||
    lower.includes("looking ahead") ||
    lower.includes("key takeaways")
  )
    return "summary";
  if (lower.includes("appendix") || lower.includes("references"))
    return "appendix";
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
const slideTypeConfig: Record<
  SlideType,
  {
    icon: React.ElementType;
    label: string;
    bgGradient: string;
    accentColor: string;
    iconBg: string;
    textColor: string;
    patternOpacity: string;
  }
> = {
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
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
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
          <div className="absolute right-1/4 bottom-40 h-5 w-5 rounded-full bg-white/25" />
          {/* Accent lines */}
          <div className="absolute top-0 left-1/2 h-40 w-1 bg-gradient-to-b from-white/20 to-transparent" />
          <div className="absolute right-1/3 bottom-0 h-32 w-1 bg-gradient-to-t from-white/20 to-transparent" />
        </>
      )}
      {type === "objective" && (
        <>
          <div className="absolute top-10 right-10 h-48 w-48 rounded-full border-[12px] border-white/15" />
          <div className="absolute bottom-20 left-20 h-32 w-32 rounded-full border-[8px] border-white/10" />
          <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full border-[8px] border-white/12" />
          {/* Target-like rings */}
          <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full border-4 border-white/20" />
          <div className="absolute top-1/2 right-1/4 h-16 w-16 translate-x-2 translate-y-2 rounded-full border-4 border-white/15" />
          {/* Diagonal lines */}
          <div className="absolute top-20 left-0 h-1 w-40 rotate-45 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </>
      )}
      {type === "test" && (
        <>
          {/* Quiz card shapes */}
          <div className="absolute top-1/4 right-16 h-32 w-24 rotate-12 rounded-2xl border-4 border-white/20" />
          <div className="absolute bottom-1/4 left-16 h-40 w-32 -rotate-6 rounded-2xl border-4 border-white/15" />
          <div className="absolute top-16 left-1/3 h-20 w-20 rotate-45 border-4 border-white/12" />
          {/* Checkmark decorations */}
          <div className="absolute right-1/3 bottom-32 h-16 w-8 rotate-45 border-r-4 border-b-4 border-white/20" />
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
          <div className="absolute -top-8 right-1/4 font-serif text-[200px] leading-none text-white/10">
            &ldquo;
          </div>
          <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full border-[12px] border-white/12" />
          {/* User silhouette shapes */}
          <div className="bg-white/08 absolute right-20 bottom-20 h-20 w-20 rounded-full" />
          <div className="bg-white/08 absolute right-24 bottom-10 h-16 w-24 rounded-t-full" />
        </>
      )}
      {type === "reflection" && (
        <>
          {/* Thought bubbles */}
          <div className="bg-black/08 absolute top-24 right-24 h-32 w-32 rounded-full" />
          <div className="bg-black/06 absolute bottom-40 left-24 h-24 w-24 rounded-full" />
          <div className="bg-black/05 absolute top-1/2 left-1/3 h-16 w-16 rounded-full" />
          <div className="bg-black/07 absolute top-1/3 right-1/3 h-12 w-12 rounded-full" />
          {/* Light rays */}
          <div className="absolute top-20 left-1/2 h-24 w-1 rotate-12 bg-gradient-to-b from-black/10 to-transparent" />
          <div className="from-black/08 absolute top-24 left-[52%] h-20 w-1 -rotate-12 bg-gradient-to-b to-transparent" />
          <div className="from-black/06 absolute top-28 left-[48%] h-16 w-1 rotate-6 bg-gradient-to-b to-transparent" />
        </>
      )}
      {type === "activity" && (
        <>
          {/* Interactive elements */}
          <div className="absolute top-16 -right-16 h-56 w-56 rounded-full border-[10px] border-white/15" />
          <div className="absolute -bottom-16 left-16 h-44 w-44 rounded-full border-[8px] border-white/12" />
          <div className="absolute top-1/2 left-1/4 h-28 w-28 rounded-full border-[6px] border-white/10" />
          {/* Hand/gesture shapes */}
          <div className="absolute right-32 bottom-32 h-8 w-20 rotate-12 rounded-full bg-white/10" />
          {/* Dashed circles suggesting interaction */}
          <div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full border-4 border-dashed border-white/15" />
        </>
      )}
      {type === "summary" && (
        <>
          {/* Completion/achievement shapes */}
          <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full border-[16px] border-white/12" />
          <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full border-[20px] border-white/10" />
          {/* Checkmarks */}
          <div className="absolute top-40 right-40 h-12 w-6 rotate-45 border-r-4 border-b-4 border-white/20" />
          <div className="absolute bottom-48 left-48 h-8 w-4 rotate-45 border-r-4 border-b-4 border-white/15" />
          {/* Star shapes */}
          <div className="absolute top-1/4 right-1/3 h-16 w-16">
            <Sparkles className="h-full w-full text-white/15" />
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
          <div className="absolute top-0 left-1/4 h-48 w-1 bg-gradient-to-b from-white/15 to-transparent" />
        </>
      )}
      {type === "appendix" && (
        <>
          <div className="absolute top-24 right-24 h-48 w-48 rounded-full border-[8px] border-white/10" />
          <div className="border-white/08 absolute bottom-24 left-16 h-40 w-40 rounded-full border-[6px]" />
          {/* Book/document shapes */}
          <div className="absolute top-1/3 right-20 h-32 w-24 rounded-lg border-4 border-white/10" />
          <div className="border-white/08 absolute top-1/3 right-24 h-32 w-24 rounded-lg border-4" />
        </>
      )}

      {/* Universal subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

// Curated image URLs for consistent, high-quality visuals
const slideImages = {
  community:
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=500&fit=crop",
  collaboration:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop",
  tablet:
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
  group:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
  trust:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop",
  wellness:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
  communication:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
  reliability:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop",
} as const;

// Get appropriate image URL based on description
function getImageUrl(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes("collaborat") || lower.includes("community member"))
    return slideImages.community;
  if (lower.includes("group") || lower.includes("team"))
    return slideImages.group;
  if (
    lower.includes("tablet") ||
    lower.includes("tracking") ||
    lower.includes("system")
  )
    return slideImages.tablet;
  if (lower.includes("trust") || lower.includes("rapport"))
    return slideImages.trust;
  if (
    lower.includes("wellness") ||
    lower.includes("self-care") ||
    lower.includes("balance")
  )
    return slideImages.wellness;
  if (lower.includes("communication") || lower.includes("professional"))
    return slideImages.communication;
  if (lower.includes("reliab")) return slideImages.reliability;
  return slideImages.collaboration;
}

// Image component with real photos and loading state
function SlideImage({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}) {
  const imageUrl = getImageUrl(description);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-black/20 shadow-xl ${className}`}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-white/10" />
      )}
      <img
        src={imageUrl}
        alt={description}
        onLoad={() => setIsLoaded(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      {/* Subtle gradient overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

// Key point card component (compact)
function KeyPointCard({
  point,
  icon: Icon,
}: {
  point: string;
  index: number;
  icon?: React.ElementType;
}) {
  const IconComponent = Icon || CheckCircle;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8A75F] to-[#c9954a] shadow">
        <IconComponent className="h-4 w-4 text-white" />
      </div>
      <p className="text-sm font-medium text-white/90">{point}</p>
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
      className={`relative h-screen w-full overflow-hidden bg-gradient-to-br ${config.bgGradient} transition-all duration-500`}
    >
      {/* Decorative pattern */}
      <SlidePattern type={type} opacity={config.patternOpacity} />

      {/* Content container - fills parent height */}
      <div className="relative z-10 flex h-full flex-col px-8 py-6 sm:px-16 lg:px-24 lg:py-10 xl:px-32">
        {/* Header row */}
        <div className="mb-4 flex flex-shrink-0 items-center justify-between lg:mb-6">
          {/* Type badge */}
          <div
            className="flex items-center gap-3 rounded-full px-5 py-2.5 shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: config.iconBg }}
          >
            <Icon className="h-5 w-5 text-white" />
            <span className="text-sm font-bold tracking-wide text-white">
              {config.label}
            </span>
          </div>

          {/* Slide number */}
          <div
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg backdrop-blur-sm"
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

        {/* Main content area - flex-1 to fill space between header and footer, overflow hidden to prevent scrollbars */}
        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col justify-center overflow-hidden">
          {type === "title" ? (
            // Title slide layout - Hero style (compact to fit viewport)
            <div className="space-y-4 text-center lg:space-y-6">
              {/* Animated icon */}
              <div className="flex justify-center">
                <div
                  className="relative inline-flex h-20 w-20 transform items-center justify-center rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105 lg:h-24 lg:w-24"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Layers className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/20" />
                </div>
              </div>

              {/* Main title */}
              <div className="space-y-2">
                <h1
                  className="text-4xl leading-none font-black tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ color: config.accentColor }}
                >
                  Organizational Skills
                </h1>
                <p className="text-xl font-light tracking-wide text-white/80 sm:text-2xl lg:text-3xl">
                  Part 1: Foundation
                </p>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3">
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: config.accentColor }}
                />
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: config.accentColor }}
                />
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: config.accentColor }}
                />
              </div>

              {/* Description */}
              <p className="mx-auto max-w-3xl text-base leading-relaxed font-light text-white/80 lg:text-lg">
                {slide.content}
              </p>

              {/* Slide image */}
              <SlideImage
                description="CHW collaborating with community members in a warm, supportive setting"
                className="mx-auto h-32 max-w-xl lg:h-40"
              />
            </div>
          ) : type === "objective" && objectiveNum ? (
            // Objective slide layout - Timeline style (compact)
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
              {/* Large number badge */}
              <div className="relative flex-shrink-0">
                <div
                  className="flex h-32 w-32 transform items-center justify-center rounded-full shadow-2xl transition-transform duration-500 hover:scale-105 lg:h-40 lg:w-40"
                  style={{
                    background: `linear-gradient(135deg, ${config.iconBg} 0%, #c9954a 100%)`,
                  }}
                >
                  <span className="text-6xl font-black text-white lg:text-7xl">
                    {objectiveNum}
                  </span>
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 scale-110 rounded-full border-4 border-white/20" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <ObjectiveIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2
                    className="text-2xl font-bold sm:text-3xl lg:text-4xl"
                    style={{ color: config.accentColor }}
                  >
                    Learning Objective {objectiveNum}
                  </h2>
                </div>

                <div
                  className="mx-auto h-1 w-20 rounded-full lg:mx-0"
                  style={{ backgroundColor: config.accentColor }}
                />

                <p className="text-lg leading-relaxed text-white/90 sm:text-xl lg:text-2xl">
                  {slide.content}
                </p>
              </div>
            </div>
          ) : type === "test" ? (
            // Test slide layout - Interactive quiz card design (compact)
            <div className="space-y-5 text-center">
              {/* Icon with glow */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="inline-flex h-18 w-18 items-center justify-center rounded-2xl shadow-2xl lg:h-20 lg:w-20"
                    style={{ backgroundColor: config.iconBg }}
                  >
                    <ClipboardList className="h-9 w-9 text-white lg:h-10 lg:w-10" />
                  </div>
                  {/* Pulse rings */}
                  <div
                    className="absolute inset-0 animate-ping rounded-2xl border-4 border-white/20"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-3xl font-bold sm:text-4xl lg:text-5xl"
                style={{ color: config.accentColor }}
              >
                {slide.title.includes("Pre") ? "Pre-Test" : "Post-Test"}
              </h2>

              {/* Subtitle */}
              <p className="text-lg font-medium text-white/70">
                {(slide as (typeof slides)[0] & { subtitle?: string })
                  .subtitle || "Knowledge Assessment"}
              </p>

              {/* Content card */}
              <div className="mx-auto max-w-3xl rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-sm lg:p-8">
                <p className="text-lg leading-relaxed text-white/90 lg:text-xl">
                  {slide.content}
                </p>
              </div>

              {/* QR Code placeholder */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-dashed border-white/40 bg-white/5 backdrop-blur-sm lg:h-24 lg:w-24">
                  <div className="text-center">
                    <div className="grid grid-cols-3 gap-1 p-1.5">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-sm bg-white/40"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-medium text-white/50">
                      QR Code
                    </span>
                  </div>
                </div>
                <p className="text-xs text-white/60">
                  Scan to begin assessment
                </p>
              </div>
            </div>
          ) : type === "case" ? (
            // Case study layout - Testimonial style (compact)
            <div className="space-y-5 lg:space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg lg:h-16 lg:w-16"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Users className="h-7 w-7 text-white lg:h-8 lg:w-8" />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-widest text-white/60 uppercase">
                    Real-World Scenario
                  </p>
                  <h2
                    className="text-2xl font-bold sm:text-3xl lg:text-4xl"
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
                  className="absolute -top-6 -left-2 font-serif text-6xl opacity-20 lg:text-7xl"
                  style={{ color: config.accentColor }}
                >
                  &ldquo;
                </div>

                <div
                  className="relative rounded-2xl border-l-6 bg-white/10 p-6 shadow-xl backdrop-blur-sm lg:p-8"
                  style={{ borderColor: config.iconBg }}
                >
                  <p className="pl-4 text-lg leading-relaxed text-white/90 italic lg:text-xl">
                    {slide.content}
                  </p>

                  {/* Scenario detail if available */}
                  {(slide as (typeof slides)[0] & { scenario?: string })
                    .scenario && (
                    <p className="mt-4 border-t border-white/20 pt-4 pl-4 text-base text-white/70">
                      <strong>Scenario:</strong>{" "}
                      {
                        (slide as (typeof slides)[0] & { scenario?: string })
                          .scenario
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Slide image - smaller */}
              <SlideImage
                description="CHW reviewing client tracking system on tablet"
                className="h-28 max-w-md lg:h-36"
              />
            </div>
          ) : type === "reflection" ? (
            // Reflection slide layout - Contemplative design (compact)
            <div className="space-y-5 text-center lg:space-y-6">
              {/* Icon with rays */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="inline-flex h-18 w-18 items-center justify-center rounded-full shadow-xl lg:h-20 lg:w-20"
                    style={{ backgroundColor: config.iconBg }}
                  >
                    <Lightbulb className="h-9 w-9 text-white lg:h-10 lg:w-10" />
                  </div>
                  {/* Light rays */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <div
                        key={deg}
                        className="absolute h-1 w-6 origin-left bg-gradient-to-r from-[#2E8A92]/40 to-transparent"
                        style={{
                          transform: `translateX(44px) rotate(${deg}deg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-bold sm:text-3xl lg:text-4xl"
                style={{ color: config.accentColor }}
              >
                {slide.title
                  .replace("Reflection Prompt: ", "")
                  .replace("Reflection: ", "")}
              </h2>

              {/* Main prompt */}
              <div className="mx-auto max-w-3xl rounded-2xl bg-black/10 p-5 shadow-inner backdrop-blur-sm lg:p-6">
                <p
                  className="text-lg leading-relaxed lg:text-xl"
                  style={{ color: config.textColor }}
                >
                  {slide.content}
                </p>
              </div>

              {/* Prompt questions if available */}
              {(slide as (typeof slides)[0] & { prompts?: string[] })
                .prompts && (
                <div className="mx-auto max-w-2xl space-y-2">
                  {(
                    slide as (typeof slides)[0] & { prompts?: string[] }
                  ).prompts!.map((prompt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/5 p-3"
                    >
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: config.iconBg }}
                      >
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <p
                        className="text-base"
                        style={{ color: config.textColor }}
                      >
                        {prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Call to action */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <Clock
                  className="h-4 w-4"
                  style={{ color: config.accentColor }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: config.accentColor }}
                >
                  Take 2-3 minutes to reflect...
                </span>
              </div>
            </div>
          ) : type === "activity" ? (
            // Activity slide layout - Engaging callout design (compact, no image)
            <div className="space-y-4 lg:space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg lg:h-16 lg:w-16"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <MessageSquare className="h-7 w-7 text-white lg:h-8 lg:w-8" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white/60 uppercase">
                    <Play className="h-3 w-3" />
                    Interactive Activity
                  </span>
                  <h2
                    className="mt-0.5 text-2xl font-bold sm:text-3xl lg:text-4xl"
                    style={{ color: config.accentColor }}
                  >
                    {slide.title.replace("Activity: ", "")}
                  </h2>
                </div>
              </div>

              {/* Main content card */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-sm lg:p-6">
                <p className="mb-4 text-lg leading-relaxed text-white/90 lg:text-xl">
                  {slide.content}
                </p>

                {/* Instructions if available */}
                {(slide as (typeof slides)[0] & { instructions?: string[] })
                  .instructions && (
                  <div className="space-y-2 border-t border-white/20 pt-4">
                    <p className="mb-2 text-xs font-bold tracking-widest text-white/60 uppercase">
                      Instructions
                    </p>
                    {(
                      slide as (typeof slides)[0] & { instructions?: string[] }
                    ).instructions!.map((instruction, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: config.iconBg }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-base text-white/90">{instruction}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity metadata */}
              <div className="flex flex-wrap items-center gap-4 text-white/70">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">10-15 minutes</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Small groups (3-4 people)
                  </span>
                </div>
              </div>
            </div>
          ) : type === "summary" ? (
            // Summary slide layout - Key takeaways design (compact)
            <div className="space-y-4 text-center lg:space-y-5">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className="inline-flex h-18 w-18 items-center justify-center rounded-2xl shadow-2xl lg:h-20 lg:w-20"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <CheckCircle className="h-9 w-9 text-white lg:h-10 lg:w-10" />
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-bold sm:text-3xl lg:text-4xl"
                style={{ color: config.accentColor }}
              >
                {slide.title}
              </h2>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3">
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: config.accentColor }}
                />
                <Award
                  className="h-5 w-5"
                  style={{ color: config.accentColor }}
                />
                <div
                  className="h-1 w-12 rounded-full"
                  style={{ backgroundColor: config.accentColor }}
                />
              </div>

              {/* Main content */}
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 lg:text-lg">
                {slide.content}
              </p>

              {/* Takeaways/highlights grid */}
              {((slide as (typeof slides)[0] & { takeaways?: string[] })
                .takeaways ||
                (slide as (typeof slides)[0] & { highlights?: string[] })
                  .highlights) && (
                <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 pt-2">
                  {((slide as (typeof slides)[0] & { takeaways?: string[] })
                    .takeaways ||
                    (slide as (typeof slides)[0] & { highlights?: string[] })
                      .highlights)!.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8A75F] to-[#c9954a] shadow">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-medium text-white/90">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Completion badge for Part 1 Completion slide */}
              {slide.title.includes("Completion") && (
                <div className="pt-2">
                  <div className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#D8A75F] to-[#c9954a] px-6 py-3 shadow-xl">
                    <Star className="h-6 w-6 text-white" />
                    <span className="text-lg font-bold text-white">
                      Part 1 Complete!
                    </span>
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </div>
          ) : type === "moduleList" ? (
            // Module list layout - Card grid (compact)
            <div className="space-y-5 lg:space-y-6">
              <div className="text-center">
                <h2
                  className="mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl"
                  style={{ color: config.accentColor }}
                >
                  {slide.title}
                </h2>
                <p className="mx-auto max-w-3xl text-base text-white/80 lg:text-lg">
                  {slide.content}
                </p>
              </div>

              {/* Module cards */}
              {(slide as (typeof slides)[0] & { modules?: string[] })
                .modules && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {(
                    slide as (typeof slides)[0] & { modules?: string[] }
                  ).modules!.map((module, i) => {
                    const moduleIcons = [
                      Clock,
                      ClipboardList,
                      FileText,
                      TrendingUp,
                      Shield,
                    ] as const;
                    const ModuleIcon =
                      moduleIcons[i % moduleIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                      >
                        <div
                          className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg"
                          style={{ backgroundColor: config.iconBg }}
                        >
                          <ModuleIcon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">
                          {module}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <ChevronRight className="h-3 w-3" />
                          <span>Module {i + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : type === "appendix" ? (
            // Appendix slide layout - Reference style (compact)
            <div className="space-y-5 lg:space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg lg:h-16 lg:w-16"
                  style={{ backgroundColor: config.iconBg }}
                >
                  <Layers className="h-7 w-7 text-white lg:h-8 lg:w-8" />
                </div>
                <h2
                  className="text-2xl font-bold sm:text-3xl lg:text-4xl"
                  style={{ color: config.accentColor }}
                >
                  {slide.title}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm lg:p-6">
                <p className="text-base leading-relaxed text-white/90 lg:text-lg">
                  {slide.content}
                </p>
              </div>

              {/* Reference categories */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Texas DSHS CHW Competencies",
                  "CBPR & PAR Literature",
                  "Ethical Frameworks",
                  "Professional Standards",
                ].map((ref, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
                      <BookOpen className="h-4 w-4 text-white/60" />
                    </div>
                    <span className="text-sm text-white/80">{ref}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Default content slide layout - Enhanced with visual hierarchy (compact)
            <div className="space-y-4 lg:space-y-5">
              {/* Title with decorative line */}
              <div className="space-y-3">
                <h2
                  className="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl"
                  style={{ color: config.accentColor }}
                >
                  {slide.title}
                </h2>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1 w-16 rounded-full"
                    style={{ backgroundColor: config.iconBg }}
                  />
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{ backgroundColor: config.iconBg, opacity: 0.5 }}
                  />
                  <div
                    className="h-1 w-3 rounded-full"
                    style={{ backgroundColor: config.iconBg, opacity: 0.25 }}
                  />
                </div>
              </div>

              {/* Main content */}
              <p className="max-w-4xl text-lg leading-relaxed text-white/90 lg:text-xl">
                {slide.content}
              </p>

              {/* Key points if available */}
              {(slide as (typeof slides)[0] & { keyPoints?: string[] })
                .keyPoints && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {(
                    slide as (typeof slides)[0] & { keyPoints?: string[] }
                  ).keyPoints!.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8A75F] to-[#c9954a] shadow">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm font-medium text-white/90">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Examples if available */}
              {(slide as (typeof slides)[0] & { examples?: string[] })
                .examples && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {(
                    slide as (typeof slides)[0] & { examples?: string[] }
                  ).examples!.map((example, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              )}

              {/* Responsibilities if available */}
              {(slide as (typeof slides)[0] & { responsibilities?: string[] })
                .responsibilities && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {(
                    slide as (typeof slides)[0] & {
                      responsibilities?: string[];
                    }
                  ).responsibilities!.map((resp, i) => {
                    const respIcons = [
                      Calendar,
                      RefreshCw,
                      FileText,
                      MessageSquare,
                    ] as const;
                    const RespIcon =
                      respIcons[i % respIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#D8A75F] to-[#c9954a] shadow">
                          <RespIcon className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-sm font-medium text-white/90">
                          {resp}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tools if available */}
              {(slide as (typeof slides)[0] & { tools?: string[] }).tools && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {(
                    slide as (typeof slides)[0] & { tools?: string[] }
                  ).tools!.map((tool, i) => {
                    const toolIcons = [
                      Calendar,
                      ClipboardList,
                      BookOpen,
                      Compass,
                    ] as const;
                    const ToolIcon =
                      toolIcons[i % toolIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2"
                      >
                        <ToolIcon className="h-4 w-4 text-white/70" />
                        <span className="text-sm font-medium text-white/90">
                          {tool}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Principles if available */}
              {(slide as (typeof slides)[0] & { principles?: string[] })
                .principles && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {(
                    slide as (typeof slides)[0] & { principles?: string[] }
                  ).principles!.map((principle, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2"
                    >
                      <Shield className="h-4 w-4 text-white/70" />
                      <span className="text-sm font-medium text-white/90">
                        {principle}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Factors if available */}
              {(slide as (typeof slides)[0] & { factors?: string[] })
                .factors && (
                <div className="flex items-center gap-3 pt-2">
                  {(
                    slide as (typeof slides)[0] & { factors?: string[] }
                  ).factors!.map((factor, i, arr) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2">
                        <TrendingUp className="h-4 w-4 text-white/70" />
                        <span className="text-sm font-medium text-white/90">
                          {factor}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-white/40" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Systems if available */}
              {(slide as (typeof slides)[0] & { systems?: string[] })
                .systems && (
                <div className="grid grid-cols-4 gap-3 pt-2">
                  {(
                    slide as (typeof slides)[0] & { systems?: string[] }
                  ).systems!.map((system, i) => {
                    const sysIcons = [
                      Clock,
                      ClipboardList,
                      FileText,
                      RefreshCw,
                    ] as const;
                    const SysIcon = sysIcons[i % sysIcons.length] ?? FileText;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-white/15 bg-white/10 p-3 text-center"
                      >
                        <SysIcon className="mx-auto mb-2 h-6 w-6 text-white/70" />
                        <span className="text-xs font-medium text-white/90">
                          {system}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Context-appropriate image for some content slides - smaller */}
              {(slide.title.includes("Trust") ||
                slide.title.includes("Reliability") ||
                slide.title.includes("Communication") ||
                slide.title.includes("Self-Care")) && (
                <SlideImage
                  description={
                    slide.title.includes("Trust")
                      ? "CHW building rapport with community member"
                      : slide.title.includes("Self-Care")
                        ? "CHW practicing wellness and work-life balance"
                        : slide.title.includes("Communication")
                          ? "CHW engaged in professional communication"
                          : "CHW demonstrating professional reliability"
                  }
                  className="h-28 max-w-sm lg:h-32"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-center border-t border-white/10 pt-4 text-xs text-white/50 lg:pt-6 lg:text-sm">
          <span>
            © CHW360 | Organizational Skills – Part 1 | Educational Use Only |
            Not Medical Advice.
          </span>
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
    { label: "Overview & Objectives", slides: slides.filter((_, i) => i < 9) },
    {
      label: "Core Concepts",
      slides: slides.filter((_, i) => i >= 9 && i < 20),
    },
    {
      label: "Practical Skills",
      slides: slides.filter((_, i) => i >= 20 && i < 40),
    },
    {
      label: "Advanced Topics & Summary",
      slides: slides.filter((_, i) => i >= 40),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative ml-auto h-full w-full max-w-lg overflow-y-auto shadow-2xl"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="sticky top-0 z-10 border-b border-black/10 p-8"
          style={{ backgroundColor: colors.background }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                Table of Contents
              </h2>
              <p className="mt-1 text-sm" style={{ color: colors.text + "99" }}>
                {slides.length} slides in this module
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors hover:bg-black/10"
            >
              <ArrowRight className="h-6 w-6" style={{ color: colors.text }} />
            </button>
          </div>
        </div>

        <div className="space-y-8 p-8">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              <h3
                className="mb-4 text-sm font-bold tracking-widest uppercase"
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
                      className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all ${
                        isActive
                          ? "border-2 border-[#2E8A92]/40 bg-[#2E8A92]/20 shadow-md"
                          : "border-2 border-transparent hover:bg-black/5"
                      }`}
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
                        style={{
                          backgroundColor: isActive
                            ? colors.primary
                            : colors.text + "40",
                        }}
                      >
                        {slide.num}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ color: colors.text }}
                        >
                          {slide.title}
                        </p>
                        <p
                          className="mt-0.5 flex items-center gap-1.5 text-xs"
                          style={{ color: colors.text + "80" }}
                        >
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

// Keyboard shortcuts overlay component
function KeyboardShortcuts({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["↓", "Space", "PgDn"], action: "Next slide" },
    { keys: ["↑", "PgUp"], action: "Previous slide" },
    { keys: ["Home"], action: "First slide" },
    { keys: ["End"], action: "Last slide" },
    { keys: ["F"], action: "Toggle fullscreen" },
    { keys: ["H"], action: "Toggle navigation" },
    { keys: ["T"], action: "Toggle timer" },
    { keys: ["G"], action: "Toggle thumbnail strip" },
    { keys: ["?"], action: "Show this help" },
    { keys: ["Esc"], action: "Close overlays" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
        style={{ backgroundColor: colors.background }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-black/10"
        >
          <X className="h-5 w-5" style={{ color: colors.text }} />
        </button>

        <div className="mb-8 flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <Keyboard className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
              Keyboard Shortcuts
            </h2>
            <p className="text-sm" style={{ color: colors.text + "80" }}>
              Navigate like a pro
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-black/5 p-3"
            >
              <span className="font-medium" style={{ color: colors.text }}>
                {shortcut.action}
              </span>
              <div className="flex items-center gap-2">
                {shortcut.keys.map((key, j) => (
                  <span key={j}>
                    <kbd
                      className="rounded-lg px-3 py-1.5 font-mono text-sm font-bold shadow-sm"
                      style={{
                        backgroundColor: colors.primary + "20",
                        color: colors.primary,
                        border: `1px solid ${colors.primary}40`,
                      }}
                    >
                      {key}
                    </kbd>
                    {j < shortcut.keys.length - 1 && (
                      <span
                        className="mx-1 text-xs"
                        style={{ color: colors.text + "60" }}
                      >
                        or
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide thumbnail strip component
function ThumbnailStrip({
  isOpen,
  currentSlide,
  onNavigate,
}: {
  isOpen: boolean;
  currentSlide: number;
  onNavigate: (num: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current slide
  useEffect(() => {
    if (isOpen && stripRef.current) {
      const thumb = stripRef.current.querySelector(
        `[data-slide="${currentSlide}"]`
      );
      if (thumb) {
        thumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentSlide, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-40 border-t shadow-2xl backdrop-blur-md transition-all duration-300"
      style={{
        backgroundColor: colors.text + "F5",
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <div
        ref={stripRef}
        className="scrollbar-hide flex items-center gap-3 overflow-x-auto px-6 py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slides.map((slide) => {
          const type = getSlideType(slide.title, slide.num);
          const config = slideTypeConfig[type];
          const isActive = currentSlide === slide.num;

          return (
            <button
              key={slide.num}
              data-slide={slide.num}
              onClick={() => onNavigate(slide.num)}
              className={`relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                isActive
                  ? "scale-105 shadow-xl ring-4 ring-white"
                  : "opacity-60 hover:scale-102 hover:opacity-100"
              }`}
              style={{ width: "120px", height: "68px" }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient}`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <span className="text-lg font-bold text-white">
                  {slide.num}
                </span>
                <span className="line-clamp-1 px-1 text-center text-[10px] text-white/70">
                  {slide.title.length > 20
                    ? slide.title.substring(0, 20) + "..."
                    : slide.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Presentation timer component
function PresentationTimer({ isVisible }: { isVisible: boolean }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isVisible) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div
      className="fixed right-6 bottom-6 z-30 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md"
      style={{ backgroundColor: colors.text + "E0" }}
    >
      <Timer className="h-5 w-5 text-white/80" />
      <span className="font-mono text-xl font-bold text-white tabular-nums">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
      >
        {isRunning ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        onClick={() => setSeconds(0)}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
        title="Reset timer"
      >
        <RefreshCw className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}

// Main presentation component
export default function PresentationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showTOC, setShowTOC] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [showNavHint, setShowNavHint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  // Show hint briefly when nav is hidden, then auto-hide
  useEffect(() => {
    if (!showNav) {
      setShowNavHint(true);
      const timer = setTimeout(() => setShowNavHint(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowNavHint(false);
    }
  }, [showNav]);

  // Track fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Auto-hide nav when entering fullscreen for cleaner presentation
      if (document.fullscreenElement) {
        setShowNav(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // Use IntersectionObserver for reliable slide tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideNum = parseInt(
              entry.target.id.replace("slide-", ""),
              10
            );
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
        setShowShortcuts(false);
      } else if (e.key === "h" || e.key === "H") {
        setShowNav((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "?") {
        setShowShortcuts((prev) => !prev);
      } else if (e.key === "t" || e.key === "T") {
        setShowTimer((prev) => !prev);
      } else if (e.key === "g" || e.key === "G") {
        setShowThumbnails((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const navigateToSlide = useCallback((num: number) => {
    const element = document.getElementById(`slide-${num}`);
    if (element) {
      // Scroll so slide top aligns with viewport top (no header offset)
      const top = element.offsetTop;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const progress = (currentSlide / slides.length) * 100;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* Slide entrance animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.5s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
        }

        /* Staggered animation delays for child elements */
        .stagger-1 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        .stagger-2 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .stagger-3 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        .stagger-4 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .stagger-5 {
          animation-delay: 0.5s;
          opacity: 0;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Scroll margin to account for sticky header - aligns slide top with viewport */
        [id^="slide-"] {
          scroll-margin-top: 0px;
        }

        /* Hide all scrollbars inside slides */
        [id^="slide-"] * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        [id^="slide-"] *::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for thumbnail strip */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Image loading animation */
        @keyframes imageFadeIn {
          from {
            opacity: 0;
            filter: blur(10px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }

        .slide-image-loaded {
          animation: imageFadeIn 0.5s ease-out forwards;
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

        <div className="grid grid-cols-3 items-center px-6 py-4 lg:px-8">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Link
              href={`/portal/${slug}/demos/slides`}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-colors hover:bg-black/5"
              style={{ color: colors.text }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden text-sm font-semibold sm:inline">
                Back to Overview
              </span>
            </Link>
            <div className="hidden h-8 w-px bg-black/15 lg:block" />
            <div className="hidden items-center gap-4 lg:flex">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl shadow-md"
                style={{ backgroundColor: colors.primary }}
              >
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  Module 1
                </h1>
                <p
                  className="text-xs font-medium"
                  style={{ color: colors.text + "80" }}
                >
                  Organizational Skills - Part 1
                </p>
              </div>
            </div>
          </div>

          {/* Center - Slide counter */}
          <div className="flex justify-center">
            <div
              className="flex items-center gap-3 rounded-full px-6 py-3 shadow-inner"
              style={{ backgroundColor: colors.text + "08" }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: colors.primary }}
              >
                {currentSlide}
              </span>
              <span className="text-lg" style={{ color: colors.text + "40" }}>
                /
              </span>
              <span
                className="text-lg font-medium"
                style={{ color: colors.text + "80" }}
              >
                {slides.length}
              </span>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigateToSlide(1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 hover:bg-black/10"
              title="Go to start (Home)"
            >
              <Home className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setShowTOC(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 hover:bg-black/10"
              title="Table of contents"
            >
              <List className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setShowThumbnails((prev) => !prev)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 ${
                showThumbnails ? "bg-black/15" : "hover:bg-black/10"
              }`}
              title="Toggle thumbnails (G)"
            >
              <Layers className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setShowTimer((prev) => !prev)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 ${
                showTimer ? "bg-black/15" : "hover:bg-black/10"
              }`}
              title="Toggle timer (T)"
            >
              <Timer className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 hover:bg-black/10"
              title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" style={{ color: colors.text }} />
              ) : (
                <Maximize className="h-5 w-5" style={{ color: colors.text }} />
              )}
            </button>
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 hover:bg-black/10"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-5 w-5" style={{ color: colors.text }} />
            </button>
            <button
              onClick={() => setShowNav(false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:scale-105 hover:bg-black/10"
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

      {/* Floating nav toggle button (shows briefly when nav is hidden) */}
      <button
        onClick={() => setShowNav(true)}
        className={`fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-500 ${
          showNavHint
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
        style={{ backgroundColor: colors.text + "E0" }}
        title="Show navigation (press H)"
      >
        <span className="text-sm font-medium text-white">
          {currentSlide} / {slides.length}
        </span>
        <span className="hidden text-xs text-white/60 sm:inline">
          Press H to toggle
        </span>
      </button>

      {/* Table of Contents */}
      <TableOfContents
        isOpen={showTOC}
        onClose={() => setShowTOC(false)}
        currentSlide={currentSlide}
        onNavigate={navigateToSlide}
      />

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Thumbnail Strip */}
      <ThumbnailStrip
        isOpen={showThumbnails}
        currentSlide={currentSlide}
        onNavigate={navigateToSlide}
      />

      {/* Presentation Timer */}
      <PresentationTimer isVisible={showTimer} />
    </div>
  );
}
