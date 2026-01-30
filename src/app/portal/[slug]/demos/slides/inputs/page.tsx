"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ChevronDown,
  ChevronUp,
  Book,
  Target,
  Lightbulb,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  Layers,
  X,
  Eye,
} from "lucide-react";

// Full slide content for each module
const fullContent: Record<string, Array<{ num: number; title: string; content: string }>> = {
  "part-1": [
    { num: 1, title: "Organizational Skills Course Overview", content: "Organizational skills help Community Health Workers manage time, information, tasks, and responsibilities effectively. This course introduces foundational organizational practices that support reliable, ethical, and sustainable CHW work across Texas settings." },
    { num: 2, title: "Pre-Test (Knowledge Check Placeholder)", content: "This pre-test includes five questions assessing baseline understanding of organization, time management, and documentation concepts. A QR code will be added later." },
    { num: 3, title: "Learning Objective 1", content: "Learners will be able to explain why organizational skills are essential to effective Community Health Worker practice." },
    { num: 4, title: "Learning Objective 2", content: "Learners will be able to identify core organizational tasks commonly performed by CHWs in community and organizational settings." },
    { num: 5, title: "Learning Objective 3", content: "Learners will be able to recognize how organization supports accountability, follow-through, and trust with individuals and partners." },
    { num: 6, title: "Learning Objective 4", content: "Learners will be able to describe basic strategies for organizing time, information, and responsibilities within CHW scope of practice." },
    { num: 7, title: "Purpose of Organizational Skills", content: "Organizational skills support reliability and consistency. When CHWs stay organized, they are better able to follow through on commitments and support community trust." },
    { num: 8, title: "Organizational Skills as a Core Competency", content: "Organization is a core CHW competency because CHWs manage multiple responsibilities, relationships, and tasks across settings." },
    { num: 9, title: "Module List", content: "This course includes modules on time management, task tracking, basic documentation, prioritization, and ethical organization practices." },
    { num: 10, title: "What Organization Looks Like in CHW Work", content: "Organization includes keeping track of appointments, referrals, information shared, and follow-up needs in a clear and respectful way." },
    { num: 11, title: "Organization and Trust", content: "Community trust grows when CHWs are organized. Remembering details, following up, and being prepared shows respect and reliability." },
    { num: 12, title: "Organization and Professional Boundaries", content: "Organization supports boundaries by helping CHWs manage workload, schedules, and expectations without overextending." },
    { num: 13, title: "Common Organizational Responsibilities", content: "CHWs organize schedules, track referrals, document education, and manage communication with individuals and partners." },
    { num: 14, title: "Time Management Basics", content: "Time management involves planning tasks, setting priorities, and using time intentionally to meet responsibilities." },
    { num: 15, title: "Prioritizing Tasks", content: "Prioritization helps CHWs decide what needs attention first. Urgency, impact, and commitments guide priority decisions." },
    { num: 16, title: "Managing Multiple Responsibilities", content: "CHWs often juggle outreach, documentation, and follow-up. Organization helps balance responsibilities without sacrificing quality." },
    { num: 17, title: "Organizing Information Ethically", content: "Ethical organization includes keeping information accurate, secure, and shared only as appropriate within role and policy." },
    { num: 18, title: "Case Example: Organized Follow-Up", content: "A CHW tracks referrals and schedules follow-up reminders to ensure individuals receive timely support." },
    { num: 19, title: "Reflection Prompt: Organization Habits", content: "Reflect on your current organization habits. What helps you stay organized, and what feels challenging?" },
    { num: 20, title: "Activity: Identifying Organizational Needs", content: "Participants identify common organizational challenges in their work and discuss simple strategies to address them." },
    { num: 21, title: "Organization and Daily Planning", content: "Daily planning helps CHWs manage time and responsibilities. Simple planning supports focus, follow-through, and reduced stress." },
    { num: 22, title: "Using Simple Planning Tools", content: "Planning tools may include calendars, checklists, or notebooks. CHWs choose tools that fit their work style and setting." },
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
    { num: 35, title: "Case Example: Managing Multiple Referrals", content: "A CHW tracks referrals using a simple checklist to ensure follow-up and accurate communication." },
    { num: 36, title: "Reflection: Organization Strengths", content: "Reflect on organizational strategies that work well for you. What helps you stay on track?" },
    { num: 37, title: "Activity: Personal Organization Mapping", content: "Participants map daily tasks and identify where organization tools can improve workflow." },
    { num: 38, title: "Organization and Continuous Improvement", content: "Organization improves over time. CHWs adjust systems as responsibilities change." },
    { num: 39, title: "Preparing for Applied Organizational Skills", content: "This foundation prepares learners for applying organizational skills in real scenarios in Part 2." },
    { num: 40, title: "Part 1 Summary", content: "Organizational Skills — Part 1 introduced foundational practices for managing time, information, and responsibilities." },
    { num: 41, title: "Organization and Reliability", content: "Reliability depends on organization. When CHWs track tasks and follow through, individuals and partners experience consistent support." },
    { num: 42, title: "Organization and Professional Credibility", content: "Organized CHWs demonstrate professionalism. Preparedness and follow-through strengthen credibility with communities and organizations." },
    { num: 43, title: "Organization and Clear Communication", content: "Organization supports clear communication. Knowing next steps and details helps CHWs provide accurate information." },
    { num: 44, title: "Organizing Workload Expectations", content: "Clear organization helps manage expectations. CHWs communicate timelines and capacity honestly to avoid overcommitment." },
    { num: 45, title: "Organization and Ethical Practice", content: "Ethical practice includes managing information responsibly. Organization helps prevent errors and protect confidentiality." },
    { num: 46, title: "Organization and Accountability Systems", content: "Accountability systems include reminders, checklists, and documentation. These tools support consistent follow-through." },
    { num: 47, title: "Organization Across Teams", content: "CHWs often work with teams. Organized communication and task tracking support collaboration and shared goals." },
    { num: 48, title: "Organization in High-Volume Work", content: "High workloads require simple systems. CHWs focus on efficiency without sacrificing quality or care." },
    { num: 49, title: "Organization and Adaptability", content: "Organized systems allow flexibility. CHWs adjust plans while keeping priorities visible." },
    { num: 50, title: "Organization and Self-Reflection", content: "Reflection helps improve organization. CHWs notice what systems work and make changes as needed." },
    { num: 51, title: "Reflection: Organization Impact", content: "Reflect on how organization affects your work. How does being organized support the people you serve?" },
    { num: 52, title: "Activity: Improving One System", content: "Participants identify one organizational system to improve and outline simple changes to try." },
    { num: 53, title: "Preparing for Applied Organizational Skills", content: "Part 2 will focus on applying organizational skills in real-world CHW scenarios and workflows." },
    { num: 54, title: "Organizational Skills and Career Growth", content: "Strong organizational skills support career growth. CHWs demonstrate readiness for increased responsibility." },
    { num: 55, title: "Post-Test (Knowledge Check Placeholder)", content: "This post-test includes five questions assessing foundational organizational concepts. A QR code will be added later." },
    { num: 56, title: "Key Takeaways", content: "Organizational skills support reliability, accountability, and sustainability in CHW practice." },
    { num: 57, title: "Closing Reflection", content: "Consider how improved organization can strengthen your CHW role and reduce stress." },
    { num: 58, title: "Part 1 Completion", content: "You have completed Organizational Skills — Part 1. This foundation supports applied organizational practice." },
    { num: 59, title: "Looking Ahead to Part 2", content: "Part 2 will focus on applying organizational skills to workflows, documentation, and coordination." },
    { num: 60, title: "Organizational Skills Foundation Summary", content: "Organizational Skills — Part 1 established core practices for managing time, information, and responsibilities effectively." },
    { num: 61, title: "Appendix and References", content: "References supporting this module include Texas DSHS CHW Core Competencies, CBPR and PAR literature, ethical evaluation frameworks, and professional standards published between 2020 and 2025. Full APA citations will be provided in the final appendix." },
  ],
  "part-2": [
    { num: 1, title: "Organizational Skills Part 2 Course Overview", content: "Part 2 focuses on applying organizational skills in real CHW work settings. Learners practice managing workflows, documentation, follow-up, and coordination while maintaining ethics, boundaries, and community trust." },
    { num: 2, title: "Pre-Test (Knowledge Check Placeholder)", content: "This pre-test includes five questions reviewing foundational organizational concepts from Part 1. The purpose is to assess readiness for applied organizational practice. A QR code will be added later." },
    { num: 3, title: "Learning Objective 1", content: "Learners will be able to apply organizational skills to manage daily CHW workflows, tasks, and responsibilities effectively." },
    { num: 4, title: "Learning Objective 2", content: "Learners will be able to demonstrate effective task prioritization and follow-up strategies in real-world CHW scenarios." },
    { num: 5, title: "Learning Objective 3", content: "Learners will be able to apply ethical documentation and information management practices within CHW scope." },
    { num: 6, title: "Learning Objective 4", content: "Learners will be able to adapt organizational systems to changing priorities, environments, and community needs." },
    { num: 7, title: "Purpose of Applied Organizational Skills", content: "Applied organizational skills help CHWs manage real workloads, maintain follow-through, and support ethical, consistent service delivery." },
    { num: 8, title: "Module List", content: "This course includes modules on workflow management, task tracking, documentation, coordination, and applied problem-solving." },
    { num: 9, title: "Understanding CHW Workflows", content: "Workflows describe how tasks move from start to completion. CHWs benefit from understanding and organizing these steps clearly." },
    { num: 10, title: "Managing Daily Task Lists", content: "Task lists help CHWs stay focused. Applied practice includes updating lists regularly and marking completed tasks." },
    { num: 11, title: "Prioritizing in Real Time", content: "Priorities shift during the day. CHWs reassess urgency and impact to adjust plans responsibly." },
    { num: 12, title: "Applying Time Management Strategies", content: "Applied time management includes scheduling, time blocking, and allowing flexibility for unexpected needs." },
    { num: 13, title: "Managing Follow-Up Responsibilities", content: "Follow-up ensures continuity of support. CHWs apply tracking systems to remember next steps and deadlines." },
    { num: 14, title: "Documentation in Daily Practice", content: "Documentation records services and follow-up needs. Applied documentation is timely, accurate, and appropriate." },
    { num: 15, title: "Organizing Referrals and Resources", content: "Applied organization includes tracking referrals and maintaining updated resource information for community members." },
    { num: 16, title: "Coordination with Teams and Partners", content: "Applied organization supports coordination. CHWs track communication and responsibilities with partners." },
    { num: 17, title: "Applied Case Example: Daily Workflow", content: "A CHW plans the day using a task list, tracks follow-ups, and adjusts priorities based on community needs." },
    { num: 18, title: "Applied Case Example: Managing High Volume", content: "A CHW uses simple tracking tools to manage a high number of referrals while maintaining accuracy and follow-through." },
    { num: 19, title: "Reflection: Applied Organization", content: "Reflect on how you currently manage tasks and follow-up. What applied strategies could strengthen your workflow?" },
    { num: 20, title: "Activity: Workflow Mapping", content: "Participants map a typical workday and identify points where organizational tools improve efficiency and clarity." },
    { num: 21, title: "Applying Organization Under Pressure", content: "CHWs often work under time pressure. Applied organizational skills help maintain accuracy, calm, and follow-through during busy or stressful days." },
    { num: 22, title: "Managing Competing Priorities", content: "Competing priorities require clear decision-making. CHWs balance urgency, commitments, and available resources when organizing tasks." },
    { num: 23, title: "Organizing Communication Follow-Up", content: "Applied organization includes tracking calls, messages, and emails to ensure timely and professional responses." },
    { num: 24, title: "Scheduling and Rescheduling Effectively", content: "Changes happen. CHWs apply scheduling systems that allow quick updates and clear communication with individuals and partners." },
    { num: 25, title: "Organizing Case Notes", content: "Clear case notes support continuity. CHWs document key actions and next steps without unnecessary detail or personal opinion." },
    { num: 26, title: "Information Sharing Within Teams", content: "Applied organization includes sharing the right information with the right people. CHWs follow protocols and respect confidentiality." },
    { num: 27, title: "Managing Paperwork and Forms", content: "Forms and paperwork require organization. CHWs track what is completed, pending, or needs follow-up." },
    { num: 28, title: "Organizing Digital Tools", content: "Digital tools support applied organization. CHWs use basic features such as folders, reminders, or calendars responsibly." },
    { num: 29, title: "Maintaining Accuracy Over Time", content: "Accuracy matters. CHWs review organizational systems regularly to prevent errors and outdated information." },
    { num: 30, title: "Applied Case Example: Missed Follow-Up", content: "A CHW identifies a missed follow-up and adjusts their tracking system to prevent future gaps." },
    { num: 31, title: "Reflection: Workflow Challenges", content: "Reflect on challenges in your workflow. What applied organizational changes could improve consistency?" },
    { num: 32, title: "Activity: Task Prioritization Practice", content: "Participants practice prioritizing tasks based on urgency, impact, and available time." },
    { num: 33, title: "Applying Organization Across Settings", content: "CHWs apply organization in offices, homes, and community spaces. Systems must be portable and flexible." },
    { num: 34, title: "Organization and Ethical Awareness", content: "Applied organization supports ethical practice. CHWs manage information responsibly and follow agency policies." },
    { num: 35, title: "Organization and Boundary Management", content: "Organizational systems help maintain boundaries by clarifying work hours, responsibilities, and follow-up limits." },
    { num: 36, title: "Learning from Organizational Mistakes", content: "Mistakes are learning opportunities. CHWs reflect and adjust systems to improve reliability." },
    { num: 37, title: "Strengthening Organizational Confidence", content: "Applied practice builds confidence. CHWs trust their systems while staying open to improvement." },
    { num: 38, title: "Preparing for Advanced Organizational Skills", content: "Applied skills prepare learners for advanced coordination, reporting, and leadership tasks in Part 3." },
    { num: 39, title: "Part 2 Key Takeaways", content: "Applied organizational skills support follow-through, coordination, and ethical practice in real CHW work." },
    { num: 40, title: "Part 2 Summary", content: "Organizational Skills — Part 2 strengthened applied organization across workflows, documentation, and coordination." },
    { num: 41, title: "Applying Organization to Long-Term Follow-Up", content: "Long-term follow-up requires consistent tracking. CHWs apply organizational systems to remember check-ins, updates, and unresolved needs." },
    { num: 42, title: "Organizing Multiple Caseloads", content: "Managing multiple caseloads requires clarity and structure. CHWs separate tasks and timelines to avoid confusion and missed steps." },
    { num: 43, title: "Organization and Data Accuracy", content: "Accurate information depends on organization. CHWs regularly review records to ensure details are current and correct." },
    { num: 44, title: "Organizing for Accountability", content: "Accountability is supported by clear systems. CHWs track commitments and document actions to demonstrate responsible follow-through." },
    { num: 45, title: "Organizing for Team Reporting", content: "Reporting requires organized information. CHWs prepare summaries that are clear, timely, and appropriate for team use." },
    { num: 46, title: "Organization and Quality Improvement", content: "Organized records help identify patterns and improvement areas. CHWs use information to strengthen services." },
    { num: 47, title: "Adapting Organizational Systems Over Time", content: "Systems must evolve. CHWs adjust tools and processes as workloads, roles, and community needs change." },
    { num: 48, title: "Organization and Professional Confidence", content: "Strong organization builds confidence. CHWs trust their systems to support effective and ethical work." },
    { num: 49, title: "Organization and Stress Reduction", content: "Clear organization reduces stress. CHWs feel more in control when tasks and information are manageable." },
    { num: 50, title: "Organization and Boundary Protection", content: "Organizational systems help protect boundaries by defining work limits and responsibilities clearly." },
    { num: 51, title: "Reflection: Applied Organization Growth", content: "Reflect on how your organizational skills have improved. What systems support you most effectively?" },
    { num: 52, title: "Activity: Refining One Workflow", content: "Participants choose one workflow to refine, identifying steps to improve clarity and efficiency." },
    { num: 53, title: "Preparing for Advanced Organizational Skills", content: "Part 3 will focus on advanced coordination, reporting, and organizational leadership within CHW scope." },
    { num: 54, title: "Organizational Skills and Career Development", content: "Applied organizational skills support readiness for expanded responsibilities and leadership opportunities." },
    { num: 55, title: "Post-Test (Knowledge Check Placeholder)", content: "This post-test includes five questions assessing applied organizational skills. A QR code will be added later." },
    { num: 56, title: "Key Takeaways", content: "Applied organizational skills strengthen follow-through, accuracy, and sustainability in CHW practice." },
    { num: 57, title: "Closing Reflection", content: "Consider how applied organizational skills can support your effectiveness and well-being as a CHW." },
    { num: 58, title: "Part 2 Completion", content: "You have completed Organizational Skills — Part 2. These skills prepare you for advanced organizational practice." },
    { num: 59, title: "Looking Ahead to Part 3", content: "Part 3 will explore advanced organizational coordination, systems thinking, and leadership." },
    { num: 60, title: "Organizational Skills Application Summary", content: "Organizational Skills — Part 2 strengthened applied systems for managing workflows, documentation, and follow-up." },
    { num: 61, title: "Appendix and References", content: "References supporting this module include Texas DSHS CHW Core Competencies, CBPR and PAR literature, ethical evaluation frameworks, and professional standards published between 2020 and 2025. Full APA citations will be provided in the final appendix." },
  ],
  "part-3": [
    { num: 1, title: "Organizational Skills Part 3 Course Overview", content: "Part 3 focuses on advanced organizational practice for Community Health Workers. Learners strengthen systems thinking, coordination, reporting, and adaptive organization while maintaining ethical boundaries and community-centered practice." },
    { num: 2, title: "Pre-Test (Knowledge Check Placeholder)", content: "This pre-test includes five questions reviewing applied organizational skills from Part 2. The purpose is to assess readiness for advanced organizational practice. A QR code will be added later." },
    { num: 3, title: "Learning Objective 1", content: "Learners will be able to apply advanced organizational strategies to manage complex workflows and coordination across systems." },
    { num: 4, title: "Learning Objective 2", content: "Learners will be able to organize information for reporting, quality improvement, and team communication within CHW scope." },
    { num: 5, title: "Learning Objective 3", content: "Learners will be able to adapt organizational systems to support collaboration, accountability, and ethical practice." },
    { num: 6, title: "Learning Objective 4", content: "Learners will be able to demonstrate leadership-oriented organization while respecting CHW role boundaries." },
    { num: 7, title: "Purpose of Advanced Organizational Skills", content: "Advanced organizational skills help CHWs coordinate across teams, support system improvement, and manage complexity responsibly." },
    { num: 8, title: "Module List", content: "This course includes modules on systems organization, reporting, coordination, adaptive workflows, and organizational leadership." },
    { num: 9, title: "Systems Thinking for CHWs", content: "Systems thinking involves understanding how tasks, people, and processes connect. CHWs use this awareness to organize work more effectively." },
    { num: 10, title: "Managing Complex Workflows", content: "Complex workflows involve multiple steps and partners. Advanced organization helps CHWs track progress and dependencies clearly." },
    { num: 11, title: "Coordinating Across Teams and Programs", content: "Coordination requires clear communication and organization. CHWs track responsibilities and timelines across programs." },
    { num: 12, title: "Organizing for Reporting Purposes", content: "Reports require accurate and organized information. CHWs prepare summaries that reflect activities and outcomes without clinical interpretation." },
    { num: 13, title: "Organization and Quality Improvement", content: "Organized data helps identify patterns. CHWs support quality improvement by sharing organized observations and trends." },
    { num: 14, title: "Advanced Documentation Practices", content: "Advanced documentation focuses on clarity, consistency, and relevance. CHWs avoid unnecessary detail while capturing key actions." },
    { num: 15, title: "Organizing Work for Accountability", content: "Accountability is strengthened through transparent systems. CHWs track commitments and outcomes responsibly." },
    { num: 16, title: "Adaptive Organizational Systems", content: "Adaptive systems change as needs shift. CHWs adjust tools and processes while maintaining reliability." },
    { num: 17, title: "Advanced Case Example: Multi-Partner Coordination", content: "A CHW organizes communication and follow-up across multiple agencies to support coordinated service delivery." },
    { num: 18, title: "Reflection: Organizational Complexity", content: "Reflect on complex situations you manage. What organizational strategies help you stay effective?" },
    { num: 19, title: "Activity: Systems Mapping", content: "Participants map a complex workflow involving multiple partners and identify organizational supports." },
    { num: 20, title: "Part 3 Progress Check", content: "Learners have explored advanced organizational concepts preparing for deeper integration and leadership application." },
    { num: 21, title: "Advanced Prioritization Across Systems", content: "Advanced prioritization considers timelines, dependencies, and impact across systems. CHWs balance immediate needs with long-term coordination." },
    { num: 22, title: "Coordinating Across Agencies", content: "Multi-agency coordination requires clear tracking of roles, contacts, and follow-up responsibilities. Organization supports smooth collaboration." },
    { num: 23, title: "Organizing Information for Leadership Communication", content: "Leadership communication relies on clear summaries. CHWs organize information to report patterns, challenges, and progress responsibly." },
    { num: 24, title: "Managing Organizational Change", content: "Change is common. Advanced organization helps CHWs adjust workflows while maintaining continuity and reliability." },
    { num: 25, title: "Organizing for Equity and Access", content: "Organizational systems should support equitable access. CHWs organize outreach and follow-up to reduce gaps in service." },
    { num: 26, title: "Advanced Use of Digital Tools", content: "Advanced digital organization includes managing shared documents, calendars, and communication platforms responsibly." },
    { num: 27, title: "Data Organization for Program Improvement", content: "Organized data helps identify trends. CHWs share observations to support program improvement without clinical interpretation." },
    { num: 28, title: "Organizing for Accountability Reviews", content: "Accountability reviews rely on clear records. CHWs maintain organized documentation to demonstrate ethical practice." },
    { num: 29, title: "Advanced Case Example: System Bottlenecks", content: "A CHW identifies workflow bottlenecks and reorganizes steps to improve coordination and timeliness." },
    { num: 30, title: "Reflection: Systems Organization", content: "Reflect on how you organize work across systems. What strategies support clarity and collaboration?" },
    { num: 31, title: "Activity: Advanced Workflow Redesign", content: "Participants redesign a complex workflow to improve efficiency, clarity, and follow-through." },
    { num: 32, title: "Supporting Team Organization", content: "Advanced organization includes supporting team systems. CHWs share tools and practices that improve collective workflow." },
    { num: 33, title: "Organization and Ethical Leadership", content: "Ethical leadership includes organizing work transparently and responsibly. CHWs model accountability and integrity." },
    { num: 34, title: "Organization and Sustainability", content: "Sustainable organization balances efficiency with well-being. CHWs design systems that reduce overload and burnout." },
    { num: 35, title: "Learning from Organizational Failures", content: "Failures offer insight. CHWs reflect on breakdowns and adjust systems to prevent recurrence." },
    { num: 36, title: "Strengthening Organizational Confidence", content: "Advanced practice builds confidence. CHWs trust their systems while remaining flexible." },
    { num: 37, title: "Preparing for Integration and Mastery", content: "Advanced organizational practice prepares CHWs to integrate skills across roles and responsibilities in Part 4." },
    { num: 38, title: "Part 3 Key Takeaways", content: "Advanced organizational skills support coordination, accountability, and systems improvement." },
    { num: 39, title: "Part 3 Summary", content: "Organizational Skills — Part 3 strengthened systems thinking, coordination, and leadership-oriented organization." },
    { num: 40, title: "Preparing for Part 4", content: "Part 4 will focus on integrating organizational mastery into daily practice and leadership roles." },
    { num: 41, title: "Integrating Organization Across Roles", content: "Advanced organization means applying consistent systems across outreach, navigation, advocacy, and education roles." },
    { num: 42, title: "Organizational Mastery and Decision-Making", content: "Strong organizational systems support informed decision-making. CHWs use organized information to guide next steps responsibly." },
    { num: 43, title: "Organization and Strategic Planning", content: "Strategic planning includes organizing goals, timelines, and responsibilities. CHWs contribute insights without assuming administrative authority." },
    { num: 44, title: "Organizing for Program Sustainability", content: "Sustainability depends on organized systems. CHWs help maintain continuity through reliable documentation and follow-up." },
    { num: 45, title: "Organizational Leadership Within Scope", content: "Leadership within scope includes modeling organization, supporting peers, and improving systems without managing staff." },
    { num: 46, title: "Supporting Organizational Culture", content: "Organized practices contribute to a culture of clarity and accountability. CHWs influence culture through daily habits." },
    { num: 47, title: "Advanced Reflection on Organizational Impact", content: "Reflection helps CHWs understand how organization affects outcomes, relationships, and workload balance." },
    { num: 48, title: "Activity: Organizational Systems Review", content: "Participants review current systems and identify one advanced improvement to test in practice." },
    { num: 49, title: "Managing Organizational Transitions", content: "Transitions require careful organization. CHWs support continuity during staff changes or program shifts." },
    { num: 50, title: "Organization and Professional Growth", content: "Advanced organizational skills support readiness for expanded responsibilities and professional development." },
    { num: 51, title: "Reflection Prompt: Organizational Leadership", content: "Reflect on how your organizational skills influence others. Where do you model effective systems?" },
    { num: 52, title: "Preparing for Integration and Mastery", content: "These advanced practices prepare learners for full organizational integration and mastery in Part 4." },
    { num: 53, title: "Post-Test (Knowledge Check Placeholder)", content: "This post-test includes five questions assessing advanced organizational practice. A QR code will be added later." },
    { num: 54, title: "Key Takeaways", content: "Advanced organizational skills support coordination, leadership within scope, and system improvement." },
    { num: 55, title: "Closing Reflection", content: "Consider how advanced organizational skills strengthen your impact while protecting boundaries and well-being." },
    { num: 56, title: "Part 3 Completion", content: "You have completed Organizational Skills — Part 3. These skills prepare you for full integration and mastery." },
    { num: 57, title: "Looking Ahead to Part 4", content: "Part 4 will focus on integrating organizational mastery into daily practice and leadership pathways." },
    { num: 58, title: "Applying Advanced Organization Daily", content: "Advanced organizational skills become habits that support clarity, trust, and sustainability." },
    { num: 59, title: "Organizational Skills Growth Summary", content: "Organizational growth reflects continuous learning, adaptation, and ethical practice." },
    { num: 60, title: "Organizational Skills Advanced Practice Summary", content: "Organizational Skills — Part 3 strengthened systems thinking, coordination, and leadership-oriented organization." },
    { num: 61, title: "Appendix and References", content: "References supporting this module include Texas DSHS CHW Core Competencies, CBPR and PAR literature, ethical evaluation frameworks, and professional standards published between 2020 and 2025. Full APA citations will be provided in the final appendix." },
  ],
  "part-4": [
    { num: 1, title: "Organizational Skills Part 4 Course Overview", content: "Part 4 focuses on integrating organizational mastery into daily CHW practice. Learners apply advanced organization across roles while maintaining ethics, boundaries, and sustainability." },
    { num: 2, title: "Pre-Test (Knowledge Check Placeholder)", content: "This pre-test includes five questions reviewing advanced organizational concepts. The purpose is to assess readiness for integration and mastery. A QR code will be added later." },
    { num: 3, title: "Learning Objective 1", content: "Learners will be able to integrate organizational mastery across all CHW roles while maintaining ethical and professional boundaries." },
    { num: 4, title: "Learning Objective 2", content: "Learners will be able to demonstrate consistent organizational leadership within scope through daily practice and collaboration." },
    { num: 5, title: "Learning Objective 3", content: "Learners will be able to reflect on organizational systems to identify strengths, gaps, and improvement opportunities." },
    { num: 6, title: "Learning Objective 4", content: "Learners will be able to sustain organizational effectiveness while protecting well-being and preventing burnout." },
    { num: 7, title: "Purpose of Organizational Integration", content: "Integration means organization becomes a habit, not a task. CHWs apply systems naturally across all responsibilities." },
    { num: 8, title: "Module List", content: "This course includes modules on organizational mastery, integration across roles, leadership within scope, reflection, and sustainability." },
    { num: 9, title: "Organizational Mastery in Daily Work", content: "Mastery appears when CHWs manage tasks, information, and follow-up consistently without added stress." },
    { num: 10, title: "Integrating Organization Across CHW Roles", content: "Organization supports outreach, navigation, advocacy, education, and coordination. Systems remain consistent across roles." },
    { num: 11, title: "Organizational Habits and Routines", content: "Habits create reliability. Daily routines support follow-through and reduce cognitive load." },
    { num: 12, title: "Organization and Professional Identity", content: "Strong organizational skills reinforce professional identity. CHWs are seen as dependable and prepared." },
    { num: 13, title: "Organizational Leadership Without Authority", content: "Leadership within scope includes modeling organization and supporting peers without supervising or directing." },
    { num: 14, title: "Integrating Organization with Collaboration", content: "Organized CHWs strengthen collaboration by tracking shared goals, timelines, and responsibilities." },
    { num: 15, title: "Organizational Mastery and Trust", content: "Consistency builds trust. Communities and partners rely on organized CHWs for clear communication and follow-through." },
    { num: 16, title: "Organization and Ethical Sustainability", content: "Ethical sustainability includes managing workload responsibly. Organization supports boundaries and well-being." },
    { num: 17, title: "Integrated Case Example: Organizational Mastery", content: "A CHW uses consistent systems across outreach, referrals, and reporting to maintain clarity and balance." },
    { num: 18, title: "Reflection Prompt: Organizational Integration", content: "Reflect on how organization shows up in your daily work. Where do you feel most confident?" },
    { num: 19, title: "Activity: Organizational Mastery Mapping", content: "Participants map daily routines and identify where organizational mastery supports effectiveness and balance." },
    { num: 20, title: "Part 4 Progress Check", content: "Learners have explored integration and mastery concepts, preparing for final synthesis and completion." },
    { num: 21, title: "Organization as Second Nature", content: "At mastery level, organization feels natural. CHWs rely on established systems without constant effort or reminders." },
    { num: 22, title: "Integrating Organization with Communication", content: "Organized communication includes clear messages, timely responses, and accurate follow-up across all interactions." },
    { num: 23, title: "Integrating Organization with Service Navigation", content: "Organization supports navigation by tracking steps, deadlines, and outcomes without directing decisions." },
    { num: 24, title: "Integrating Organization with Advocacy", content: "Organized advocacy includes tracking issues, contacts, and follow-up while remaining neutral and ethical." },
    { num: 25, title: "Integrating Organization with Teaching Roles", content: "Teaching benefits from organization. CHWs prepare materials, track participation, and follow up appropriately." },
    { num: 26, title: "Organizational Mastery Across Settings", content: "CHWs apply organization consistently across offices, homes, and community spaces. Systems remain flexible and portable." },
    { num: 27, title: "Organization and Professional Confidence", content: "Mastery builds confidence. CHWs trust their systems to support effective and ethical work." },
    { num: 28, title: "Organization and Reduced Cognitive Load", content: "Strong systems reduce mental strain. CHWs free up attention for relationship-building and problem-solving." },
    { num: 29, title: "Organizational Mastery and Flexibility", content: "Mastery allows flexibility. CHWs adapt plans while maintaining clarity and priorities." },
    { num: 30, title: "Integrated Case Example: High-Complexity Day", content: "A CHW manages multiple priorities using established systems, adapting smoothly to unexpected needs." },
    { num: 31, title: "Reflection: Organizational Habits", content: "Reflect on which organizational habits feel automatic. Which still require effort?" },
    { num: 32, title: "Activity: Mastery Self-Assessment", content: "Participants assess their level of organizational mastery across roles and identify growth areas." },
    { num: 33, title: "Organizational Mastery and Peer Support", content: "Mastery includes supporting peers by sharing tools and modeling effective organization." },
    { num: 34, title: "Organizational Mastery and Mentorship", content: "Experienced CHWs mentor others by demonstrating sustainable and ethical organizational practices." },
    { num: 35, title: "Sustaining Organizational Mastery", content: "Sustaining mastery requires reflection and adjustment as roles and responsibilities evolve." },
    { num: 36, title: "Organization and Long-Term Effectiveness", content: "Long-term effectiveness depends on reliable systems that support consistency and balance." },
    { num: 37, title: "Preparing for Course Completion", content: "These integration skills prepare learners to complete the Organizational Skills competency." },
    { num: 38, title: "Part 4 Key Takeaways", content: "Organizational mastery means consistency, adaptability, and ethical integration across CHW practice." },
    { num: 39, title: "Part 4 Summary", content: "Organizational Skills — Part 4 emphasized integrating organizational mastery into daily practice." },
    { num: 40, title: "Preparing for Final Completion", content: "The final section will close the course and support reflection and transition beyond training." },
    { num: 41, title: "Organizational Mastery and Professional Judgment", content: "Organizational mastery supports strong professional judgment. CHWs use organized information to make thoughtful, ethical decisions." },
    { num: 42, title: "Organization and Accountability to Community", content: "Accountability includes honoring commitments. Organized systems help CHWs follow through consistently with individuals and communities." },
    { num: 43, title: "Organizational Mastery in Complex Systems", content: "Complex systems require clarity. CHWs rely on mastery-level organization to navigate overlapping processes responsibly." },
    { num: 44, title: "Organization and Transparency", content: "Transparency is supported by organization. CHWs can clearly explain actions, timelines, and next steps." },
    { num: 45, title: "Organizational Mastery and Ethical Confidence", content: "Ethical confidence grows with mastery. CHWs trust their systems to support accuracy and integrity." },
    { num: 46, title: "Organization and Sustainable Workload", content: "Sustainability requires balance. Organizational mastery helps CHWs manage workload without burnout." },
    { num: 47, title: "Organizational Mastery and Peer Leadership", content: "Peer leadership includes modeling organization and supporting others without formal authority." },
    { num: 48, title: "Organizational Mastery and Program Continuity", content: "Continuity depends on reliable systems. CHWs help maintain services during transitions or changes." },
    { num: 49, title: "Reflection: Mastery in Practice", content: "Reflect on moments when organization supported your effectiveness. How did mastery show up?" },
    { num: 50, title: "Activity: Organizational Mastery Reflection", content: "Participants reflect on growth across all parts and identify practices to sustain mastery." },
    { num: 51, title: "Organizational Skills and Career Sustainability", content: "Organizational mastery supports long-term career sustainability and effectiveness in CHW roles." },
    { num: 52, title: "Preparing for Post-Training Practice", content: "Learners prepare to apply organizational mastery beyond training and into daily CHW practice." },
    { num: 53, title: "Post-Test (Knowledge Check Placeholder)", content: "This post-test includes five questions assessing organizational integration and mastery. A QR code will be added later." },
    { num: 54, title: "Key Takeaways", content: "Organizational mastery reflects consistency, adaptability, and ethical practice across CHW roles." },
    { num: 55, title: "Closing Reflection", content: "Consider how organizational mastery supports your confidence, balance, and community impact." },
    { num: 56, title: "Organizational Skills Course Completion", content: "You have completed Organizational Skills Parts 1 through 4, building foundational to mastery-level organization." },
    { num: 57, title: "Applying Organizational Mastery Forward", content: "Organizational mastery continues to grow through reflection, adaptation, and practice." },
    { num: 58, title: "Final Course Reflection", content: "Reflect on how organizational skills strengthen your role as a reliable and ethical CHW." },
    { num: 59, title: "Organizational Skills Competency Summary", content: "Organizational skills support effective, ethical, and sustainable CHW practice across all settings." },
    { num: 60, title: "Organizational Skills Mastery Summary", content: "Organizational mastery means integrating reliable systems, ethical practice, and balance to support community well-being." },
    { num: 61, title: "Appendix and References", content: "References supporting this module include Texas DSHS CHW Core Competencies, CBPR and PAR literature, ethical evaluation frameworks, and professional standards published between 2020 and 2025. Full APA citations will be provided in the final appendix." },
  ],
};

// Module metadata
const modules = [
  {
    id: "part-1",
    title: "Organizational Skills — Part 1",
    subtitle: "Foundation",
    slideCount: 61,
    color: "#D4AF37",
    icon: Layers,
    description:
      "Foundational organizational practices that support reliable, ethical, and sustainable CHW work across Texas settings.",
    objectives: [
      "Explain why organizational skills are essential to effective CHW practice",
      "Identify core organizational tasks commonly performed by CHWs",
      "Recognize how organization supports accountability and trust",
      "Describe basic strategies for organizing time, information, and responsibilities",
    ],
  },
  {
    id: "part-2",
    title: "Organizational Skills — Part 2",
    subtitle: "Application",
    slideCount: 61,
    color: "#14919B",
    icon: Target,
    description:
      "Applying organizational skills in real CHW work settings through workflows, documentation, follow-up, and coordination.",
    objectives: [
      "Apply organizational skills to manage daily CHW workflows and tasks",
      "Demonstrate effective task prioritization and follow-up strategies",
      "Apply ethical documentation and information management practices",
      "Adapt organizational systems to changing priorities and needs",
    ],
  },
  {
    id: "part-3",
    title: "Organizational Skills — Part 3",
    subtitle: "Advanced Practice",
    slideCount: 61,
    color: "#E07A5F",
    icon: Lightbulb,
    description:
      "Advanced organizational practice focusing on systems thinking, coordination, reporting, and adaptive organization.",
    objectives: [
      "Apply advanced organizational strategies to manage complex workflows",
      "Organize information for reporting and quality improvement",
      "Adapt organizational systems for collaboration and accountability",
      "Demonstrate leadership-oriented organization within CHW boundaries",
    ],
  },
  {
    id: "part-4",
    title: "Organizational Skills — Part 4",
    subtitle: "Integration & Mastery",
    slideCount: 61,
    color: "#9B5DE5",
    icon: CheckCircle,
    description:
      "Integrating organizational mastery into daily CHW practice while maintaining ethics, boundaries, and sustainability.",
    objectives: [
      "Integrate organizational mastery across all CHW roles",
      "Demonstrate consistent organizational leadership within scope",
      "Reflect on organizational systems to identify improvements",
      "Sustain organizational effectiveness while protecting well-being",
    ],
  },
];

function getSlideIcon(type: string) {
  switch (type) {
    case "overview":
      return <Book className="h-4 w-4" />;
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

function getSlideTypeColor(type: string) {
  switch (type) {
    case "overview":
      return "bg-blue-900/30 text-blue-400 border-blue-800";
    case "objective":
      return "bg-purple-900/30 text-purple-400 border-purple-800";
    case "test":
      return "bg-green-900/30 text-green-400 border-green-800";
    case "case":
      return "bg-orange-900/30 text-orange-400 border-orange-800";
    case "reflection":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
    case "activity":
      return "bg-pink-900/30 text-pink-400 border-pink-800";
    case "summary":
      return "bg-teal-900/30 text-teal-400 border-teal-800";
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-800";
  }
}

// Full Document Modal
function DocumentModal({
  isOpen,
  onClose,
  module,
}: {
  isOpen: boolean;
  onClose: () => void;
  module: (typeof modules)[0];
}) {
  if (!isOpen) return null;

  const slides = fullContent[module.id] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 p-6"
          style={{ backgroundColor: "rgba(3, 7, 18, 0.95)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${module.color}20` }}
            >
              <module.icon className="h-6 w-6" style={{ color: module.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{module.title}</h2>
              <p className="text-sm text-gray-500">
                {module.slideCount} slides · {module.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {slides.map((slide) => {
              const type = getSlideType(slide.title);
              return (
                <div
                  key={slide.num}
                  className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-gray-700"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                      style={{
                        backgroundColor: `${module.color}20`,
                        color: module.color,
                      }}
                    >
                      {slide.num}
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${getSlideTypeColor(type)}`}
                    >
                      {getSlideIcon(type)}
                      {type}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {slide.title}
                  </h3>
                  <p className="leading-relaxed text-gray-400">{slide.content}</p>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/30 p-4 text-center">
            <p className="text-sm text-gray-500">
              © CHW360 | Educational Use Only | Not Medical Advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  module,
  isExpanded,
  onToggle,
  onViewFull,
}: {
  module: (typeof modules)[0];
  isExpanded: boolean;
  onToggle: () => void;
  onViewFull: () => void;
}) {
  const Icon = module.icon;
  const previewSlides = (fullContent[module.id] ?? []).slice(0, 6);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 transition-all"
      style={{
        borderColor: isExpanded ? `${module.color}40` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6">
        <button
          onClick={onToggle}
          className="flex flex-1 gap-4 text-left transition-colors hover:bg-white/5"
        >
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${module.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: module.color }} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{module.title}</h2>
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${module.color}20`,
                  color: module.color,
                }}
              >
                {module.subtitle}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              {module.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {module.slideCount} slides
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {module.objectives.length} objectives
              </span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewFull}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            style={{ color: module.color }}
          >
            <Eye className="h-4 w-4" />
            View Full
          </button>
          <button
            onClick={onToggle}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-800 bg-black/30">
          {/* Learning Objectives */}
          <div className="border-b border-gray-800 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              <Target className="h-4 w-4" />
              Learning Objectives
            </h3>
            <ul className="space-y-3">
              {module.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-black"
                    style={{ backgroundColor: module.color }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slide Preview */}
          <div className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              <FileText className="h-4 w-4" />
              Slide Preview
            </h3>
            <div className="space-y-3">
              {previewSlides.map((slide) => {
                const type = getSlideType(slide.title);
                return (
                  <div
                    key={slide.num}
                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors hover:border-gray-700"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${getSlideTypeColor(type)}`}
                      >
                        {getSlideIcon(type)}
                        {type}
                      </span>
                      <span className="text-xs text-gray-600">
                        Slide {slide.num}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white">{slide.title}</h4>
                    <p className="mt-1 text-sm text-gray-400">{slide.content}</p>
                  </div>
                );
              })}
              <button
                onClick={onViewFull}
                className="w-full rounded-lg border border-dashed border-gray-700 bg-gray-900/30 p-4 text-center transition-colors hover:border-gray-600 hover:bg-gray-900/50"
              >
                <p className="text-sm text-gray-400">
                  + {module.slideCount - previewSlides.length} more slides —{" "}
                  <span style={{ color: module.color }}>View Full Document</span>
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InputsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [viewingModule, setViewingModule] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalSlides = modules.reduce((sum, m) => sum + m.slideCount, 0);
  const totalObjectives = modules.reduce((sum, m) => sum + m.objectives.length, 0);

  const activeModule = modules.find((m) => m.id === viewingModule);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
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
              <FileText className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold">Input Documents</h1>
              <p className="text-xs text-gray-500">Training Source Materials</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="mb-4 text-4xl font-bold">
            <span style={{ color: "#D4AF37" }}>Organizational Skills</span>
            <br />
            Training Modules
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            Complete 4-part training curriculum for Community Health Workers
            covering foundational concepts through integration and mastery.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-10 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-4">
            <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
              {modules.length}
            </p>
            <p className="text-sm text-gray-500">Modules</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-4">
            <p className="text-2xl font-bold text-teal-400">{totalSlides}</p>
            <p className="text-sm text-gray-500">Total Slides</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-4">
            <p className="text-2xl font-bold text-purple-400">{totalObjectives}</p>
            <p className="text-sm text-gray-500">Learning Objectives</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-4">
            <p className="text-2xl font-bold text-green-400">Ready</p>
            <p className="text-sm text-gray-500">Status</p>
          </div>
        </div>

        {/* Module Cards */}
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isExpanded={expandedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
              onViewFull={() => setViewingModule(module.id)}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900/30 p-6 text-center">
          <p className="text-sm text-gray-500">
            © CHW360 | Educational Use Only | Not Medical Advice
          </p>
          <p className="mt-2 text-xs text-gray-600">
            References include Texas DSHS CHW Core Competencies, CBPR and PAR
            literature, ethical evaluation frameworks, and professional standards
            (2020-2025)
          </p>
        </div>
      </main>

      {/* Full Document Modal */}
      {activeModule && (
        <DocumentModal
          isOpen={!!viewingModule}
          onClose={() => setViewingModule(null)}
          module={activeModule}
        />
      )}
    </div>
  );
}
