import alexDashboardCover from '../assets/portfolio/alex-dashboard.png'
import helioCover from '../assets/portfolio/helio-monitor.png'
import jokuCover from '../assets/portfolio/joku-review.png'
import revlyCover from '../assets/portfolio/revly-demo.jpg'
import dreamopiaCover from '../assets/milestones/carexr-1.jpg'
import remiCover from '../assets/projects/remi.png'
import rabizaiCover from '../assets/projects/rabizai.png'
import aiDarlingsCover from '../assets/projects/ai-darlings.jpg'
import miloCover from '../assets/projects/milo-ai.jpg'
import punchCover from '../assets/projects/punch-my-professor.png'
import truckingCover from '../assets/projects/trucking-ai.png'
import colorDormCover from '../assets/projects/colordorm.png'
import menuLensCover from '../assets/projects/menulens.jpg'
import cybersightCover from '../assets/projects/cybersight-ai.png'
import firefighterCover from '../assets/projects/fire-fighter-robot.jpg'
import paintAiCover from '../assets/projects/paintai.png'
import assetPlusCover from '../assets/projects/assetplus.png'
import citySweeperCover from '../assets/projects/citysweeper.jpg'
import cpuCover from '../assets/projects/16-bit-cpu.png'
import cubeRobotCover from '../assets/projects/cube-loading-robot.png'
import agentCostRouterCover from '../assets/portfolio/agent-cost-router.png'
import aiSkillsCover from '../assets/portfolio/ai-skills.png'
import tradingBotCover from '../assets/portfolio/trading-bot.png'

export type PortfolioVideo =
  | { provider: 'youtube'; id: string }
  | { provider: 'vimeo'; id: string }
  | { provider: 'file'; src: string; poster?: string }

export type CaseStudy = {
  slug: string
  number: string
  title: string
  label: string
  oneLiner: string
  problem: string
  approach: string[]
  result: string
  metrics: { value: string; label: string }[]
  stack: string[]
  visual: 'helio' | 'codezero' | 'joku'
  coverImage: string
  video?: PortfolioVideo
  repoUrl?: string
}

export type VideoProject = {
  title: string
  year: string
  label: string
  description: string
  coverImage: string
  video?: PortfolioVideo
  projectUrl?: string
  repoUrl?: string
  result?: string
  metrics?: { value: string; label: string }[]
  stack?: string[]
}

// Add a `video` field to any case study when the next demo is ready.
// YouTube/Vimeo only need the video ID; self-hosted demos use provider: 'file'.
export const caseStudies: CaseStudy[] = [
  {
    slug: 'helio',
    number: '01',
    title: 'Helio AI Glasses',
    label: 'EDGE AI · ANDROID · PRODUCT',
    oneLiner: 'Turning constrained smart-glasses hardware into practical, hands-free product interactions.',
    problem: 'The glasses depended on a separate trackpad, while an early hand-tracking prototype took roughly three seconds per detection—too slow for a real interaction.',
    approach: [
      'Built the Android and on-device AI feature layer on top of the INMO SDK using Kotlin APIs and WebSocket data paths.',
      'Quantized the MediaPipe/TFLite model to INT8, enabled the GPU delegate, and reworked the camera-frame processing pipeline.',
      'Created on-device timing benchmarks and iterated against customer demo feedback instead of optimizing in isolation.',
    ],
    result: 'Delivered responsive gesture control for customer demos and trained a compact seven-segment recognition model that outperformed deployable baselines on the target device.',
    metrics: [
      { value: '90 ms', label: 'average detection latency' },
      { value: '90.4%', label: 'exact-match accuracy' },
      { value: '1.67 MB', label: 'TFLite model size' },
    ],
    stack: ['Kotlin', 'Android', 'TFLite', 'MediaPipe', 'OpenCV'],
    visual: 'helio',
    coverImage: helioCover,
  },
  {
    slug: 'alex',
    number: '02',
    title: 'Alex',
    label: 'CODING AGENT · ORCHESTRATION',
    oneLiner: 'A coding agent built around the way I actually plan, parallelize, review, and recover development work.',
    problem: 'Long coding tasks were difficult to parallelize safely, and interruptions often meant losing task context or reviewing a large undifferentiated change at the end.',
    approach: [
      'Built on OpenCode model execution and added task orchestration, Linear and GitHub integration, and isolated workspaces.',
      'Designed a plan → implement → verify → review/CI-repair workflow with persisted state for interruption recovery.',
      'Kept human control at review, CI failure, and merge-conflict boundaries through a React/SSE control surface.',
    ],
    result: 'Used the system as part of my own development workflow for more than 40 tasks, with up to five isolated workspaces running in parallel.',
    metrics: [
      { value: '40+', label: 'development tasks run' },
      { value: '5', label: 'parallel workspaces' },
      { value: '4', label: 'workflow control stages' },
    ],
    stack: ['TypeScript', 'Bun', 'OpenCode', 'Linear', 'GitHub'],
    visual: 'codezero',
    coverImage: alexDashboardCover,
  },
  {
    slug: 'joku',
    number: '03',
    title: 'Joku',
    label: 'AGENTIC AUTOMATION · BROWSER',
    oneLiner: 'A daily job-search agent that turns a personal profile into a human-reviewed application queue.',
    problem: 'Finding relevant roles and repeatedly entering the same verified information across incompatible ATS forms consumed time without improving application quality.',
    approach: [
      'Combined ATS APIs, public web sources, and custom job-source adapters to discover and rank matching roles every day.',
      'Grounded Qwen responses in a personal fact database, then used Playwright/Chromium for repetitive form entry.',
      'Designed browser handoff points for CAPTCHA, login verification, and bot detection, with human approval before submission.',
    ],
    result: 'Converted manual job-board browsing into a repeatable daily workflow while keeping sensitive answers grounded and final submission under human control.',
    metrics: [
      { value: '10–20', label: 'roles ranked per run' },
      { value: '4–5', label: 'applications per trial day' },
      { value: '100%', label: 'human-approved submission' },
    ],
    stack: ['Node.js', 'Qwen', 'Playwright', 'Chromium'],
    visual: 'joku',
    coverImage: jokuCover,
  },
]

export const videoProjects: VideoProject[] = [
  {
    title: 'Revly',
    year: '2026',
    label: 'COMPUTER VISION · CREATOR TOOLS',
    description: 'A creator-first monetization system that turns a live stream into a native ad experience inside OBS.',
    coverImage: revlyCover,
    video: { provider: 'youtube', id: 'iFMStLxqJQI' },
    projectUrl: 'https://devpost.com/software/revly',
    repoUrl: 'https://github.com/wbohanw/bagelhacks2',
  },
  {
    title: 'Dreamopia',
    year: '2026',
    label: 'AR · GENERATIVE STORYTELLING',
    description: 'A voice-driven storytelling experience that generates narration and animated 3D scenes around children.',
    coverImage: dreamopiaCover,
    video: { provider: 'vimeo', id: '1175962854' },
    projectUrl: 'https://devpost.com/software/dreamopia',
  },
  {
    title: 'Remi',
    year: '2025',
    label: 'AI · HEALTHCARE',
    description: 'A patient–doctor portal that turns daily activity data into useful AI-generated context for Alzheimer care.',
    coverImage: remiCover,
    video: { provider: 'youtube', id: 'd7SWmeHx35I' },
    repoUrl: 'https://github.com/0vp/HackRx-2025',
  },
  {
    title: 'Agent Cost Router',
    year: '2026',
    label: 'AGENT INFRASTRUCTURE · COST CONTROL',
    description: 'An OpenAI-compatible proxy that lets an existing agent route each step to the lowest-cost suitable model without changing its client interface.',
    coverImage: agentCostRouterCover,
    repoUrl: 'https://github.com/wbohanw/agent-cost-router',
    result: 'Rebuilt an earlier browser experiment as a legitimate provider API with deterministic model tiers, request budgets, exact caching, fallback, and token/cost accounting.',
    metrics: [
      { value: '3', label: 'configurable model tiers' },
      { value: '8', label: 'routing and cache tests' },
      { value: '0', label: 'extra LLM calls for routing' },
    ],
    stack: ['TypeScript', 'Express', 'OpenAI-compatible API', 'Zod'],
  },
  {
    title: 'AI Skills Library',
    year: '2026',
    label: 'AGENT TOOLING · EVALUATION',
    description: 'Reusable skills that turn repeated AI-assisted engineering work into documented workflows, tool guidance, and testable routing behavior.',
    coverImage: aiSkillsCover,
    repoUrl: 'https://github.com/wbohanw/lens-studio-skills',
    result: 'The Lens Studio skill packages lessons from a real Spectacles application into deep technical references, correctness evaluations, and positive/negative trigger tests.',
    metrics: [
      { value: '16', label: 'technical reference guides' },
      { value: '11', label: 'correctness evaluations' },
      { value: '40', label: 'routing test queries' },
    ],
    stack: ['Agent Skills', 'MCP', 'Evals', 'Lens Studio'],
  },
  {
    title: 'RabizAI',
    year: '2025',
    label: 'AI AUTOMATION · E-COMMERCE',
    description: 'An AI-assisted commerce prototype for turning product research and store operations into a guided workflow.',
    coverImage: rabizaiCover,
    video: { provider: 'youtube', id: 'ZWRtv431OuM' },
    repoUrl: 'https://github.com/wbohanw/CodeJam2025',
    result: 'Built and demonstrated as a complete hackathon product spanning the customer interface and automation workflow.',
    stack: ['JavaScript', 'React', 'Node.js', 'Stripe'],
  },
  {
    title: 'AI Darlings',
    year: '2024',
    label: 'AI COMPANION · WELL-BEING',
    description: 'A daily AI companion designed to support older adults through conversation, reminders, and lightweight well-being interactions.',
    coverImage: aiDarlingsCover,
    video: { provider: 'youtube', id: 'q_z4xOVVx70' },
    repoUrl: 'https://github.com/wbohanw/AIDerly',
    result: 'Presented as a working team prototype connecting an AI companion experience with a usable web interface.',
    stack: ['JavaScript', 'AI/ML', 'React'],
  },
  {
    title: 'Milo AI',
    year: '2024—25',
    label: 'CONVERSATIONAL AI · MENTAL HEALTH',
    description: 'A staged CBT-inspired conversational product for helping teenagers reflect on well-being and reach appropriate support.',
    coverImage: miloCover,
    repoUrl: 'https://github.com/Michaelyya/Teenager-wellbeing',
    result: 'Combined a React product experience with a Python backend, routing logic, CBT conversations, and alert-oriented flows.',
    stack: ['Python', 'React', 'CBT Logic', 'Conversational AI'],
  },
  {
    title: 'Market Signal Lab',
    year: '2025—26',
    label: 'MARKET DATA · PAPER TRADING',
    description: 'A personal market-monitoring and paper-trading workspace for collecting TradingView signals and testing rules across BTC, ETH, and SOL.',
    coverImage: tradingBotCover,
    result: 'Combined browser-based data collection, concurrent signal monitoring, persistent logs, and a stateful simulated portfolio; the gallery demo uses a fixed snapshot and never executes real trades.',
    metrics: [
      { value: '3', label: 'markets monitored' },
      { value: '2', label: 'monitoring loops' },
      { value: '0', label: 'real trades in demo mode' },
    ],
    stack: ['Python', 'Playwright', 'OpenCV', 'Tkinter'],
  },
  {
    title: 'Punch My Professor',
    year: '2024',
    label: 'COMPUTER VISION · UNITY',
    description: 'A playful prototype that turns a professor photo into a 3D character and uses hand tracking for physical interaction.',
    coverImage: punchCover,
    video: { provider: 'youtube', id: 'pnxXGGBSUc0' },
    repoUrl: 'https://github.com/wbohanw/PunchMyProf',
    result: 'Built as a working McHacks prototype joining a computer-vision input pipeline with an interactive Unity scene.',
    stack: ['C#', 'Unity', 'Python', 'OpenCV'],
  },
  {
    title: 'Trucking AI',
    year: '2024',
    label: 'COMPUTER VISION · ROUTE INTELLIGENCE',
    description: 'A team prototype exploring how visual and operational signals can support more efficient trucking routes.',
    coverImage: truckingCover,
    video: { provider: 'youtube', id: 'EVDzemLPOzw' },
    repoUrl: 'https://github.com/NameErrorException/trucking',
    result: 'Delivered a demonstrable end-to-end concept with model logic and a product-facing interface.',
    stack: ['Python', 'OpenCV', 'React', 'TypeScript'],
  },
  {
    title: 'ColorDorm',
    year: '2024—25',
    label: 'DESIGN TOOLS · FULL STACK',
    description: 'A room-like color inspiration tool that lets interface designers browse and organize palettes as spatial collections.',
    coverImage: colorDormCover,
    repoUrl: 'https://github.com/wbohanw/color_dormitory',
    projectUrl: 'https://colordormitory.vercel.app',
    result: 'Shipped as a deployed web experience and iterated across separate frontend, backend, and concept repositories.',
    stack: ['TypeScript', 'React', 'Python'],
  },
  {
    title: 'MenuLens',
    year: '2024—25',
    label: 'VISION · TRANSLATION · MOBILE',
    description: 'A menu camera that turns unfamiliar restaurant menus into translated, categorized, and filterable digital experiences.',
    coverImage: menuLensCover,
    video: { provider: 'youtube', id: 'nstu9m7HFnQ' },
    repoUrl: 'https://github.com/wbohanw/Mchacks12',
    projectUrl: 'https://menulens.vercel.app',
    result: 'Built a working flow from menu capture to translation, item context, allergy filtering, and an interactive ordering view.',
    stack: ['JavaScript', 'React', 'OpenAI API', 'Vision'],
  },
  {
    title: 'Cybersight AI',
    year: '2024',
    label: 'ACCESSIBILITY · COMPUTER VISION',
    description: 'An assistive-vision prototype for helping blind and visually impaired users interpret their surroundings.',
    coverImage: cybersightCover,
    result: 'Explored a mobile-first accessibility experience combining visual perception with concise, actionable guidance.',
    stack: ['TypeScript', 'Python', 'OpenCV', 'React Native'],
  },
  {
    title: 'Fire Fighter Robot',
    year: '2024',
    label: 'ROBOTICS · EMBEDDED SYSTEMS',
    description: 'A physical robotics prototype designed to detect and respond to a simulated fire scenario.',
    coverImage: firefighterCover,
    result: 'Integrated sensing, motion, and control logic into a working competition robot.',
    stack: ['Raspberry Pi', 'BrickPi', 'C++'],
  },
  {
    title: 'PaintAI',
    year: '2024',
    label: 'GENERATIVE AI · CREATIVE TOOLS',
    description: 'An interactive playground where uploaded drawings become animated characters with personalities and AI conversations.',
    coverImage: paintAiCover,
    video: { provider: 'youtube', id: 'dVhpT-ZqagE' },
    repoUrl: 'https://github.com/wbohanw/Painty-dance-ai',
    result: 'Created a working creative-AI experience combining drawing upload, character animation, themed scenes, and group conversation.',
    stack: ['TypeScript', 'React', 'Node.js', 'LLM'],
  },
  {
    title: 'AssetPlus',
    year: '2023',
    label: 'FULL STACK · ASSET MANAGEMENT',
    description: 'A team-built hotel asset-management platform for organizing inventory and operational records.',
    coverImage: assetPlusCover,
    result: 'Delivered as a university software-engineering project with a complete product interface and persistent data model.',
    stack: ['Java', 'Full Stack', 'Data Modeling'],
  },
  {
    title: 'CitySweeper',
    year: '2023',
    label: 'SIMULATION · PRODUCT PROTOTYPE',
    description: 'A city-cleaning simulation exploring task planning, operational coverage, and a visual management interface.',
    coverImage: citySweeperCover,
    result: 'Built as an early end-to-end product prototype combining simulation logic and an operator-facing experience.',
    stack: ['JavaScript', 'Simulation', 'UI Design'],
  },
  {
    title: '16-bit CPU',
    year: '2023',
    label: 'VHDL · COMPUTER ARCHITECTURE',
    description: 'A complete 16-bit processor designed in hardware description language from datapath components to instruction execution.',
    coverImage: cpuCover,
    result: 'Implemented and tested the processor as a computer-architecture project.',
    stack: ['VHDL', 'Digital Logic', 'Computer Architecture'],
  },
  {
    title: 'Cube Loading Robot',
    year: '2023',
    label: 'ROBOTICS · CONTROL',
    description: 'A BrickPi and Raspberry Pi robot built to locate, collect, and load cubes through coordinated sensing and actuation.',
    coverImage: cubeRobotCover,
    result: 'Produced a working physical prototype that connected perception, motor control, and task sequencing.',
    stack: ['Python', 'Raspberry Pi', 'BrickPi'],
  },
]
