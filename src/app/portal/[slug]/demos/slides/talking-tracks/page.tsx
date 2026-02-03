"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mic,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  MessageSquare,
  Users,
  Clock,
  BookOpen,
  Target,
  CheckCircle,
  FileText,
  AlertCircle,
  ScrollText,
  X,
} from "lucide-react";

// Talking tracks for Module 1 (Organizational Skills Part 1)
const talkingTracks: Array<{
  num: number;
  title: string;
  talkingPoints: string[];
  presenterTips?: string[];
  transition?: string;
}> = [
  {
    num: 1,
    title: "Organizational Skills Course Overview",
    talkingPoints: [
      "Welcome to the Organizational Skills training. This is the first of four modules that will build your organizational competencies step by step.",
      "We'll focus on practical skills you can apply immediately in your CHW work - managing time, tracking information, and staying on top of your responsibilities.",
      "Organization isn't about being perfect. It's about having systems that help you serve your community reliably and consistently.",
    ],
    presenterTips: [
      "Ask participants to share one organizational challenge they currently face",
      "Set a welcoming tone - this is about building skills, not judging current habits",
    ],
    transition: "Let's begin with a quick knowledge check to see where everyone is starting from.",
  },
  {
    num: 2,
    title: "Pre-Test (Knowledge Check Placeholder)",
    talkingPoints: [
      "Before we dive in, we want to understand your current knowledge base. This isn't a graded test - it's a tool to help us identify areas to focus on.",
      "Take your time with each question. If you're unsure, make your best guess.",
      "We'll revisit these concepts at the end of the module to see how much you've learned.",
    ],
    presenterTips: [
      "Allow 5-7 minutes for completion",
      "Reassure participants there are no wrong answers - this is purely diagnostic",
    ],
  },
  {
    num: 3,
    title: "Learning Objective 1",
    talkingPoints: [
      "Our first objective is understanding WHY organizational skills matter. This isn't just about keeping a tidy desk.",
      "When you're organized, you can follow through on what you promise. That builds trust with the people and communities you serve.",
      "Think about the CHWs you admire - chances are, they have strong organizational habits that help them be reliable.",
    ],
    presenterTips: [
      "Connect this to real CHW experiences",
      "Ask: 'Can you think of a time when being organized made a difference in your work?'",
    ],
  },
  {
    num: 4,
    title: "Learning Objective 2",
    talkingPoints: [
      "Next, we'll identify the core organizational tasks that CHWs handle every day. These tasks are common across all CHW settings.",
      "From scheduling to documentation to follow-up - these are the building blocks of organized practice.",
      "By naming these tasks clearly, we can develop better strategies for managing them.",
    ],
  },
  {
    num: 5,
    title: "Learning Objective 3",
    talkingPoints: [
      "Organization isn't just about efficiency - it's about accountability. When you're organized, you can demonstrate what you've done and why.",
      "Follow-through builds trust. When community members see you remember details and keep your commitments, they trust you more.",
      "This objective connects organization to relationships - the heart of CHW work.",
    ],
    presenterTips: [
      "Emphasize the relationship between organization and trust",
    ],
  },
  {
    num: 6,
    title: "Learning Objective 4",
    talkingPoints: [
      "Finally, we'll learn concrete strategies. These aren't complicated systems - they're practical approaches that fit real CHW work.",
      "Everyone organizes differently. We'll explore options so you can find what works for YOUR style and setting.",
      "The goal is sustainable organization - systems you can maintain without burning out.",
    ],
    transition: "Now that we know our objectives, let's explore why organization matters so much in CHW work.",
  },
  {
    num: 7,
    title: "Purpose of Organizational Skills",
    talkingPoints: [
      "Let's start with the 'why.' Organizational skills are the foundation of reliability. When you're organized, you can keep your word.",
      "Community members often feel let down by systems. When a CHW follows through consistently, it stands out.",
      "Organization reduces stress too. When you know where things are and what's coming next, you feel more in control.",
    ],
    presenterTips: [
      "Share a brief personal example of how organization helped you",
      "Acknowledge that building these skills takes time",
    ],
  },
  {
    num: 8,
    title: "Organizational Skills as a Core Competency",
    talkingPoints: [
      "Organization is recognized as a core CHW competency for good reason. CHWs juggle many responsibilities across different settings.",
      "Unlike some jobs with predictable routines, CHW work changes day to day. Strong organization helps you adapt while staying consistent.",
      "Texas DSHS and national CHW standards emphasize organizational skills as essential to effective practice.",
    ],
  },
  {
    num: 9,
    title: "Module List",
    talkingPoints: [
      "Here's what we'll cover in the full Organizational Skills curriculum. Today is Part 1 - the foundation.",
      "We'll explore time management, task tracking, documentation basics, prioritization, and ethical considerations.",
      "Each topic builds on the previous one, so we'll take them in order.",
    ],
    presenterTips: [
      "Point to each topic briefly but don't go into detail yet",
    ],
  },
  {
    num: 10,
    title: "What Organization Looks Like in CHW Work",
    talkingPoints: [
      "So what does organization actually look like for a CHW? It's tracking appointments, referrals, and follow-up needs.",
      "It's knowing what information you shared with whom, and what the next steps are for each person you're supporting.",
      "Good organization respects people's time and situations. It's about being prepared when you meet with someone.",
    ],
    presenterTips: [
      "Ask participants to share specific organizational tasks from their work",
    ],
  },
  {
    num: 11,
    title: "Organization and Trust",
    talkingPoints: [
      "Trust is everything in CHW work. When you remember details about someone's situation, they feel valued.",
      "Following up when you say you will - that's how trust is built, one kept commitment at a time.",
      "Disorganization can damage trust quickly. Missed appointments or forgotten promises erode the relationship.",
    ],
    presenterTips: [
      "This is a great moment for discussion: 'How does it feel when someone remembers details about you?'",
    ],
  },
  {
    num: 12,
    title: "Organization and Professional Boundaries",
    talkingPoints: [
      "Here's something people don't always consider: organization helps maintain boundaries. When you're organized, you're less likely to overcommit.",
      "Clear tracking of your workload helps you say 'I can help with this, but not until next week' - setting honest expectations.",
      "Without organization, it's easy to take on too much and then either burn out or let people down.",
    ],
  },
  {
    num: 13,
    title: "Common Organizational Responsibilities",
    talkingPoints: [
      "Let's name the specific responsibilities CHWs organize. Schedules - knowing where you need to be and when.",
      "Referral tracking - knowing which referrals are pending, completed, or need follow-up.",
      "Documentation of education and outreach. Communication logs with individuals and partners.",
    ],
    presenterTips: [
      "Have participants add to this list from their own experience",
    ],
  },
  {
    num: 14,
    title: "Time Management Basics",
    talkingPoints: [
      "Time management is about being intentional with your hours. You have limited time - how do you use it wisely?",
      "It starts with knowing what needs to be done, then deciding when to do each thing.",
      "Good time management means leaving buffer room for the unexpected - because in CHW work, something unexpected always comes up.",
    ],
  },
  {
    num: 15,
    title: "Prioritizing Tasks",
    talkingPoints: [
      "Not everything is equally urgent. Prioritization helps you decide what needs attention first.",
      "Consider urgency - does this have a deadline? Impact - what are the consequences of waiting? Commitments - did you promise to do this by a certain time?",
      "Learning to prioritize is a skill. It gets easier with practice and self-awareness.",
    ],
    presenterTips: [
      "Use a simple example: 'If you have a home visit, a documentation deadline, and a phone call to return - how do you decide what comes first?'",
    ],
  },
  {
    num: 16,
    title: "Managing Multiple Responsibilities",
    talkingPoints: [
      "CHWs often juggle outreach, documentation, follow-up, and more - all in the same day. That's a lot to manage.",
      "The key is having systems so you don't have to hold everything in your head. Write it down. Use reminders.",
      "Balance doesn't mean doing everything perfectly. It means not sacrificing quality in one area while focusing on another.",
    ],
  },
  {
    num: 17,
    title: "Organizing Information Ethically",
    talkingPoints: [
      "Now let's talk about ethics. The information you handle about community members is sensitive. Organization must include security.",
      "Keep information accurate - wrong information can harm people. Keep it secure - not everyone should have access.",
      "Only share what's appropriate, with the right people, following your organization's policies.",
    ],
    presenterTips: [
      "This is a good moment to reference HIPAA basics if applicable to participants' work",
    ],
  },
  {
    num: 18,
    title: "Case Example: Organized Follow-Up",
    talkingPoints: [
      "Let me share an example. A CHW is supporting multiple individuals with referrals to housing assistance.",
      "She uses a simple checklist with names, referral dates, and scheduled follow-up dates. Each week she reviews the list.",
      "Because she tracks this systematically, no one falls through the cracks. Every person gets the follow-up they need.",
    ],
    presenterTips: [
      "Ask: 'How would you adapt this example to your own work?'",
    ],
  },
  {
    num: 19,
    title: "Reflection Prompt: Organization Habits",
    talkingPoints: [
      "Let's pause for reflection. Think about your current organizational habits. What's working well for you?",
      "What feels challenging? Is it tracking information? Managing time? Following up?",
      "There's no judgment here - we all have areas to improve. The first step is honest self-assessment.",
    ],
    presenterTips: [
      "Give participants 2-3 minutes of quiet reflection time",
      "Optional: invite voluntary sharing, but don't pressure anyone",
    ],
  },
  {
    num: 20,
    title: "Activity: Identifying Organizational Needs",
    talkingPoints: [
      "Now let's make this practical. In small groups, I want you to identify common organizational challenges in your work.",
      "Then discuss simple strategies that might address those challenges. Keep it realistic - we're looking for small changes that make a difference.",
      "Each group will share one challenge and one strategy with the larger group.",
    ],
    presenterTips: [
      "Form groups of 3-4 people",
      "Allow 8-10 minutes for discussion, then 5 minutes for sharing",
      "Write strategies on a whiteboard or flip chart as groups share",
    ],
    transition: "Great insights from everyone. Let's build on these ideas as we continue.",
  },
  {
    num: 21,
    title: "Organization and Daily Planning",
    talkingPoints: [
      "Daily planning is one of the most powerful organizational habits you can develop. It only takes a few minutes.",
      "At the start of your day - or the night before - review what needs to happen. Make a list or check your calendar.",
      "This simple habit reduces stress and helps you stay focused when the day gets busy.",
    ],
    presenterTips: [
      "Ask who already does daily planning and what format they use",
    ],
  },
  {
    num: 22,
    title: "Using Simple Planning Tools",
    talkingPoints: [
      "Planning tools don't have to be fancy. A paper notebook, a calendar app, or a simple checklist all work.",
      "The best tool is the one you'll actually use. If you hate digital tools, use paper. If you always have your phone, use an app.",
      "Consistency matters more than the specific tool. Find something that fits your style and stick with it.",
    ],
    presenterTips: [
      "Show 2-3 simple examples: paper planner, phone calendar, sticky notes",
      "Emphasize there's no 'right' answer - it's about personal fit",
    ],
  },
  {
    num: 23,
    title: "Organizing Appointments and Schedules",
    talkingPoints: [
      "Appointments are core to CHW work. Clear scheduling prevents missed meetings and confusion.",
      "When you schedule something, write it down immediately. Include the time, location, and purpose.",
      "Set reminders - especially for things that are days or weeks away. Your memory isn't enough.",
    ],
  },
  {
    num: 24,
    title: "Tracking Follow-Up Tasks",
    talkingPoints: [
      "Follow-up is where trust is built or broken. But it's easy to forget follow-up tasks when you're busy.",
      "Create a system for tracking follow-ups. This could be a list, a calendar reminder, or notes on each person's file.",
      "The key is having one place you check regularly so nothing slips through the cracks.",
    ],
    presenterTips: [
      "Demonstrate a simple follow-up tracking method",
    ],
  },
  {
    num: 25,
    title: "Organizing Contacts and Resources",
    talkingPoints: [
      "CHWs need to access contacts and resources quickly. A community member asks about food assistance - you need that information ready.",
      "Maintain organized lists of key contacts, resources, and referral information. Update them regularly.",
      "When information is organized and accessible, you can respond to needs more quickly and accurately.",
    ],
  },
  {
    num: 26,
    title: "Managing Information Overload",
    talkingPoints: [
      "CHWs receive a lot of information - emails, texts, updates, training materials. It can feel overwhelming.",
      "The solution is organizing information by relevance and purpose. What do you need now? What can you file for later?",
      "You don't need to remember everything - you need to know where to find it when you need it.",
    ],
    presenterTips: [
      "Validate that information overload is a common challenge",
      "Suggest practical tips: email folders, starred messages, etc.",
    ],
  },
  {
    num: 27,
    title: "Organizing Paper and Digital Materials",
    talkingPoints: [
      "Some CHWs work mostly with paper, others mostly digital, many use both. Either can work if it's organized.",
      "Clear labeling is essential. Use consistent naming for files and folders. Date your documents.",
      "Consistent storage means you can find things when you need them - even months later.",
    ],
  },
  {
    num: 28,
    title: "Organization and Confidentiality",
    talkingPoints: [
      "Let's return to ethics. Confidentiality requires organization. Secure storage isn't optional.",
      "Follow your agency's policies for storing and accessing personal information. Know who should and shouldn't have access.",
      "Organization protects both the people you serve and yourself. Breaches can have serious consequences.",
    ],
    presenterTips: [
      "Reference specific organizational policies if known",
      "Emphasize this isn't just about rules - it's about respect for people's privacy",
    ],
  },
  {
    num: 29,
    title: "Organizing Communication",
    talkingPoints: [
      "Calls, texts, emails - communication can get chaotic. Organization helps you respond professionally.",
      "Track who you need to contact, who you're waiting to hear from, and what was discussed.",
      "Clear communication organization means no one waits too long for a response, and you don't forget important messages.",
    ],
  },
  {
    num: 30,
    title: "Time Blocking Basics",
    talkingPoints: [
      "Time blocking means setting specific times for specific tasks. Instead of 'I'll do documentation sometime today,' you schedule '2-3pm: documentation.'",
      "This technique helps manage competing responsibilities. When you know documentation has its time, you can focus on outreach without guilt.",
      "Start with your most important tasks. Block time for them first, then fill in around them.",
    ],
    presenterTips: [
      "Show a simple example of a time-blocked day",
      "Acknowledge this takes practice and adjustment",
    ],
  },
  {
    num: 31,
    title: "Managing Interruptions",
    talkingPoints: [
      "Interruptions are constant in CHW work. Someone drops by, the phone rings, a crisis emerges. That's the reality.",
      "Organization helps you return to tasks after interruptions. When you know where you left off, you can pick back up.",
      "Write down where you are before addressing an interruption. It only takes a second and saves mental energy.",
    ],
  },
  {
    num: 32,
    title: "Organizing Work Across Settings",
    talkingPoints: [
      "CHWs work in offices, homes, community centers, outdoors. Your organizational system needs to be portable.",
      "Whether it's a notebook you carry, an app on your phone, or both - make sure you can access your system anywhere.",
      "Flexibility is key. A system that only works at your desk won't work for CHW life.",
    ],
    presenterTips: [
      "Ask participants what they carry with them for fieldwork",
    ],
  },
  {
    num: 33,
    title: "Organization and Self-Care",
    talkingPoints: [
      "Here's something important: good organization is self-care. When you're organized, you're less stressed.",
      "Knowing what's coming, having things under control - that reduces anxiety and prevents burnout.",
      "Build boundaries into your organizational system. Schedule breaks. Protect time for yourself.",
    ],
    presenterTips: [
      "Connect organization to wellbeing - this is often a new perspective for participants",
    ],
  },
  {
    num: 34,
    title: "Common Organizational Challenges",
    talkingPoints: [
      "Let's be honest about challenges. Competing priorities - everything feels urgent. Limited time - there's never enough.",
      "Changing circumstances - what was planned gets disrupted. Too much information - hard to track it all.",
      "Awareness of these challenges is the first step. Then we can choose realistic strategies.",
    ],
    presenterTips: [
      "Normalize that everyone faces these challenges",
      "Avoid suggesting there's a 'perfect' solution",
    ],
  },
  {
    num: 35,
    title: "Case Example: Managing Multiple Referrals",
    talkingPoints: [
      "Here's another real-world example. A CHW supports 25 people, each with different referral needs and timelines.",
      "He creates a simple checklist: name, referral type, date, status, next step. He reviews it every Monday and Thursday.",
      "This system takes 15 minutes per week but ensures accurate communication and timely follow-up for everyone.",
    ],
    presenterTips: [
      "Emphasize the simplicity of the system - it doesn't have to be complicated",
    ],
  },
  {
    num: 36,
    title: "Reflection: Organization Strengths",
    talkingPoints: [
      "Let's shift to strengths. What organizational strategies are already working well for you?",
      "Think about the times you felt on top of things. What were you doing differently?",
      "Building on existing strengths is often more effective than trying to change everything at once.",
    ],
    presenterTips: [
      "Encourage participants to write down 2-3 strengths",
      "Positive framing helps with motivation and confidence",
    ],
  },
  {
    num: 37,
    title: "Activity: Personal Organization Mapping",
    talkingPoints: [
      "This activity is about mapping your day. Draw out a typical workday with its main tasks and transitions.",
      "Then identify where organizational tools could improve your workflow. Where do things get messy?",
      "We're looking for specific, actionable spots where a small change could make a difference.",
    ],
    presenterTips: [
      "Provide paper and markers",
      "Allow 10 minutes for individual mapping",
      "Optional pair-and-share after",
    ],
    transition: "These maps give you a personal roadmap for improvement. Keep them for reference.",
  },
  {
    num: 38,
    title: "Organization and Continuous Improvement",
    talkingPoints: [
      "No organizational system is perfect forever. As your work changes, your systems need to adapt.",
      "Check in with yourself periodically. Is this still working? What's slipping? What could be better?",
      "Continuous improvement means small adjustments over time, not dramatic overhauls.",
    ],
  },
  {
    num: 39,
    title: "Preparing for Applied Organizational Skills",
    talkingPoints: [
      "Part 1 is your foundation. In Part 2, we'll apply these concepts to real CHW scenarios.",
      "You'll practice using organizational tools in simulated situations before applying them in your actual work.",
      "Between now and then, start noticing your organizational habits. What works? What doesn't?",
    ],
    transition: "Let's summarize what we've covered before wrapping up this section.",
  },
  {
    num: 40,
    title: "Part 1 Summary",
    talkingPoints: [
      "We've covered a lot of ground in Part 1. Let me summarize the key themes.",
      "We explored why organizational skills matter for CHW practice - reliability, trust, boundaries, and self-care.",
      "We introduced foundational practices for managing time, information, and responsibilities.",
    ],
    presenterTips: [
      "This is a good place to pause for questions",
    ],
  },
  {
    num: 41,
    title: "Organization and Reliability",
    talkingPoints: [
      "Reliability is the outcome of organization. When you track tasks and follow through, people can count on you.",
      "This applies to community members, partners, and your organization. Everyone benefits from your reliability.",
      "It's not about being superhuman - it's about having systems that support consistent follow-through.",
    ],
  },
  {
    num: 42,
    title: "Organization and Professional Credibility",
    talkingPoints: [
      "Organized CHWs are seen as professionals. Preparedness and follow-through strengthen your credibility.",
      "When you come to a meeting with notes organized, referrals tracked, and next steps clear - people notice.",
      "Credibility opens doors. It leads to more trust, more opportunities, and more effective partnerships.",
    ],
  },
  {
    num: 43,
    title: "Organization and Clear Communication",
    talkingPoints: [
      "Organization supports communication. When you know the details, you can share accurate information.",
      "Before a meeting or call, reviewing your notes helps you communicate clearly and confidently.",
      "Clear communication prevents misunderstandings and builds stronger relationships.",
    ],
  },
  {
    num: 44,
    title: "Organizing Workload Expectations",
    talkingPoints: [
      "Organization helps you set honest expectations. You know what's on your plate, so you can say what's realistic.",
      "This prevents overcommitment - promising more than you can deliver, then letting people down.",
      "It's better to commit to less and follow through than to promise everything and struggle to deliver.",
    ],
    presenterTips: [
      "Connect this to boundary-setting discussed earlier",
    ],
  },
  {
    num: 45,
    title: "Organization and Ethical Practice",
    talkingPoints: [
      "We keep returning to ethics because it's central. Organization prevents errors that could harm people.",
      "When information is organized, you're less likely to mix up details or share the wrong thing.",
      "Confidentiality, accuracy, and appropriate sharing all depend on good organization.",
    ],
  },
  {
    num: 46,
    title: "Organization and Accountability Systems",
    talkingPoints: [
      "Accountability systems are how you track and demonstrate your work. Reminders, checklists, documentation.",
      "These tools aren't about surveillance - they're about supporting your own follow-through.",
      "When someone asks 'did you complete that referral?' you can answer with confidence because you have records.",
    ],
  },
  {
    num: 47,
    title: "Organization Across Teams",
    talkingPoints: [
      "CHWs rarely work alone. Team-based organization means everyone knows who's doing what.",
      "Clear task tracking and communication prevent duplication and gaps. Nothing falls between the cracks.",
      "When you're organized, you're a better team member. Others can count on you to do your part.",
    ],
  },
  {
    num: 48,
    title: "Organization in High-Volume Work",
    talkingPoints: [
      "High caseloads require even more organizational discipline. Simple systems work best under pressure.",
      "When volume is high, efficiency matters - but not at the cost of quality or care for individuals.",
      "Focus on the essentials. What must be tracked for each person? What can be streamlined?",
    ],
    presenterTips: [
      "Acknowledge the reality of high-volume work without encouraging cutting corners",
    ],
  },
  {
    num: 49,
    title: "Organization and Adaptability",
    talkingPoints: [
      "Good organizational systems are flexible, not rigid. They bend when circumstances change.",
      "When priorities shift - and they will - your system should help you adjust, not lock you in.",
      "Keep your most important tasks visible so you can reprioritize quickly when needed.",
    ],
  },
  {
    num: 50,
    title: "Organization and Self-Reflection",
    talkingPoints: [
      "Self-reflection is key to improving organization. Notice what works and what doesn't.",
      "At the end of each week, take a few minutes: What went well organizationally? What could be better?",
      "This ongoing reflection leads to gradual improvement over time.",
    ],
    presenterTips: [
      "Suggest participants try weekly reflection as homework",
    ],
  },
  {
    num: 51,
    title: "Reflection: Organization Impact",
    talkingPoints: [
      "Let's reflect on impact. How does being organized - or disorganized - affect the people you serve?",
      "Think about a specific person. How would their experience change if your organization improved?",
      "This connects our personal habits to real community outcomes.",
    ],
    presenterTips: [
      "Give 2-3 minutes for quiet reflection",
      "This can be a powerful motivating moment",
    ],
  },
  {
    num: 52,
    title: "Activity: Improving One System",
    talkingPoints: [
      "For this activity, identify ONE organizational system you want to improve. Just one - keep it focused.",
      "Outline simple changes you could try in the next week. Small, concrete steps.",
      "Write this down as a commitment to yourself. We'll check in on progress in Part 2.",
    ],
    presenterTips: [
      "Provide index cards for writing commitments",
      "Encourage specificity: 'I will check my follow-up list every morning before 9am'",
    ],
  },
  {
    num: 53,
    title: "Preparing for Applied Organizational Skills",
    talkingPoints: [
      "Part 2 will take everything we've discussed and put it into practice with real-world scenarios.",
      "You'll apply these foundational concepts to actual CHW workflows and situations.",
      "The foundation we've built today will support everything that comes next.",
    ],
  },
  {
    num: 54,
    title: "Organizational Skills and Career Growth",
    talkingPoints: [
      "Strong organizational skills aren't just about today's work - they support your career growth.",
      "CHWs with strong organization are often given more responsibility. They're seen as ready for leadership.",
      "Investing in these skills now pays dividends throughout your career.",
    ],
  },
  {
    num: 55,
    title: "Post-Test (Knowledge Check Placeholder)",
    talkingPoints: [
      "Now we'll check what you've learned with a post-test. This mirrors the pre-test from the beginning.",
      "You should notice improvements in your confidence and knowledge. That's growth.",
      "Take your time and answer based on what you've learned today.",
    ],
    presenterTips: [
      "Allow 5-7 minutes",
      "Consider comparing pre and post scores as a group (anonymously) to celebrate learning",
    ],
  },
  {
    num: 56,
    title: "Key Takeaways",
    talkingPoints: [
      "Let me highlight the key takeaways from Part 1. First: organizational skills support reliability.",
      "Second: organization enables accountability and builds trust with communities and partners.",
      "Third: good organization supports sustainability - both your effectiveness and your wellbeing.",
    ],
  },
  {
    num: 57,
    title: "Closing Reflection",
    talkingPoints: [
      "As we close, consider how improved organization can strengthen your CHW role.",
      "What would be different if you felt more organized? Less stressed? More trusted? More effective?",
      "Carry that vision with you as you implement what you've learned.",
    ],
    presenterTips: [
      "Keep this reflective and motivational",
      "Pause for quiet consideration",
    ],
  },
  {
    num: 58,
    title: "Part 1 Completion",
    talkingPoints: [
      "Congratulations on completing Organizational Skills Part 1. You've built an important foundation.",
      "The concepts and strategies from today will support your applied practice in Parts 2, 3, and 4.",
      "Take time to practice what you've learned before we meet again.",
    ],
  },
  {
    num: 59,
    title: "Looking Ahead to Part 2",
    talkingPoints: [
      "In Part 2, we'll apply these foundational skills to real workflows, documentation, and coordination.",
      "You'll practice with scenarios that reflect actual CHW work. It gets more hands-on.",
      "Between now and then, notice your organizational habits. Come ready to share observations.",
    ],
    transition: "That's a preview of what's coming. Let's summarize the full foundation before we finish.",
  },
  {
    num: 60,
    title: "Organizational Skills Foundation Summary",
    talkingPoints: [
      "To summarize our foundation: organizational skills help CHWs manage time, information, and responsibilities.",
      "We explored why organization matters, what it looks like, and basic strategies to improve.",
      "This foundation prepares you for the applied, advanced, and integrated practice in Parts 2-4.",
    ],
  },
  {
    num: 61,
    title: "Appendix and References",
    talkingPoints: [
      "The references supporting this module include Texas DSHS CHW Core Competencies and other professional standards.",
      "Full APA citations will be provided in the final appendix for anyone who wants to explore further.",
      "Thank you for your engagement today. See you in Part 2.",
    ],
    presenterTips: [
      "Make reference materials available for those interested",
      "End with appreciation for participants' time and attention",
    ],
  },
];

// Get slide type for styling
function getSlideType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("overview")) return "overview";
  if (lower.includes("objective")) return "objective";
  if (lower.includes("pre-test") || lower.includes("post-test")) return "test";
  if (lower.includes("case example")) return "case";
  if (lower.includes("reflection")) return "reflection";
  if (lower.includes("activity")) return "activity";
  if (lower.includes("summary") || lower.includes("takeaway") || lower.includes("completion")) return "summary";
  return "content";
}

function getSlideIcon(type: string) {
  switch (type) {
    case "overview":
      return <BookOpen className="h-4 w-4" />;
    case "objective":
      return <Target className="h-4 w-4" />;
    case "test":
      return <CheckCircle className="h-4 w-4" />;
    case "case":
      return <Users className="h-4 w-4" />;
    case "reflection":
      return <Lightbulb className="h-4 w-4" />;
    case "activity":
      return <MessageSquare className="h-4 w-4" />;
    case "summary":
      return <Clock className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getSlideTypeColor(type: string) {
  switch (type) {
    case "overview":
      return "bg-amber-900/30 text-amber-400 border-amber-800/50";
    case "objective":
      return "bg-emerald-900/30 text-emerald-400 border-emerald-800/50";
    case "test":
      return "bg-sky-900/30 text-sky-400 border-sky-800/50";
    case "case":
      return "bg-rose-900/30 text-rose-400 border-rose-800/50";
    case "reflection":
      return "bg-violet-900/30 text-violet-400 border-violet-800/50";
    case "activity":
      return "bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800/50";
    case "summary":
      return "bg-teal-900/30 text-teal-400 border-teal-800/50";
    default:
      return "bg-white/5 text-gray-400 border-white/10";
  }
}

function TalkingTrackCard({
  track,
  isExpanded,
  onToggle,
}: {
  track: (typeof talkingTracks)[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const type = getSlideType(track.title);

  return (
    <div
      className="overflow-hidden rounded-xl border transition-all"
      style={{
        borderColor: isExpanded ? "rgba(212, 175, 55, 0.4)" : "rgba(212, 175, 55, 0.15)",
        backgroundColor: isExpanded ? "rgba(212, 175, 55, 0.05)" : "rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              color: "#D4AF37",
            }}
          >
            {track.num}
          </span>
          <div>
            <h3 className="font-semibold text-white">{track.title}</h3>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${getSlideTypeColor(type)}`}
            >
              {getSlideIcon(type)}
              {type}
            </span>
          </div>
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t bg-black/30 p-5" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
          {/* Talking Points */}
          <div className="mb-5">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              <Mic className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Talking Points
            </h4>
            <ul className="space-y-3">
              {track.talkingPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-black"
                    style={{ backgroundColor: "#D4AF37" }}
                  >
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed text-gray-300">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Presenter Tips */}
          {track.presenterTips && track.presenterTips.length > 0 && (
            <div className="mb-5">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                <Lightbulb className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Presenter Tips
              </h4>
              <ul className="space-y-2">
                {track.presenterTips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-3"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                    <p className="text-sm text-[#F6E6C1]">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transition */}
          {track.transition && (
            <div className="rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#D4AF37]">
                <ArrowLeft className="h-4 w-4 rotate-180" />
                Transition to Next Slide
              </h4>
              <p className="text-sm italic text-[#F6E6C1]">&ldquo;{track.transition}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TalkingTracksPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set([1]));
  const [expandAll, setExpandAll] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);

  const toggleCard = (num: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (expandAll) {
      setExpandedCards(new Set());
    } else {
      setExpandedCards(new Set(talkingTracks.map((t) => t.num)));
    }
    setExpandAll(!expandAll);
  };

  const slidesWithTips = talkingTracks.filter((t) => t.presenterTips && t.presenterTips.length > 0).length;
  const slidesWithTransitions = talkingTracks.filter((t) => t.transition).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b backdrop-blur-md" style={{ borderColor: "rgba(212, 175, 55, 0.2)", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href={`/portal/${slug}/demos/slides`}
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Slide Generator
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#D4AF37" }}
            >
              <Mic className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold">Talking Tracks</h1>
              <p className="text-xs text-gray-500">Presenter Scripts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              fontFamily: "Quattrocento Sans, serif",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Talking Tracks
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Presenter talking points and delivery guidance for all 61 slides of the
            Organizational Skills foundation module.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-10 grid grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white/5 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
            <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
              {talkingTracks.length}
            </p>
            <p className="text-sm text-gray-500">Slides</p>
          </div>
          <div className="rounded-xl border bg-white/5 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
            <p className="text-2xl font-bold text-[#D4AF37]">{slidesWithTips}</p>
            <p className="text-sm text-gray-500">With Tips</p>
          </div>
          <div className="rounded-xl border bg-white/5 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
            <p className="text-2xl font-bold text-[#D4AF37]">{slidesWithTransitions}</p>
            <p className="text-sm text-gray-500">With Transitions</p>
          </div>
          <div className="rounded-xl border bg-white/5 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
            <p className="text-2xl font-bold text-[#D4AF37]">~45 min</p>
            <p className="text-sm text-gray-500">Est. Duration</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Click on any card to view talking points and presenter guidance
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFullScript(true)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)" }}
            >
              <ScrollText className="h-4 w-4" />
              Full Script
            </button>
            <button
              onClick={handleExpandAll}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: "#D4AF37", color: "#D4AF37" }}
            >
              {expandAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              )}
            </button>
          </div>
        </div>

        {/* Talking Track Cards */}
        <div className="space-y-3">
          {talkingTracks.map((track) => (
            <TalkingTrackCard
              key={track.num}
              track={track}
              isExpanded={expandedCards.has(track.num)}
              onToggle={() => toggleCard(track.num)}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 rounded-xl border p-6 text-center" style={{ borderColor: "rgba(212, 175, 55, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.02)" }}>
          <p className="text-sm text-gray-500">
            CHW360 | Educational Use Only | Not Medical Advice
          </p>
          <p className="mt-2 text-xs text-gray-600">
            These talking tracks are designed to help trainers deliver the Organizational Skills
            curriculum effectively. Adapt language and examples to your audience.
          </p>
        </div>
      </main>

      {/* Full Script Modal */}
      {showFullScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-[90vh] w-full max-w-3xl flex-col rounded-2xl border bg-black" style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]">
                  <ScrollText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Full Talking Track Script</h2>
                  <p className="text-xs text-gray-500">Module 1: Organizational Skills Part 1</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullScript(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="prose prose-invert max-w-none">
                {talkingTracks.map((track) => (
                  <div key={track.num} className="mb-8 border-b pb-8 last:border-0" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
                    <h3 className="mb-4 text-lg font-bold text-[#D4AF37]">
                      Slide {track.num}: {track.title}
                    </h3>

                    <div className="mb-4">
                      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Talking Points
                      </p>
                      {track.talkingPoints.map((point, idx) => (
                        <p key={idx} className="mb-3 leading-relaxed text-gray-300">
                          {point}
                        </p>
                      ))}
                    </div>

                    {track.presenterTips && track.presenterTips.length > 0 && (
                      <div className="mb-4 rounded-lg bg-[#D4AF37]/10 p-4">
                        <p className="mb-2 text-sm font-semibold text-[#D4AF37]">
                          Presenter Tips
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-[#F6E6C1]/80">
                          {track.presenterTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {track.transition && (
                      <div className="rounded-lg bg-[#D4AF37]/10 p-4">
                        <p className="mb-1 text-sm font-semibold text-[#D4AF37]">
                          Transition
                        </p>
                        <p className="text-sm italic text-[#F6E6C1]/80">
                          &ldquo;{track.transition}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
              <p className="text-center text-xs text-gray-600">
                {talkingTracks.length} slides • Scroll to read full script
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
