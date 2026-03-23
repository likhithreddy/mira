# Product Requirements Document
## MIRA — Mock Interview and Response Analyzer

| Field | Detail |
|---|---|
| **Project Name** | MIRA — Mock Interview and Response Analyzer |
| **Team Members** | Likhith Reddy Rechintala · Jaya Sriharshita Koneti |
| **Status** | Draft v2.0 |
| **Submission Deadline** | April 19, 2026 |
| **Final Milestone Target** | April 17, 2026 |
| **Last Updated** | March 2026 |

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [User Stories](#4-user-stories)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Middleware & Route Protection](#8-middleware--route-protection)
9. [Project Structure](#9-project-structure)
10. [Database Architecture](#10-database-architecture)
11. [UX & Design Considerations](#11-ux--design-considerations)
12. [Testing Strategy](#12-testing-strategy)
13. [CI/CD Pipeline & Deployment](#13-cicd-pipeline--deployment)
14. [Production Monitoring](#14-production-monitoring)
15. [Scope](#15-scope)
16. [Assumptions & Constraints](#16-assumptions--constraints)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Timeline](#18-timeline)

---

## 1. Problem Statement

### Background

Job interviews are high-stakes events where preparation quality directly determines outcomes. Despite this, most candidates have no access to realistic, personalized, and adaptive practice environments. Existing solutions fall into two categories:

- **Human-dependent practice** — peers, mentors, or career coaches. These are unavailable, costly, or unscalable for most candidates, particularly graduate students and career switchers without established professional networks.
- **Static question banks** — flashcard-style tools that present generic questions with no awareness of the candidate's actual background, specific role, or how the candidate answered a prior question. They provide no feedback on verbal delivery, structure, or role alignment.

Neither approach simulates the adaptive, conversational nature of a real interview. Neither provides structured, role-specific feedback after the session. Neither allows the candidate to practice the actual act of speaking answers aloud under realistic conditions.

### Problem Statement

Candidates preparing for job interviews lack access to a realistic, personalized, and always-available practice environment that generates contextually relevant questions from their own resume and target job description, captures and evaluates their spoken responses in real time, and delivers structured performance feedback tied to the expectations of the role.

### Who Is Affected

This problem disproportionately affects three candidate profiles:

- **Graduate students** who lack professional networks for peer mock interviews and cannot afford coaching
- **Career switchers** who need to practice framing transferable skills for roles outside their prior domain
- **Technically strong but interview-anxious candidates** who underperform in live interviews not due to lack of knowledge but due to pressure and unfamiliarity with the format

### Why This Product, Why Now

With the availability of capable large language models via API, browser-native speech recognition (Web Speech API) and speech synthesis (SpeechSynthesis API), and full-stack frameworks like Next.js enabling rapid development with integrated backend capabilities, it is now feasible to build a production-quality, authenticated, database-backed interview simulation platform within the scope of a course project. MIRA takes full advantage of all three.

---

## 2. Goals & Success Metrics

### Primary Goals

| # | Goal | Metric |
|---|---|---|
| G1 | Deliver contextual, role-specific questions | 100% of generated questions reference content from the provided resume or job description |
| G2 | Simulate a real spoken interview experience | Users can complete a full session using voice input with live word-by-word transcription displayed on screen |
| G3 | Provide actionable post-session feedback | Performance report evaluates answers across all 6 defined dimensions with both a numeric score and qualitative label per answer |
| G4 | Minimize time-to-first-question | User reaches their first interview question within 2 minutes of completing setup |
| G5 | Persist user progress across sessions | All session transcripts, reports, and ratings are saved to the user's account and accessible from the dashboard |
| G6 | Capture feedback for future improvement | Every completed session prompts a 1–5 star rating with optional written feedback, stored in the database |

### Non-Goals (out of scope for v1 success measurement)

- Prompt refinement using collected feedback (future scope)
- Benchmarking users against each other
- Integration with external ATS or job portals
- Mobile (< 768px) support

---

## 3. User Personas

### Persona 1 — The Job-Seeking Graduate

**Name:** Aditya, 24
**Background:** Master's student in Computer Science at a US university, applying to software engineering roles at mid-size tech companies. Has strong academic projects and internship experience but limited structured interview practice.
**Goals:** Practice articulating his experience clearly and concisely. Reduce anxiety before real recruiter screens. Understand how well his background maps to target job descriptions.
**Pain Points:**
- No mock interview partners available in his immediate network
- Generic prep sites present the same questions regardless of his resume
- Cannot afford private career coaching ($200–400/session)
- Gets flustered when he cannot recall a structured answer format under pressure
**Key Behaviors:** Wants to run a full simulated session after uploading his resume and a target JD, complete the session by speaking answers aloud, and then review the transcript to identify where his phrasing or structure broke down. Likely to use MIRA multiple times before each application cycle.
**Technical Comfort:** High — comfortable with browser-based tools, will use Chrome.

---

### Persona 2 — The Career Switcher

**Name:** Priya, 31
**Background:** Six years in marketing operations, pivoting into product management. Has completed a PM certification course but has not yet interviewed for PM roles. Her resume does not look like a traditional PM resume.
**Goals:** Practice framing transferable skills in PM language. Handle gap and transition questions confidently. Understand how her experience is perceived against a PM job description.
**Pain Points:**
- Traditional prep tools do not account for non-linear career paths
- Static question banks do not adapt when she gives an unusual or experience-heavy answer
- She needs questions that probe the connection between her marketing background and PM expectations — not generic PM questions
**Key Behaviors:** Needs the session to feel like a real conversation that follows her answers with intelligent follow-ups. Will review the role-alignment section of the report closely to understand how her narrative lands. Will re-run sessions with different JDs to test different positioning angles.
**Technical Comfort:** Medium — comfortable with web apps, prefers a clean and guided interface.

---

### Persona 3 — The Anxious Interviewer

**Name:** Rohan, 27
**Background:** Experienced backend engineer at a mid-size company, preparing for senior engineering roles at larger companies. Consistently underperforms in live interviews despite strong technical skills. Knows the content but freezes under the feeling of being observed.
**Goals:** Build confidence through repeated low-pressure practice. Learn to verbalize his thinking clearly. Break the habit of long silences before answering.
**Pain Points:**
- Practice with real people recreates the very anxiety he is trying to overcome
- He needs the repetition of speaking answers aloud, not just thinking through them silently
- No record of his past sessions to track whether he is improving
**Key Behaviors:** Will use MIRA repeatedly across multiple sessions, tracking his progress from the dashboard. Values the word-by-word TTS delivery because it creates an authentic interviewer presence without the social pressure of a real person watching. Reviews transcripts after each session to catch verbal habits and filler words.
**Technical Comfort:** High — developer, will use Chrome, comfortable with auth flows and dashboard interfaces.

---

## 4. User Stories

User stories capture what users provided during requirements gathering. They are intentionally high-level and role-focused. Each story maps to one or more functional requirements in Section 5. Acceptance criteria for each story are expressed as failing tests in the codebase following the AI-TDD workflow — the test is written first as the executable specification, and passing it is the definition of done.

### Epic 1 — Authentication & Account Management

| ID | User Story |
|---|---|
| US-01 | As a new user, I want to sign up with my email and password so that I can create an account and access MIRA. |
| US-02 | As a new user, I want to sign up using my Google account so that I can get started without creating a new password. |
| US-03 | As a returning user, I want to log in so that I can access my account and past sessions. |
| US-04 | As a logged-in user, I want to log out so that my session is ended securely. |

### Epic 2 — Session Setup

| ID | User Story |
|---|---|
| US-05 | As a job-seeking graduate, I want to provide my resume and a job description so that questions are generated tailored to my background and target role. |
| US-06 | As a career switcher, I want to select the type of interview I want to practice so that the session focuses on the questions most relevant to my situation. |

### Epic 3 — Interview Session

| ID | User Story |
|---|---|
| US-07 | As a career switcher, I want the questions to adapt based on my previous answers so that the session feels like a real conversation rather than a static list of prompts. |
| US-08 | As an anxious interviewer, I want to speak my answers aloud and see them transcribed on screen so that I can simulate the real experience of verbalizing responses under interview pressure. |
| US-09 | As a job-seeking graduate, I want to review the full session transcript so that I can identify where my phrasing or structure needs improvement. |

### Epic 4 — Post-Session Flow

| ID | User Story |
|---|---|
| US-10 | As a candidate, I want a detailed performance report at the end of each session highlighting strengths, weaknesses, and suggested improvements. |
| US-11 | As a career switcher, I want the report to evaluate my answers against the expectations of the target role so that I know how well I am positioning my experience. |

### Epic 5 — User Dashboard

| ID | User Story |
|---|---|
| US-12 | As a returning user, I want to see my past sessions and progress over time so that I can track whether I am improving across practice sessions. |

### Epic 6 — Profile & Resume Management

| ID | User Story |
|---|---|
| US-13 | As any user, I want to save my resume to my profile so that I do not have to re-upload it every time I start a new session. |

### Epic 7 — Admin

| ID | User Story |
|---|---|
| US-14 | As an admin, I want to view all registered users so that I can monitor who is using the platform. |
| US-15 | As an admin, I want to suspend or delete a user account so that I can manage access and enforce policies. |
| US-16 | As an admin, I want to configure AI providers and their API keys so that the platform can route AI calls through the appropriate service. |
| US-17 | As an admin, I want to view AI gateway call logs so that I can monitor provider usage, latency, and error rates. |
| US-18 | As an admin, I want to view the LLM-as-judge evaluation results and historical metrics so that I can assess the quality of MIRA's AI outputs over time. |

---

### AI-TDD Workflow

MIRA follows the AI-TDD workflow as defined in the project specification:

1. The developer writes the failing test first — the test is the acceptance criterion made executable
2. The failing test is committed to the branch
3. Claude Code implements the code to make the test pass
4. Tests pass → commit
5. Refactor → tests still pass → commit

Tests are never changed to match the implementation. What a test expects to pass is the acceptance criterion, and the acceptance criterion does not change because what we expect from the system does not change. If a test is failing, the implementation is wrong — not the test.

**Property-based testing** is used alongside example-based tests for logic modules with large or unbounded input spaces. Rather than hand-picking specific inputs, property-based tests (using `fast-check`) generate hundreds of random inputs to verify that invariant properties always hold. This is applied to:

- `lib/scoring.ts` — property: overall score always falls within [1.00, 5.00] regardless of input distribution
- `lib/tokenCounter.ts` — property: estimated token count is always a positive integer, never negative, never zero for non-empty input
- `lib/questionDedup.ts` — property: the deduplicated array is always a subset of the original, never longer than the original
- `lib/silenceDetector.ts` — property: silence threshold never fires in under 2 seconds regardless of input timing sequence
- `lib/scoring.ts` — property: label mapping is total and exhaustive — every integer in [1, 5] maps to exactly one qualitative label

The test suite (unit, property-based, E2E, mutation) is the living specification of the system. The CI pipeline enforces it on every PR.

---

## 5. Functional Requirements

### F1 — Authentication Module

| ID | Requirement | Priority |
|---|---|---|
| F1.1 | The system shall support user registration via email and password using Supabase Auth. | Must Have |
| F1.2 | The system shall support user login via Google OAuth using Supabase Auth. | Must Have |
| F1.3 | The system shall enforce password validation: minimum 8 characters, at least one uppercase letter, at least one number. | Must Have |
| F1.4 | The system shall maintain user sessions using Supabase SSR session cookies via `@supabase/ssr`. | Must Have |
| F1.5 | All routes under /dashboard, /setup, /session, /reports, and /profile shall be protected. Unauthenticated requests shall be redirected to /login with a `returnTo` query parameter. | Must Have |
| F1.6 | The system shall implement Row Level Security (RLS) in Supabase so that users can only read and write their own data. | Must Have |
| F1.7 | The system shall provide a logout mechanism that clears the session cookie and redirects to /login. | Must Have |
| F1.8 | The system shall display inline, field-level error messages for invalid login or registration attempts without a full page reload. | Must Have |

### F2 — Input & Setup Module

| ID | Requirement | Priority |
|---|---|---|
| F2.1 | The system shall accept resume input via PDF file upload (max 5MB). | Must Have |
| F2.2 | The system shall parse uploaded PDF files client-side using pdf.js and extract the plain text content. | Must Have |
| F2.3 | The system shall accept resume input via plain text paste (max 10,000 characters). | Must Have |
| F2.4 | The system shall display a live character count for text inputs. | Should Have |
| F2.5 | The system shall accept a job description via plain text paste (max 10,000 characters). | Must Have |
| F2.6 | Step 3 of the setup wizard shall present a single horizontal slider with 10 discrete breakpoints to set the ratio between Technical and Behavioral questions. Breakpoint 1 = 100% Technical / 0% Behavioral. Breakpoint 5 = 50% Technical / 50% Behavioral. Breakpoint 10 = 0% Technical / 100% Behavioral. Each intermediate breakpoint increments the behavioral proportion by approximately 11% and decrements the technical proportion by the same. Situational awareness questions are subsumed within the Behavioral category and are not a separate slider axis. | Must Have |
| F2.7 | The slider shall display a live ratio label beneath it as the user drags (e.g. "60% Technical / 40% Behavioral") that updates in real time at each breakpoint snap. The label shall clearly communicate what proportion of questions will be generated for each type. | Must Have |
| F2.8 | The system shall prevent session start if resume input or job description is missing, with clear inline validation messages. The slider always has a valid value (defaults to breakpoint 5, 50/50) so it cannot be an invalid state. | Must Have |
| F2.9 | The system shall display a setup confirmation screen showing: truncated resume preview, truncated JD preview, and the selected Technical/Behavioral ratio. The user can go back or confirm to start. | Must Have |
| F2.10 | The system shall store the resume text, JD text, and the slider ratio value (as a numeric breakpoint 1–10) in Supabase against the session record upon session creation. | Must Have |
| F2.11 | Step 1 of the setup wizard shall present three resume input options as tabs: "Saved Resumes," "Upload New," and "Paste Text." | Must Have |
| F2.12 | The "Saved Resumes" tab shall fetch the authenticated user's resumes from the `user_resumes` table and display them as a selectable list showing filename and upload date. If the user has a default resume, it shall be pre-selected on page load. | Must Have |
| F2.13 | Selecting a saved resume shall immediately load its `extracted_text` into the session Zustand state. No file download or re-parsing shall occur. | Must Have |
| F2.14 | The "Upload New" tab shall present a drag-and-drop PDF upload zone. After upload and parsing, a checkbox "Save to my profile for future sessions" shall be displayed. If checked, the file and extracted text are saved to Supabase Storage and `user_resumes` on session confirmation. | Must Have |
| F2.15 | If a user has no saved resumes, the "Saved Resumes" tab shall display an empty state with a prompt to upload a resume or visit /profile. | Must Have |

### F3 — Question Generation Engine & Pre-Session Flow

#### F3a — Question Generation

| ID | Requirement | Priority |
|---|---|---|
| F3.1 | On session confirmation, the system shall make a single API call to the Gemini Pro API to pre-generate a structured set of 8–12 interview questions. | Must Have |
| F3.2 | The question generation prompt shall include: the full resume text, the full JD text, the Technical/Behavioral ratio derived from the slider breakpoint, the user's display name, and an instruction to generate questions that explicitly reference specific details from the resume and JD. Situational awareness questions shall be included within the Behavioral category — they are not requested separately. | Must Have |
| F3.3 | The ratio of Technical to Behavioral questions in the generated set shall directly reflect the slider value. A breakpoint 1 session shall produce a question set that is 100% technical. A breakpoint 10 session shall produce 100% behavioral. A breakpoint 5 session shall produce approximately 50% of each. Intermediate breakpoints increment the behavioral proportion by approximately 11% per step. | Must Have |
| F3.4 | The API shall return questions as a structured JSON array. Each question object shall include: `id` (string), `question` (string), `category` (either `technical` or `behavioral`), and `expectedKeywords` (array of strings). | Must Have |
| F3.5 | In addition to the question set, the API call shall also return a dynamically generated opening greeting. The greeting shall be personalised with the user's display name and the target role extracted from the JD (e.g. "Hi Aditya, great to meet you. I'll be interviewing you today for the Senior Product Manager role at Acme Corp. Let's get started."). The greeting shall sound natural and human, not robotic. | Must Have |
| F3.6 | The question generation prompt shall also return a dynamically generated closing note. The closing note shall be personalised based on the session (user name, role) and shall conclude the interview naturally (e.g. "Thanks for your time today, Aditya. It was great learning more about your background. You'll be able to review your full performance report in the Reports section."). | Must Have |
| F3.7 | The system shall deduplicate questions by comparing semantic intent. Questions that are near-identical in meaning shall be replaced with a semantically distinct alternative before the session begins. | Should Have |

#### F3b — Pre-Session Loading & Preparation Flow

| ID | Requirement | Priority |
|---|---|---|
| F3.8 | While the question generation API call is in-flight, the system shall display a full-screen loading screen showing witty rotating phrases that rotate every 2–3 seconds. Example phrases: "Dusting off the whiteboard…", "Coaching the interviewers to be extra tough…", "Reviewing your credentials (very carefully)…". The exact phrases are fixed at build time — they are not AI-generated. | Must Have |
| F3.9 | The witty phrases screen shall remain displayed for the full duration of the API call. The phrases shall transition with a smooth Framer Motion fade between each rotation. There shall be no spinner or progress bar on this screen — the phrases carry the loading state. | Must Have |
| F3.10 | Once the question set is received from Gemini, the witty phrases screen shall immediately and automatically transition to a full-screen microphone permission request screen. | Must Have |
| F3.11 | The microphone permission screen shall display a clear message explaining that MIRA needs microphone access to capture spoken answers, and a single "Allow Microphone" button. Clicking this button shall trigger the browser's native `getUserMedia` microphone permission prompt. | Must Have |
| F3.12 | If the user grants microphone permission, the screen shall immediately transition to the 5-second countdown. If the user denies permission, the screen shall display an inline message explaining that text input will be used as a fallback, and a "Continue with Text Input" button shall advance to the countdown. | Must Have |
| F3.13 | The 5-second countdown shall be a full-screen screen displaying a large centered numeric countdown: 5 → 4 → 3 → 2 → 1. Each number shall transition with a Framer Motion scale animation (scale 1.2 → 1.0, fade in). A brief label such as "Get ready…" shall appear beneath the count. No user interaction is required — the countdown advances automatically. | Must Have |
| F3.14 | When the countdown reaches 0, the session chat interface shall immediately appear and the AI's opening greeting shall begin TTS delivery simultaneously. | Must Have |
| F3.15 | If the question generation API call fails after 3 retry attempts, the system shall dismiss the witty phrases screen and display a full-screen error state with a "Try Again" button. Clicking "Try Again" re-triggers the question generation call without losing the user's setup inputs. | Must Have |

### F4 — Session Interface

#### F4a — Session Chat UI

| ID | Requirement | Priority |
|---|---|---|
| F4.1 | The session shall be displayed as a full-screen conversational chat interface. The AI interviewer's messages appear on the left with an interviewer avatar icon. The candidate's transcribed responses appear on the right. | Must Have |
| F4.2 | The session shall always begin with the dynamically generated opening greeting returned by F3.5. The greeting shall be the first message delivered — before any interview question. It shall be delivered via TTS word-by-word and rendered in the chat UI simultaneously. | Must Have |
| F4.3 | All AI-delivered text (greeting, questions, closing note) shall be delivered via the browser SpeechSynthesis API. Each word shall be rendered in the chat bubble in sync with TTS delivery, appearing word by word as it is spoken. The tone, phrasing, and language of AI messages shall be natural and conversational — exactly as a human interviewer would speak. Questions shall not be prefixed with numbering (e.g. "Question 1:") or mechanical labels. | Must Have |
| F4.4 | The microphone activation button shall only become active after TTS delivery of the current message (greeting or question) is fully complete. | Must Have |
| F4.5 | On mic activation, the Web Speech API shall begin capturing audio. Interim transcription results shall be displayed word by word in a live transcript area on screen as the candidate speaks. | Must Have |
| F4.6 | After a 2-second silence threshold, the system shall commit the final transcription as the candidate's answer, stop listening, and submit the answer for follow-up evaluation. | Must Have |
| F4.7 | A text input fallback shall be rendered in place of the mic button on browsers where Web Speech API is not supported. A browser compatibility notice shall be displayed. | Must Have |
| F4.8 | A session timer showing elapsed time (MM:SS, counting up) shall be displayed in a persistent header throughout the session. A question counter shall be maintained internally in Zustand state to track progress through the pre-generated set, but it shall not be displayed to the user at any point during the session. | Must Have |
| F4.9 | The session shall follow a strictly linear flow. Users cannot skip or re-answer questions. | Must Have |
| F4.10 | The session ends only when ALL pre-generated questions have been asked and answered. Follow-up questions injected between pre-generated questions do not replace them — every pre-generated question must be delivered regardless of how many follow-ups were asked. After the final pre-generated question's answer is committed (and any follow-ups for that question have been resolved), the session automatically transitions to the post-session flow. | Must Have |
| F4.11 | A secondary "End Interview Early" button shall be available throughout the session. Clicking it shall display a confirmation modal. On confirmation, the session skips any remaining questions and follow-ups, proceeds directly to the post-session flow, and the report is generated based on answers provided so far. | Must Have |
| F4.12 | The system shall fire a browser `beforeunload` warning and a custom modal for internal navigation attempts during an active session. | Must Have |

#### F4b — Contextual Follow-Up Generation

| ID | Requirement | Priority |
|---|---|---|
| F4.13 | After each candidate answer is committed, the system shall make a follow-up evaluation call to Gemini to determine whether a contextual follow-up question is warranted. The evaluation shall consider two triggers: (1) the answer is weak, vague, or too short — warranting a probe to elicit more detail; (2) the answer contains something specific and interesting that is worth exploring further given the JD and resume context. Both triggers may independently warrant a follow-up. | Must Have |
| F4.14 | The follow-up evaluation call shall send only the context payload (conversationSummary + lastQuestion + lastAnswer). The full JD text and resume text shall not be re-sent on every follow-up evaluation call — they have already informed the pre-generated question set and are not required per-call. The call shall return a decision (`followUpNeeded: boolean`) and, if warranted, the follow-up question text as a string. | Must Have |
| F4.15 | If a follow-up is warranted, it shall be injected as the next question before advancing to the next pre-generated question. There is no cap on the total number of follow-ups in a session. The session always completes all pre-generated questions regardless of how many follow-ups are injected. | Must Have |
| F4.16 | A follow-up answer may itself trigger another follow-up using the same evaluation logic. However, a maximum of 2 consecutive follow-up questions may be asked before the session must return to the next pre-generated question. The consecutive follow-up counter resets to zero each time the session advances to a new pre-generated question. | Must Have |
| F4.17 | All follow-up questions shall be visually and tonally identical to pre-generated questions in the chat UI. They shall appear in the same chat bubble format, delivered via TTS with the same natural human tone. No label, badge, styling difference, or any other visual indicator shall distinguish a follow-up from a pre-generated question. The user shall never know whether a question is from the pre-generated set or is a contextual follow-up. | Must Have |
| F4.18 | All follow-up questions shall reference the candidate's specific answer directly to demonstrate active listening. They shall sound like a natural continuation of the conversation, not a generic prompt (e.g. "You mentioned leading a distributed team — could you walk me through how you handled communication across time zones?"). | Must Have |

#### F4c — Context Management & Rolling Summarization

| ID | Requirement | Priority |
|---|---|---|
| F4.19 | The system shall maintain a context payload in Zustand state throughout the session. This payload is sent with every follow-up and contextual API call. It consists of three parts: (1) a `conversationSummary` string, (2) the `lastQuestion` string, and (3) the `lastAnswer` string. | Must Have |
| F4.20 | Before each API call, the system shall estimate the total token count of the context payload using a character-based approximation (1 token ≈ 4 characters). | Must Have |
| F4.21 | When the estimated token count of the full context payload is below 12,000 tokens, the system shall send the complete conversation history (all prior Q&A pairs) alongside the last question and answer. No summarization occurs below this threshold. | Must Have |
| F4.22 | When the estimated token count reaches or exceeds 12,000 tokens, the system shall trigger the rolling summarization process. All Q&A exchanges in the history EXCEPT the most recent question and answer shall be sent to Gemini via a dedicated summarization API call (`/api/summarize-context`) with a prompt instructing Gemini to produce a concise factual summary of what was asked and answered. | Must Have |
| F4.23 | The summarization API call shall return a single condensed paragraph (the `conversationSummary`). This summary replaces all prior individual Q&A pairs in the context payload. Only the most recent question and answer are retained as full text. The payload sent to subsequent API calls then consists of: the summary, the last question, and the last answer. | Must Have |
| F4.24 | As the session continues and new Q&A pairs are added after a summarization, the system shall continue accumulating them in the context. When the token threshold is hit again, the summarization process repeats: all exchanges since the last summary (except the latest Q&A pair) are appended to the existing summary and re-summarized together. The latest Q&A pair is always preserved verbatim. | Must Have |
| F4.25 | The `conversationSummary` in the context payload shall always be clearly labelled as a summary when sent to Gemini, so the model understands it is condensed context and not a transcript of the full conversation. | Must Have |

### F5 — Post-Session Flow

| ID | Requirement | Priority |
|---|---|---|
| F5.1 | After the final answer is committed (or after early exit is confirmed), the session shall automatically transition to the star rating screen. | Must Have |
| F5.2 | The rating screen shall display a 1–5 star selector and an optional written feedback text area (max 500 characters). A "Submit & Continue" button shall be disabled until a star rating is selected. Written feedback is optional. | Must Have |
| F5.3 | On rating submission, the star rating and written feedback text shall be stored in the `session_feedback` table in Supabase against the session ID. | Must Have |
| F5.4 | Immediately after rating submission, the system shall transition to the AI closing note screen. The closing note (generated at session start per F3.6) shall be delivered via TTS word-by-word and rendered simultaneously in a centered full-screen card. The closing note is personalised — it includes the user's name and the target role. | Must Have |
| F5.5 | After TTS delivery of the closing note completes, the system shall automatically transition to a full-screen report generation wait screen. This screen shall display a message such as "Analysing your performance…" with a Framer Motion animated indicator. There shall be no countdown — the screen persists until the report API call completes. | Must Have |
| F5.6 | The report generation API call shall be triggered immediately upon rating submission (concurrent with the closing note delivery). By the time the closing note TTS finishes and the wait screen appears, the report may already be ready. If it is, the wait screen transitions immediately. If not, it waits. | Must Have |
| F5.7 | The report generation API call shall send the full session transcript and the JD text to Gemini via `/api/generate-report` with a structured evaluation prompt. | Must Have |
| F5.8 | The evaluation prompt shall instruct Gemini to return a structured JSON report containing: per-answer fields for every question asked in the session — pre-generated and follow-up alike, treated identically as standalone scored items (`questionId`, `numericScore` 1–5, `qualitativeLabel` Excellent/Good/Needs Work/Poor, `dimensionScores` for all 6 dimensions: relevance, STAR usage, clarity, role alignment, delivery, improvement specificity, `feedbackText` 2–4 sentences) — and top-level fields (`overallScore`, `topStrengths` array of 3, `topImprovementAreas` array of 3, `roleAlignmentSummary` paragraph referencing specific JD requirements). | Must Have |
| F5.9 | The complete report JSON, full session transcript, session metadata (date, slider ratio, role title, duration), and overall score shall be persisted to Supabase in the `reports` and `transcripts` tables. | Must Have |
| F5.10 | Once the report is ready, the wait screen shall transition to a completion screen displaying two action buttons: "Go to Dashboard" (navigates to `/dashboard`) and "View Report" (navigates to `/reports/[sessionId]`). This screen shall not auto-advance — the user chooses where to go. | Must Have |
| F5.11 | If the report generation API call fails after retries, the completion screen shall still appear, but the "View Report" button shall be replaced with a "Retry Report Generation" button. The transcript is always saved to Supabase regardless of report generation failure. | Must Have |

### F6 — PDF Export

| ID | Requirement | Priority |
|---|---|---|
| F6.1 | The report page shall include a "Download PDF" button that generates a formatted PDF client-side using jsPDF. | Must Have |
| F6.2 | The PDF shall contain: a cover section (session date, role, Technical/Behavioral ratio, overall score), the full question-and-answer transcript with speaker labels in sequential order, and the complete per-question analysis with scores and qualitative feedback. Every question in the PDF — whether pre-generated or a contextual follow-up — is treated as a standalone question. No question in the PDF is labelled, marked, or otherwise distinguished as a follow-up. | Must Have |
| F6.3 | The PDF file shall be named `MIRA_Report_YYYY-MM-DD.pdf`. | Must Have |
| F6.4 | Each session card on the dashboard shall include a "Download Report" button that regenerates and downloads the PDF for that session using data retrieved from Supabase. | Must Have |

### F7 — User Dashboard

| ID | Requirement | Priority |
|---|---|---|
| F7.1 | The dashboard shall display a "Start New Interview" button that navigates the user to /setup. | Must Have |
| F7.2 | The dashboard shall display a list of all past sessions for the logged-in user in reverse chronological order. Each session card shall show: date, JD role title (truncated to 60 chars), Technical/Behavioral ratio (e.g. "60T / 40B"), overall numeric score, and a "View Report" button navigating to `/reports/[sessionId]`. | Must Have |
| F7.3 | The dashboard shall display a line chart showing the user's overall session score trend over time. The chart shall only render when the user has 2 or more completed sessions. | Must Have |
| F7.4 | Session data shall be fetched from Supabase with RLS enforced so that users only see their own sessions. | Must Have |
| F7.5 | The dashboard shall display a loading skeleton while session data is being fetched, and an empty state illustration when no sessions exist yet. | Should Have |

### F11 — Reports Page

| ID | Requirement | Priority |
|---|---|---|
| F11.1 | The system shall expose a `/reports` page listing all completed reports for the authenticated user, accessible from the "My Reports" item in the avatar dropdown. | Must Have |
| F11.2 | The `/reports` page shall display all past session reports in reverse chronological order. Each report entry shall show: session date, target role title, Technical/Behavioral ratio used, overall numeric score, qualitative overall label (Excellent/Good/Needs Work/Poor), and the star rating the user submitted. | Must Have |
| F11.3 | Clicking any report entry on `/reports` shall navigate to `/reports/[sessionId]` — the full report detail page for that session. | Must Have |
| F11.4 | The `/reports/[sessionId]` page shall display the complete performance report for that session including: overall score card (numeric score, qualitative label, session metadata — date, duration, ratio, role), role alignment summary paragraph, top 3 strengths, top 3 improvement areas, and a per-question breakdown. | Must Have |
| F11.5 | The per-question breakdown shall display every question asked during the session as a standalone item at the same level — no question is labelled, grouped, or visually distinguished as a follow-up or a pre-generated question. Each item shows: the question text, the candidate's full answer text, the numeric score, the qualitative label, the 6 dimension score badges, and 2–4 sentences of qualitative feedback. Each item is an expandable Accordion entry, collapsed by default. The order reflects the sequence in which questions were asked during the session. | Must Have |
| F11.6 | The full session transcript shall be available on the `/reports/[sessionId]` page as a collapsible section, rendering all turns (AI and candidate) in order with clear speaker labels. | Must Have |
| F11.7 | The `/reports/[sessionId]` page shall include a "Download PDF" button. Clicking it shall generate and download a formatted PDF containing: a cover page (date, role, ratio, overall score), the full Q&A transcript with speaker labels in sequential order, and the complete per-question analysis with scores and feedback. Every question in the PDF is a standalone item — no question is labelled or distinguished as a follow-up at any point. The file shall be named `MIRA_Report_YYYY-MM-DD.pdf`. | Must Have |
| F11.8 | The `/reports/[sessionId]` page shall be accessible both immediately after a session (navigated from the post-session completion screen) and at any future time (navigated from `/reports` or the dashboard). In both cases it shall load its data from Supabase with RLS enforced. | Must Have |
| F11.9 | The `/reports` page shall display a loading skeleton while report list data is being fetched, and an empty state when no reports exist. | Should Have |
| F11.10 | Each report entry on `/reports` shall include a "Download PDF" button that regenerates and downloads the PDF for that session without requiring the user to navigate to the full report detail page first. | Must Have |

### F12 — AI API Gateway

| ID | Requirement | Priority |
|---|---|---|
| F12.1 | The system shall implement a provider-agnostic AI API gateway as a Next.js server-side module. All AI calls from all features (question generation, follow-up evaluation, context summarization, report generation, LLM-as-judge) shall route through this gateway. No feature shall call any AI provider SDK directly. | Must Have |
| F12.2 | The gateway shall support multiple AI providers. In v1, Gemini Pro and Groq are the configured providers. The gateway abstracts provider-specific request formatting and response parsing so the calling feature receives a normalised response regardless of which provider handled the request. | Must Have |
| F12.3 | Each AI provider has a distinct request format and response schema. The gateway shall implement a provider adapter per supported provider. Each adapter is responsible for: transforming the normalised gateway request into the provider's expected format, calling the provider's API, and transforming the provider's response back into the normalised gateway response format. | Must Have |
| F12.4 | The admin designates one provider as the active/primary provider for the entire application via the admin dashboard. All AI calls are routed to the active provider unless it is unavailable. | Must Have |
| F12.5 | Within the active provider, multiple API keys may be configured by the admin. The gateway shall distribute requests across these keys using a round-robin strategy. The round-robin counter shall be maintained in server-side state (not per-request) so that successive requests cycle through the key pool. | Must Have |
| F12.6 | When a provider key returns a 429 (rate limit) or any 5xx error, the gateway shall try the next key in the same provider's pool. If all keys for the active provider are exhausted and all return errors, the gateway shall automatically fall back to the next configured provider and attempt the request using that provider's key pool. | Must Have |
| F12.7 | If all configured providers and all their keys are exhausted or unavailable, the gateway shall return a structured error to the calling feature. The calling feature is responsible for surfacing this to the user with a retry option. | Must Have |
| F12.8 | Provider API keys entered by the admin shall be stored encrypted at rest in Supabase using the `pgcrypto` extension. Keys shall be decrypted only within the gateway module at the moment of use. Decrypted keys shall never be logged, cached in plaintext, or returned in any API response. | Must Have |
| F12.9 | The gateway shall record a log entry in the `ai_call_logs` table for every AI call made. Each log entry shall contain: provider name, key index used (not the key value itself), call type (question-generation / follow-up / summarize-context / report / judge), latency in milliseconds, estimated token count, HTTP status code returned by the provider, and a timestamp. | Must Have |
| F12.10 | The gateway module shall expose a single async function: `gatewayCall(callType, prompt, options)`. Callers pass a normalised prompt and call type. The gateway handles provider selection, key rotation, retries, response normalisation, and logging transparently. | Must Have |

### F13 — Admin Module

#### F13a — Admin Authentication & Role

| ID | Requirement | Priority |
|---|---|---|
| F13.1 | The admin role shall be represented by a `role` column in the `profiles` table with values `user` (default) or `admin`. | Must Have |
| F13.2 | Admin role assignment for v1 shall be performed directly in the Supabase database by the team (SQL UPDATE). The method for assigning admin roles via the UI is TBD and deferred to a future decision. | Must Have |
| F13.3 | All routes under `/admin` shall be protected by the middleware. A valid session is required AND the user's `role` must be `admin`. Any authenticated non-admin user attempting to access `/admin` routes shall receive a 403 and be redirected to `/dashboard`. | Must Have |
| F13.4 | Admin users shall authenticate through the same `/login` page as regular users. There is no separate admin login page. | Must Have |
| F13.5 | Admin users shall have no access to individual user session content, transcripts, or reports. The admin role confers infrastructure and user management capabilities only — never user content visibility. This privacy boundary shall be enforced at the RLS level, not just the UI level. | Must Have |

#### F13b — Admin User Management

| ID | Requirement | Priority |
|---|---|---|
| F13.6 | The admin dashboard shall display a paginated list of all registered users. Each entry shall show: display name, email address, signup date, and total session count. | Must Have |
| F13.7 | The admin shall be able to suspend or deactivate a user account. A suspended user shall be unable to log in and shall see an informative message on the login page. The suspension shall be reversible by the admin. | Must Have |
| F13.8 | The admin shall be able to permanently delete a user account and all associated data (sessions, transcripts, reports, feedback, resumes, storage files). This action shall require a confirmation step and shall be irreversible. | Must Have |
| F13.9 | The admin shall never see any individual user's session transcripts, performance reports, resume content, or JD content. User management operations are limited to account-level CRUD only. | Must Have |

#### F13c — Admin AI Provider Configuration

| ID | Requirement | Priority |
|---|---|---|
| F13.10 | The admin dashboard shall include an AI Providers section listing all configured providers (name, status: active/inactive, number of keys configured). | Must Have |
| F13.11 | The admin shall be able to add a new AI provider by specifying the provider name and entering one or more API keys. The admin shall be able to add additional API keys to an existing provider at any time. | Must Have |
| F13.12 | The admin shall be able to designate exactly one provider as the active/primary provider. Changing the active provider takes effect immediately for all subsequent AI calls. Only one provider may be active at a time. | Must Have |
| F13.13 | The admin shall be able to remove individual API keys from a provider's key pool or remove an entire provider. Removing the currently active provider shall require the admin to designate a different provider as active first. | Must Have |
| F13.14 | API keys shall be displayed in the admin UI as masked values (e.g. `sk-••••••••••••••••3f2a`). The admin may copy a key reference but the full key value shall never be returned in any API response after initial submission. | Must Have |

#### F13d — Admin Observability

| ID | Requirement | Priority |
|---|---|---|
| F13.15 | The admin dashboard shall display a paginated, filterable log of all AI gateway calls. Each log entry shall show: timestamp, call type, provider used, key index (masked), latency (ms), estimated token count, and HTTP status. | Must Have |
| F13.16 | The admin dashboard shall display the eval system results and historical metrics (described in F14). No user-identifying information shall be shown alongside eval results. | Must Have |

### F14 — Evaluation System (LLM-as-Judge)

#### F14a — Eval Dimensions

| ID | Requirement | Priority |
|---|---|---|
| F14.1 | The system shall implement an LLM-as-judge evaluation framework that runs after every completed session, asynchronously, without blocking or affecting the user flow in any way. | Must Have |
| F14.2 | The evaluation framework shall assess MIRA's own AI output quality across five dimensions. Each dimension produces a numeric score (1–5) and a short rationale string: | Must Have |
| F14.2a | **Question Quality** — were the generated questions specific and grounded in the resume and JD content, or generic? The judge shall assess each question for specificity, relevance, and whether it references concrete details from the inputs. | Must Have |
| F14.2b | **Question Calibration** — does the question set reflect the Technical/Behavioral slider ratio selected by the user? The judge shall count question categories and compute the actual ratio, comparing it against the configured ratio. A calibration score of 5 means the set matches within ±5%. | Must Have |
| F14.2c | **Follow-up Appropriateness** — for each follow-up that was injected, was the decision correct? The judge shall assess whether the follow-up added value given the candidate's answer and whether the follow-up question was relevant and specific. | Must Have |
| F14.2d | **Report Accuracy** — does the AI-generated performance report reflect a fair and accurate evaluation of the session? The judge shall assess whether the scores and feedback are consistent with the quality of the candidate's answers. | Must Have |
| F14.2e | **Response Tone** — do the AI-generated questions, follow-ups, greeting, and closing note sound natural, human, and professional? The judge shall flag any responses that sound robotic, templated, or awkward. | Must Have |

#### F14b — Eval Execution & Storage

| ID | Requirement | Priority |
|---|---|---|
| F14.3 | The eval run shall be triggered automatically after report generation completes for a session. It shall be fire-and-forget — the eval result is not required by any user-facing feature and shall never delay the user's post-session flow. | Must Have |
| F14.4 | The eval judge call shall be routed through the AI gateway (F12) like all other AI calls. The judge uses the same active provider as the rest of the application. | Must Have |
| F14.5 | The eval judge shall receive: the full question set, the Technical/Behavioral slider value, the complete session transcript, the AI-generated report JSON, and the opening greeting and closing note. It shall NOT receive any user-identifying information (no user ID, no email, no display name). | Must Have |
| F14.6 | The eval result for each session shall be stored in the `eval_results` table in Supabase. Each row shall contain: session ID (anonymised reference — no user ID stored directly in this table), overall eval score, per-dimension scores and rationale strings, provider used for the judge call, and timestamp. | Must Have |
| F14.7 | Eval results shall not be visible to regular users at any point. They are an internal quality assurance mechanism, visible only in the admin dashboard. | Must Have |

#### F14c — Historical Metrics

| ID | Requirement | Priority |
|---|---|---|
| F14.8 | The admin dashboard shall display a historical eval metrics view showing: average scores per dimension over time (line chart per dimension), overall average eval score trend (line chart), total sessions evaluated, and a table of the most recent 20 eval results. | Must Have |
| F14.9 | Historical eval data shall persist indefinitely in Supabase. There is no automatic purging of eval records. | Must Have |
| F14.10 | The eval metrics view shall support filtering by date range so the admin can compare quality across time periods or after prompt changes. | Should Have |

| ID | Requirement | Priority |
|---|---|---|
| F8.1 | The system shall maintain a private Supabase Storage bucket named `resumes`. All files shall be stored under a user-scoped path: `{userId}/{timestamp}_{filename}.pdf`. | Must Have |
| F8.2 | Resume uploads shall be accepted only as PDF files with a maximum size of 5MB. File type shall be validated both client-side (via `accept="application/pdf"`) and server-side in the `/api/resumes/upload` route before writing to storage. | Must Have |
| F8.3 | On upload, the PDF shall be parsed client-side using pdf.js to extract plain text. Both the Supabase Storage path and the extracted text shall be saved to the `user_resumes` table in a single operation. | Must Have |
| F8.4 | A user shall be permitted a maximum of 10 saved resumes at any time. If the limit is reached, an upload attempt shall be blocked with an inline message: "You have reached the maximum of 10 saved resumes. Please delete one before uploading a new one." | Must Have |
| F8.5 | The system shall support marking one resume as the default via an `is_default` boolean in `user_resumes`. Setting a new default shall unset the previous one in the same database transaction. | Must Have |
| F8.6 | Deleting a resume shall remove both the file from Supabase Storage (via `storage.remove()`) and the corresponding row from `user_resumes`. Both operations shall be performed server-side in the `/api/resumes/[id]` DELETE route. If the storage delete fails, the database row shall not be deleted, and an error shall be surfaced to the user. | Must Have |
| F8.7 | Downloading a saved resume shall be handled by a server-side API route (`/api/resumes/[id]/download`) that generates a signed URL from Supabase Storage scoped to that file path. The signed URL shall expire after 60 seconds. The route shall verify via RLS that the requesting user owns the resume before generating the URL. | Must Have |
| F8.8 | All resume file operations (upload, delete, download URL generation) shall be performed through Next.js API routes. The Supabase service role key used for storage operations shall never be exposed to the client. | Must Have |
| F8.9 | The `user_resumes` table shall have RLS enabled. Users can only SELECT, INSERT, UPDATE, and DELETE rows where `user_id = auth.uid()`. | Must Have |
| F8.10 | Storage bucket RLS shall enforce that users can only read and write to paths prefixed with their own `userId`. Cross-user file access shall return a 403 at the storage layer regardless of whether the API route is reached. | Must Have |

### F9 — Profile Page

| ID | Requirement | Priority |
|---|---|---|
| F9.1 | The system shall expose a `/profile` page accessible to authenticated users from the top navigation. | Must Have |
| F9.2 | The profile page shall display the user's email address (read-only, sourced from Supabase Auth) and an editable display name field sourced from the `profiles` table. | Must Have |
| F9.3 | The profile page shall display all of the user's saved resumes as a list. Each entry shall show: the original filename, the upload date, a default badge if applicable, a "Set as default" button, a "Download" button, and a "Delete" button. | Must Have |
| F9.4 | The profile page shall include a resume upload zone (identical in behavior to the "Upload New" tab in /setup) that always saves the uploaded resume to the user's profile. | Must Have |
| F9.5 | Clicking "Set as default" on a resume shall update the `is_default` flag in `user_resumes` and visually reflect the new default immediately without a page reload. | Must Have |
| F9.6 | Clicking "Delete" on a resume shall display a confirmation dialog before proceeding. On confirmation, the server-side delete route is called, and the resume is removed from both Storage and the list UI without a page reload. | Must Have |
| F9.7 | The profile page shall display a resume count indicator (e.g. "3 / 10 resumes saved") so users know how close they are to the limit. | Should Have |
| F9.8 | On mobile viewports, resume list item action buttons (Set as default, Download, Delete) shall collapse into a per-item dropdown menu to preserve horizontal space. | Must Have |

### F10 — Navigation & Global UI

| ID | Requirement | Priority |
|---|---|---|
| F10.1 | The top navigation bar shall be present on all protected pages: `/dashboard`, `/setup`, `/reports`, `/reports/[sessionId]`, and `/profile`. It shall be absent on `/session` (all internal session states). | Must Have |
| F10.2 | The navigation bar shall display the MIRA logo on the left, a "New Interview" button in the center-right, and a user avatar with dropdown on the far right. | Must Have |
| F10.3 | The avatar shall display the user's Google profile photo if signed in via Google OAuth, or initials derived from their display name or email as a fallback using the ShadCN `Avatar` and `AvatarFallback` components. | Must Have |
| F10.4 | The avatar dropdown shall contain the following items in order: user email (display only), separator, "My Reports" (navigates to `/reports`), "My Resumes" (navigates to `/profile` resumes section), "Profile Settings" (navigates to `/profile`), separator, "Sign Out". | Must Have |
| F10.5 | On mobile viewports, the navigation bar shall collapse into a hamburger icon that opens a ShadCN `Sheet` drawer containing the same navigation links. | Must Have |
| F10.6 | The global toast notification system shall be mounted in the root layout and accessible from any component via `toast()` utility. Toasts shall auto-dismiss after 4 seconds and support `success` (green), `error` (red), `warning` (amber), and `info` (blue) variants with matching background and text colors. | Must Have |
| F10.7 | All page transitions shall be animated using Framer Motion with a fade and slight upward slide (`y: 10 → 0, opacity: 0 → 1`, duration 300ms, ease-out). | Must Have |
| F10.8 | All animations shall be disabled when `prefers-reduced-motion` is enabled in the user's operating system, detected via the Framer Motion `useReducedMotion` hook. | Must Have |
| F10.9 | The application shall never show a blank white flash during route transitions. The Framer Motion `AnimatePresence` wrapper shall be applied at the layout level to ensure outgoing and incoming pages animate simultaneously. | Must Have |
| F10.10 | All loading states (API calls, data fetches, file uploads) shall display ShadCN `Skeleton` components with a consistent shimmer animation. No spinner-only loading states shall be used for content areas. | Should Have |

## 6. Non-Functional Requirements

### Performance

| ID | Requirement |
|---|---|
| NF-P1 | The question generation API call shall complete and display the first question within 8 seconds of session confirmation on a standard broadband connection. |
| NF-P2 | TTS delivery of each question shall begin within 500ms of the question being made active. |
| NF-P3 | The report generation API call shall complete within 15 seconds of rating submission. A loading state with progress indication shall be shown throughout. |
| NF-P4 | Dashboard session list shall load within 3 seconds. Pagination or infinite scroll shall be implemented if a user has more than 20 sessions. |
| NF-P5 | PDF generation shall complete client-side within 5 seconds for a standard 10-question session report. |

### Security

| ID | Requirement |
|---|---|
| NF-S1 | All AI provider API calls shall be proxied exclusively through the AI gateway module running inside Next.js API routes. No AI provider SDK shall be called directly from the client or from any route that is not server-side. |
| NF-S2 | Supabase Row Level Security shall be enabled on all tables. Every query shall be scoped to the authenticated user's ID. Admin-only tables (`ai_call_logs`, `ai_providers`, `eval_results`) shall have RLS policies that restrict access to rows where the requesting user has `role = admin`. |
| NF-S3 | User passwords shall never be stored or handled by the application layer — authentication is fully delegated to Supabase Auth. |
| NF-S4 | All HTTP communication shall be over HTTPS. Vercel enforces this by default. |
| NF-S5 | All secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PGCRYPTO_SECRET`) shall be stored as Vercel environment variables and never committed to the repository. A `.env.example` file documents required variable names with no values. |
| NF-S6 | Dependency vulnerabilities shall be scanned on every PR via `yarn audit --level high`. Any high or critical severity vulnerability shall block the PR from merging. |
| NF-S7 | Static application security testing (SAST) shall be performed on every PR via GitHub CodeQL analysis. Any Critical or High severity finding shall block the PR. Results shall be visible in the GitHub Security tab. |
| NF-S8 | AI provider API keys stored in the database shall be encrypted at rest using the Supabase `pgcrypto` extension. Keys are decrypted only within the gateway module at call time. Decrypted key values shall never be returned in any API response, never logged, and never cached in plaintext. |
| NF-S9 | Secrets scanning shall be added to the CI pipeline using `trufflesecurity/trufflehog-actions-scan`. Any committed secret detected shall immediately fail the pipeline and block the PR. |

### OWASP Top 10 Mitigation Mapping

The following table maps each OWASP Top 10 (2021) category to MIRA's explicit mitigation. This mapping is maintained as a living reference for the security audit.

| OWASP Category | MIRA Mitigation |
|---|---|
| A01 — Broken Access Control | Supabase RLS on all tables enforces per-user data isolation at the database layer. Admin routes protected by role check in middleware. Admin can never access user content (session transcripts, reports) even if the UI is bypassed — RLS enforces this independently. |
| A02 — Cryptographic Failures | AI provider keys encrypted at rest with pgcrypto. HTTPS enforced on all traffic by Vercel. Supabase Auth uses bcrypt for password hashing. No sensitive data transmitted over unencrypted channels. |
| A03 — Injection | All Supabase queries use the typed Supabase JS client which parameterises all inputs. No raw SQL strings are constructed from user input anywhere in the codebase. Gemini prompts include user text but are sent as structured JSON fields, not interpolated into raw query strings. |
| A04 — Insecure Design | RLS-first architecture: access control is at the data layer, not only the application layer. Admin privacy boundary is a hard RLS constraint, not a UI-only check. API gateway never exposes provider keys in responses. |
| A05 — Security Misconfiguration | CodeQL SAST on every PR. `yarn audit` on every PR. `trufflesec/trufflehog` secrets scanning on every PR. No default credentials. Supabase service role key is server-side only — never in any `NEXT_PUBLIC_` variable. |
| A06 — Vulnerable and Outdated Components | `yarn audit --level high` blocks PRs on high/critical CVEs. Dependabot or Renovate may be added in v2 for automated dependency updates. |
| A07 — Identification and Authentication Failures | Authentication fully delegated to Supabase Auth (battle-tested). Session tokens are httpOnly SSR cookies managed by `@supabase/ssr`. No custom authentication logic. Password validation enforced client-side and by Supabase. Google OAuth via Supabase. |
| A08 — Software and Data Integrity Failures | GitHub branch protection requires PR reviews and all CI checks to pass before merge. No direct pushes to `main`. Production deploys only on merge to `main`. |
| A09 — Security Logging and Monitoring Failures | Sentry captures all application errors with stack traces. AI gateway logs all calls to `ai_call_logs` table (provider, latency, status — no key values). Better Stack monitors uptime with alerting to team email. |
| A10 — Server-Side Request Forgery (SSRF) | The application makes outbound requests only to explicitly known hosts (Supabase, Gemini API, Groq API). No user-supplied URLs are fetched server-side. The AI gateway validates provider endpoints from the database configuration, not from user input. |

### Caching

| ID | Requirement |
|---|---|
| NF-C1 | The generated question set (including opening greeting and closing note) shall be cached in `sessionStorage` under a session-scoped key immediately after it is received from the gateway. If the user refreshes the page during the countdown or session, the cached question set shall be restored from `sessionStorage` and the session shall resume from the beginning of the chat phase rather than losing all progress. |
| NF-C2 | The `sessionStorage` cache entry shall be cleared when the session transitions to the rating screen (post-session flow begins). It shall not persist after the session is complete. |
| NF-C3 | The `sessionStorage` cache shall store: the question array, the opening greeting string, the closing note string, the session ID, and the slider value. It shall not store the resume text or JD text. |

### Production Monitoring

| ID | Requirement |
|---|---|
| NF-M1 | Sentry shall be integrated into the Next.js application using the official `@sentry/nextjs` SDK. Sentry shall capture: all unhandled exceptions, all API route errors, all client-side React errors via the Error Boundary, and all AI gateway call failures. |
| NF-M2 | Sentry source maps shall be uploaded on each production deployment so stack traces in Sentry point to the original TypeScript source lines, not compiled output. |
| NF-M3 | Vercel Analytics shall be enabled on the production deployment to provide APM data: request latency per route, error rate per route, and Web Vitals (LCP, FID, CLS) per page. |
| NF-M4 | Better Stack (BetterUptime) shall monitor the production URL with a 1-minute check interval. If the production URL returns a non-2xx response or times out for 2 consecutive checks, an alert shall be sent to the team email. |
| NF-M5 | Sentry shall be configured to send email alerts to the team when a new issue is first seen, when an existing issue regresses after being resolved, and when error volume exceeds 10 occurrences in 1 hour. |
| NF-M6 | The Sentry project DSN and Better Stack API key shall be stored as Vercel environment variables and never committed to the repository. |

### Reliability & Error Handling

| ID | Requirement |
|---|---|
| NF-R1 | All Gemini API calls shall implement retry logic with exponential backoff (max 3 retries) for transient errors (429, 503). |
| NF-R2 | If the question generation call fails after retries, the user shall be shown a descriptive error page with an option to retry without losing their setup inputs. |
| NF-R3 | If the report generation call fails, the transcript shall still be saved to Supabase. The user shall be offered a "Retry Report Generation" option. |
| NF-R4 | If the Web Speech API fails mid-session (e.g. microphone disconnected), the system shall gracefully fall back to text input and notify the user with a toast notification. |
| NF-R5 | Supabase write failures (e.g. during session save) shall be surfaced to the user with a non-blocking toast. The report page shall still render using in-memory data even if the Supabase write fails. |

### Accessibility

| ID | Requirement |
|---|---|
| NF-A1 | All interactive elements shall be keyboard-navigable using Tab and Enter/Space. |
| NF-A2 | Microphone status changes (idle, listening, processing) shall be announced via ARIA live regions for screen reader users. |
| NF-A3 | Star rating component shall be keyboard-operable and include aria-label attributes. |
| NF-A4 | Color shall never be the sole indicator of state. Scores and labels in the report shall use icons or text in addition to color. |
| NF-A5 | All images and icons shall include descriptive alt text or aria-hidden where decorative. |

### Browser Compatibility

| ID | Requirement |
|---|---|
| NF-B1 | Full functionality (including TTS and speech recognition) shall be supported on Chrome 110+ and Edge 110+. |
| NF-B2 | Core functionality (text input fallback, session completion, report viewing) shall work on Safari 16+. |
| NF-B3 | Firefox is not a supported browser for speech features. A clear browser recommendation notice shall be displayed on the setup page. |

### Responsiveness

| ID | Requirement |
|---|---|
| NF-RS1 | The application shall be fully responsive across all device sizes and viewport widths. No layout shall break, overflow, or misalign at any breakpoint. |
| NF-RS2 | Tailwind responsive breakpoints shall be applied consistently: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px). |
| NF-RS3 | All pages shall be usable and visually correct on mobile (320px), tablet (768px), and desktop (1280px+) viewports. |
| NF-RS4 | The session chat interface shall reflow naturally on smaller screens — the chat area scrolls, the mic button remains accessible at the bottom, and the header bar compresses without truncation. |
| NF-RS5 | The dashboard session grid shall switch between 1 column (mobile), 2 columns (tablet), and 3 columns (desktop) using responsive grid classes. |
| NF-RS6 | The setup wizard shall be single-column on mobile, two-column on desktop for the confirmation preview step. |
| NF-RS7 | No fixed pixel widths shall be used on container elements. All layouts shall use fluid widths, max-width containers, and gap-based spacing. |

### Animations & Transitions

| ID | Requirement |
|---|---|
| NF-AN1 | Framer Motion shall be used for all page transitions, component mount/unmount animations, and interactive state changes throughout the application. |
| NF-AN2 | All animations shall be smooth, intentional, and non-disruptive. Default easing shall use `ease-out` with durations between 200ms–400ms for UI transitions and 400ms–600ms for page-level transitions. |
| NF-AN3 | Page transitions between routes shall use a fade + slight upward slide (`y: 10 → 0, opacity: 0 → 1`) to create a sense of depth and progression. |
| NF-AN4 | Chat bubbles in the session interface shall animate in with a fade + scale from 0.95 to 1.0 to simulate natural message appearance. |
| NF-AN5 | The microphone button active state shall use a smooth pulse animation while listening. The transition between idle, listening, and processing states shall be animated. |
| NF-AN6 | The word-by-word TTS chat rendering shall not use animation delays — each word appends immediately as spoken by SpeechSynthesis. The natural cadence of speech is the animation. |
| NF-AN7 | The rating star hover state shall animate with a gentle scale and color transition. Selected stars shall animate sequentially left to right. |
| NF-AN8 | The report page per-answer cards shall animate in with a staggered fade as the page loads, not all at once. Stagger delay: 50ms per card. |
| NF-AN9 | The score trend chart on the dashboard shall animate its line drawing on mount using Recharts' built-in animation. |
| NF-AN10 | All animations shall respect `prefers-reduced-motion`. When the user has reduced motion enabled, all Framer Motion animations shall use `duration: 0` via the `useReducedMotion` hook. |
| NF-AN11 | Loading skeleton components shall use a shimmer animation (left-to-right gradient sweep) consistent across all skeleton instances. |

### Token & Cost Management

| ID | Requirement |
|---|---|
| NF-T1 | The session controller shall maintain a context payload consisting of three parts: `conversationSummary` (string), `lastQuestion` (string), and `lastAnswer` (string). This payload is sent with every follow-up and contextual API call. |
| NF-T2 | Before each API call, the system shall estimate the total token count of the full context payload using a character-based approximation (1 token ≈ 4 characters). |
| NF-T3 | When estimated token count is below 12,000 tokens, the system shall send the full conversation history (all prior Q&A pairs) alongside the last question and answer. No summarization is triggered below this threshold. |
| NF-T4 | When estimated token count reaches or exceeds 12,000 tokens, the system shall trigger a Gemini summarization call via `/api/summarize-context`. The call sends all Q&A exchanges except the most recent pair with a prompt to produce a concise factual summary. The returned summary replaces all prior pairs in the context payload. Only the most recent Q&A pair is retained verbatim. |
| NF-T5 | After summarization, new Q&A pairs continue accumulating in the context. When the 12,000 token threshold is hit again, all accumulated pairs since the last summary (except the latest pair) are appended to the existing summary and re-summarized together. This process repeats throughout the session. |
| NF-T6 | The `conversationSummary` field shall always be clearly labelled as condensed context when sent to Gemini, so the model understands it represents a summary of prior exchanges rather than a verbatim transcript. |
| NF-T7 | The total number of Gemini API calls per session is: 1 (question generation + greeting + closing note) + N follow-up evaluation calls (one per answer committed, no cap — session length is determined by the pre-generated set plus follow-ups) + M summarization calls (triggered only when token threshold is exceeded, typically 0–2 per session) + 1 (report generation). For a standard 10-question session with no follow-ups and no summarization this is 12 total API calls. Sessions with follow-ups will have proportionally more calls. |

---

## 7. Technical Architecture

### Full Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js (App Router) | v14+ |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS + ShadCN/UI | ShadCN components used wherever a matching primitive exists |
| Animations | Framer Motion | Page transitions, component animations, interactive state changes |
| AI API | Google Gemini Pro, Groq | Via AI gateway module — provider-agnostic, round-robin per-provider key pool |
| Auth | Supabase Auth | Email+password and Google OAuth via `@supabase/ssr` |
| Database | Supabase (Postgres) | RLS enabled on all tables; pgcrypto for API key encryption |
| File Storage | Supabase Storage | Private `resumes` bucket — user-scoped paths, signed URL access |
| State Management | Zustand | Session state, conversation history, UI state |
| Client Cache | sessionStorage | Question set cached to survive page refresh within session |
| Error Tracking | Sentry (`@sentry/nextjs`) | Unhandled exceptions, API route errors, gateway failures |
| APM | Vercel Analytics | Request latency, error rates, Web Vitals per route/page |
| Uptime Monitoring | Better Stack (BetterUptime) | 1-minute HTTP checks, email alerts on downtime |
| Speech Recognition | Web Speech API | Browser-native, Chromium only |
| Text-to-Speech | SpeechSynthesis API | Browser-native, cross-browser |
| PDF Generation | jsPDF | Client-side, no server required |
| PDF Parsing | pdf.js | Client-side resume PDF text extraction |
| Hosting | Vercel | Auto-deploy from main branch |
| Testing — Unit | Vitest + React Testing Library | Coverage threshold: 80% overall |
| Testing — Property | fast-check | Property-based tests for pure logic modules |
| Testing — E2E | Playwright | Cross-browser E2E flows |
| Testing — Mutation | Stryker | Mutation score target: 70%+ |
| Linting | ESLint | Next.js recommended config + TypeScript rules |
| Formatting | Prettier | Enforced via CI |
| CI/CD | GitHub Actions | Multi-stage pipeline on PRs to main |

### Application Routes

```
Public routes (unauthenticated)
/                     → Landing page
/login                → Login (email+password, Google OAuth)
/signup               → Registration

Protected routes — regular users (valid Supabase session, role = user)
/dashboard            → User dashboard
/setup                → 3-step setup wizard (resume, JD, slider)
/session              → Full session flow (7 internal states)
/reports              → All reports listing (My Reports)
/reports/[sessionId]  → Full report detail page
/profile              → Account settings + saved resume manager

Protected routes — admin only (valid session, role = admin)
/admin                → Admin dashboard home
/admin/users          → User management (view, suspend, delete)
/admin/providers      → AI provider configuration (add/remove providers and keys)
/admin/logs           → AI gateway call logs (provider, latency, tokens, status)
/admin/evals          → Eval system results and historical metrics

Next.js API routes (server-side, session-verified on every request)
/api/generate-questions     → Gateway: question set + opening greeting + closing note
/api/generate-followup      → Gateway: contextual follow-up evaluation
/api/summarize-context      → Gateway: rolling context summarization
/api/generate-report        → Gateway: full performance report generation
/api/judge                  → Gateway: LLM-as-judge eval (async, post-session)
/api/resumes/upload         → Supabase Storage: upload PDF + save to user_resumes
/api/resumes/[id]/download  → Supabase Storage: generate signed download URL
/api/resumes/[id]           → DELETE: remove from Storage + user_resumes

Admin-only API routes (session required + role = admin)
/api/admin/users            → GET (list), PATCH (suspend), DELETE (delete user + data)
/api/admin/providers        → GET, POST, PATCH, DELETE for provider + key management
/api/admin/logs             → GET AI gateway call logs (paginated, filterable)
/api/admin/evals            → GET eval results and historical metrics
```

### System Data Flow

```
[/setup]
  User provides: Resume (PDF parsed by pdf.js OR plain text) + JD text + Mode selection
        │
        ▼ POST /api/generate-questions
  Gemini Pro: Resume + JD + Mode → JSON array of 8–12 questions
        │
        ▼
[/session — Zustand state initialised]
  Session loop:
    For each question:
      1. Zustand: set activeQuestion
      2. SpeechSynthesis API: speak question word by word → simultaneously render in chat UI
      3. Mic activates after TTS complete
      4. Web Speech API: capture audio → render live word-by-word transcript
      5. 2s silence → commit answer to Zustand conversationHistory
      6. POST /api/generate-followup: context payload → follow-up decision
         ├── Follow-up warranted → inject follow-up question, repeat loop
         └── No follow-up → advance to next pre-generated question
         (If token threshold hit before any call → POST /api/summarize-context first)
    After final answer:
      → [State: rating]    Rating screen (1–5 stars + optional text)
        │
        ▼ Supabase: save session_feedback
        ▼ POST /api/generate-report triggered (concurrent with closing note)
      → [State: closing]   AI closing note delivered via TTS
      → [State: report-wait] Wait screen until report API call completes
        │
        ▼ Supabase: save report JSON + update session status
      → [State: complete]  Navigation choice: Go to Dashboard OR View Report

[/reports/[sessionId]]
  Load report from Supabase (RLS enforced)
  Render: score card, role alignment, per-question accordion, transcript
  jsPDF: generate downloadable PDF on demand

[/reports]
  Supabase: fetch all reports for user (RLS enforced)
  Render: report list with scores, labels, star ratings, action buttons

[/dashboard]
  Supabase: fetch user's sessions (RLS enforced)
  Render: session history list + score trend chart + Quick Start CTA
```

### Zustand Store Shape

```typescript
type SessionState =
  | 'idle'
  | 'loading'        // witty phrases — API call in flight
  | 'mic-permission' // waiting for mic permission grant/denial
  | 'countdown'      // 5-second countdown
  | 'active'         // live interview chat
  | 'rating'         // star rating screen
  | 'closing'        // AI closing note TTS delivery
  | 'report-wait'    // waiting for report generation
  | 'complete';      // navigation choice screen

interface SessionStore {
  // Setup inputs
  resumeText: string;
  jdText: string;
  sliderValue: number;           // 1–10, maps to Technical/Behavioral ratio
  selectedResumeId: string | null;

  // Session state machine
  sessionPhase: SessionState;

  // Generated content (from question generation API call)
  questions: Question[];
  openingGreeting: string;
  closingNote: string;

  // Active question tracking
  currentQuestionIndex: number;          // index into pre-generated questions array
  activeQuestion: Question | null;
  consecutiveFollowUpCount: number;      // resets to 0 on each new pre-generated question; max 2

  // Conversation
  conversationHistory: ConversationTurn[];  // full history for display in chat UI

  // Context payload (sent to AI on each call)
  contextPayload: {
    conversationSummary: string;  // empty string until first summarization
    lastQuestion: string;
    lastAnswer: string;
  };

  // Session metadata
  sessionId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
  micPermissionGranted: boolean;

  // Speech state
  isSpeaking: boolean;
  isListening: boolean;
  liveTranscript: string;

  // Post-session
  report: PerformanceReport | null;
  rating: number | null;
  feedbackText: string;

  // Actions
  setResumeText: (text: string) => void;
  setJDText: (text: string) => void;
  setSliderValue: (value: number) => void;
  setSessionPhase: (phase: SessionState) => void;
  setGeneratedContent: (questions: Question[], greeting: string, closing: string) => void;
  addAnswer: (answer: string) => void;
  updateContextPayload: (payload: ContextPayload) => void;
  setReport: (report: PerformanceReport) => void;
  resetSession: () => void;
}
```

---

## 8. Middleware & Route Protection

### Overview

MIRA uses a single `middleware.ts` file at the root of the Next.js project. It runs at the **Next.js Edge Runtime** on every incoming request before any page or API route handler executes. This is the only place where session validation and route-level redirects are enforced — individual pages do not implement their own auth checks for navigation guard purposes.

The middleware uses `@supabase/ssr` to read and validate the Supabase session from the request cookies. Because it runs at the edge, no database query is made — the session JWT is verified cryptographically using the Supabase JWT secret.

---

### Route Classification

| Classification | Routes |
|---|---|
| **Public** — accessible without a session | `/`, `/login`, `/signup` |
| **Auth-only** — redirect logged-in users away | `/login`, `/signup` |
| **Protected — regular user** | `/dashboard`, `/setup`, `/session`, `/reports`, `/reports/[sessionId]`, `/profile` |
| **Protected — admin only** | `/admin`, `/admin/users`, `/admin/providers`, `/admin/logs`, `/admin/evals` |
| **API — session required** | `/api/generate-questions`, `/api/generate-followup`, `/api/summarize-context`, `/api/generate-report`, `/api/judge`, `/api/resumes/upload`, `/api/resumes/[id]/download`, `/api/resumes/[id]` |
| **API — admin session required** | `/api/admin/users`, `/api/admin/providers`, `/api/admin/logs`, `/api/admin/evals` |
| **Excluded from middleware** | `/_next/static/*`, `/_next/image/*`, `/favicon.ico`, all static assets |

---

### Middleware Behavior — Decision Table

| Scenario | Middleware Action |
|---|---|
| Unauthenticated user requests a **protected page** | Redirect to `/login?returnTo={originalPath}` |
| Unauthenticated user requests a **public page** | Allow — no action |
| Authenticated user requests `/login` or `/signup` | Redirect to `/dashboard` |
| Authenticated user requests a **protected page** | Allow — no action |
| Unauthenticated user calls a **protected API route** | Return `401 Unauthorized` JSON response — no redirect |
| Authenticated user calls a **protected API route** | Allow — request proceeds to route handler |
| Any request to a **static asset path** | Skip middleware entirely — no session check performed |

---

### Session Cookie Refresh

Supabase sessions use short-lived access tokens (default 1 hour) with a longer-lived refresh token. The middleware is responsible for refreshing the session silently when the access token has expired but the refresh token is still valid. This is handled by calling `supabase.auth.getSession()` within the middleware, which automatically attempts a token refresh and writes the new access token back to the response cookies. The user never experiences an interruption during a valid but expired-access-token session.

If both the access token and refresh token are expired or invalid, `getSession()` returns null and the middleware treats the request as unauthenticated, applying the redirect rules above.

---

### The `returnTo` Parameter

When an unauthenticated user is redirected to `/login`, the middleware appends the original requested path as a `returnTo` query parameter:

```
/login?returnTo=/report/abc-123
```

After successful login, the `/login` page reads this parameter and redirects the user to the originally requested path instead of the default `/dashboard`. This handles the common scenario where a user follows a bookmarked report link while logged out.

---

### API Route Auth Enforcement

The middleware returns a `401` for unauthenticated API route requests at the edge, before the route handler is reached. However, each API route handler also independently verifies the session as a defense-in-depth measure:

```
Request to /api/generate-questions
  │
  ▼ middleware.ts (edge)
  Session valid? → No → Return 401 immediately
  Session valid? → Yes → Forward to route handler
  │
  ▼ /api/generate-questions/route.ts
  Re-verify session server-side via supabase.auth.getUser()
  Invalid → Return 401
  Valid → Proceed to Gemini call
```

This double-verification ensures that even if middleware is misconfigured or bypassed, the route handler itself never processes an unauthenticated request.

---

### Middleware Matcher Configuration

The middleware runs only on routes that require it, using Next.js matcher config to exclude static files and improve performance:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

### `middleware.ts` Responsibility Summary

The middleware file has exactly three responsibilities and no others:

1. **Session validation** — read and verify the Supabase session from request cookies, refresh the token if needed
2. **Route protection** — redirect unauthenticated users away from protected pages; redirect authenticated users away from auth pages
3. **API guard** — return 401 for unauthenticated requests to API routes

It does not handle: logging, rate limiting, feature flags, A/B testing, or any business logic. Those concerns belong in route handlers or server components.

---

## 9. Project Structure

MIRA follows the Next.js 14 App Router convention with a strict modular folder structure. Every concern — UI, business logic, data access, utilities, types, tests — lives in a named, purpose-specific directory. No logic is written directly inside page or layout files; pages are thin composition layers that import from the appropriate module.

```
mira/
├── app/                              # Next.js App Router — pages and layouts only
│   ├── (auth)/                       # Route group — auth pages share no layout with app
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (app)/                        # Route group — all protected user pages
│   │   ├── layout.tsx                # Shared app shell: top nav, session guard
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── setup/
│   │   │   └── page.tsx
│   │   ├── session/
│   │   │   └── page.tsx              # Single page managing all 7 session states
│   │   ├── reports/
│   │   │   ├── page.tsx              # /reports — all reports listing
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx          # /reports/[sessionId] — full report detail
│   │   └── profile/
│   │       └── page.tsx
│   ├── (admin)/                      # Route group — admin-only pages
│   │   ├── layout.tsx                # Admin shell: admin nav, role guard
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin dashboard home
│   │   ├── admin/users/
│   │   │   └── page.tsx              # User management
│   │   ├── admin/providers/
│   │   │   └── page.tsx              # AI provider + key configuration
│   │   ├── admin/logs/
│   │   │   └── page.tsx              # AI gateway call logs
│   │   └── admin/evals/
│   │       └── page.tsx              # Eval results + historical metrics
│   ├── api/                          # Next.js API routes — server-side only
│   │   ├── generate-questions/
│   │   │   └── route.ts              # → gateway.call('question-generation', ...)
│   │   ├── generate-followup/
│   │   │   └── route.ts              # → gateway.call('follow-up', ...)
│   │   ├── summarize-context/
│   │   │   └── route.ts              # → gateway.call('summarize-context', ...)
│   │   ├── generate-report/
│   │   │   └── route.ts              # → gateway.call('report', ...)
│   │   ├── judge/
│   │   │   └── route.ts              # → gateway.call('judge', ...) — async post-session
│   │   ├── resumes/
│   │   │   ├── upload/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts          # DELETE
│   │   │       └── download/
│   │   │           └── route.ts
│   │   └── admin/                    # Admin-only API routes (role check in middleware)
│   │       ├── users/
│   │       │   └── route.ts          # GET (list), PATCH (suspend), DELETE (delete + data)
│   │       ├── providers/
│   │       │   └── route.ts          # CRUD for ai_providers + ai_provider_keys
│   │       ├── logs/
│   │       │   └── route.ts          # GET ai_call_logs (paginated, filterable)
│   │       └── evals/
│   │           └── route.ts          # GET eval_results + aggregated metrics
│   ├── layout.tsx                    # Root layout — fonts, global providers
│   ├── page.tsx                      # Landing page (public)
│   └── globals.css
│
├── components/                       # All React UI components
│   ├── ui/                           # ShadCN auto-generated primitives (DO NOT edit)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── auth/                         # Auth-specific components
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── GoogleOAuthButton.tsx
│   ├── setup/                        # Session setup wizard components
│   │   ├── SetupWizard.tsx
│   │   ├── ResumeTabSaved.tsx
│   │   ├── ResumeTabUpload.tsx
│   │   ├── ResumeTabPaste.tsx
│   │   ├── JDInput.tsx
│   │   ├── ModeSelector.tsx
│   │   └── SetupConfirmation.tsx
│   ├── session/                      # All 7 session state components
│   │   ├── SessionShell.tsx          # State machine orchestrator — renders correct state
│   │   ├── WittyPhrasesScreen.tsx    # State 1: rotating phrases during API call
│   │   ├── MicPermissionScreen.tsx   # State 2: microphone permission request
│   │   ├── CountdownScreen.tsx       # State 3: 5→1 animated countdown
│   │   ├── ChatBubble.tsx            # State 4: individual chat message bubble
│   │   ├── MicButton.tsx             # State 4: mic button with idle/listening/processing states
│   │   ├── LiveTranscript.tsx        # State 4: live word-by-word interim transcript
│   │   ├── SessionHeader.tsx         # State 4: timer + question counter persistent bar
│   │   ├── EndEarlyModal.tsx         # State 4: confirmation modal for early exit
│   │   ├── TextFallbackInput.tsx     # State 4: text input when mic unavailable
│   │   ├── RatingScreen.tsx          # State 5: star rating + optional feedback
│   │   ├── ClosingNoteScreen.tsx     # State 6: AI closing note TTS delivery
│   │   ├── ReportWaitScreen.tsx      # State 7a: animated wait while report generates
│   │   └── CompletionScreen.tsx      # State 7b: dashboard / view report navigation choice
│   ├── report/                       # Report detail page components
│   │   ├── ReportHeader.tsx
│   │   ├── OverallScoreCard.tsx
│   │   ├── RoleAlignmentSummary.tsx
│   │   ├── StrengthsImprovements.tsx
│   │   ├── AnswerBreakdownCard.tsx
│   │   ├── DimensionScoreRow.tsx
│   │   ├── TranscriptViewer.tsx
│   │   └── DownloadPDFButton.tsx
│   ├── admin/                        # Admin dashboard components
│   │   ├── UserTable.tsx             # Paginated user list with suspend/delete actions
│   │   ├── SuspendUserDialog.tsx     # Confirmation dialog for account suspension
│   │   ├── DeleteUserDialog.tsx      # Confirmation dialog for permanent deletion
│   │   ├── ProviderList.tsx          # AI provider cards with active badge
│   │   ├── AddProviderForm.tsx       # Form to add a new provider
│   │   ├── KeyPoolManager.tsx        # Add/remove/disable keys within a provider
│   │   ├── CallLogTable.tsx          # Paginated, filterable gateway call log
│   │   ├── EvalMetricsCharts.tsx     # Line charts per dimension + overall trend
│   │   └── EvalResultsTable.tsx      # Most recent 20 eval results table
│   ├── dashboard/                    # Dashboard components
│   │   ├── SessionCard.tsx
│   │   ├── ScoreTrendChart.tsx
│   │   ├── EmptySessionState.tsx
│   │   └── QuickStartBanner.tsx
│   ├── profile/                      # Profile page components
│   │   ├── ResumeList.tsx
│   │   ├── ResumeListItem.tsx
│   │   ├── ResumeUploadZone.tsx
│   │   ├── DeleteResumeDialog.tsx
│   │   └── DisplayNameEditor.tsx
│   └── shared/                       # Reusable cross-feature components
│       ├── NavBar.tsx                # Top nav: logo, New Interview button, avatar dropdown
│       ├── AvatarDropdown.tsx        # Avatar + DropdownMenu: My Resumes, Profile, Sign Out
│       ├── MobileNavDrawer.tsx       # Sheet-based mobile navigation drawer
│       ├── PageTransition.tsx        # Framer Motion AnimatePresence wrapper for route transitions
│       ├── LoadingOverlay.tsx
│       ├── ErrorCard.tsx
│       ├── ToastProvider.tsx         # Mounts Sonner Toaster in root layout
│       ├── Toast.ts                  # toast() utility: success, error, warning, info variants
│       └── BrowserCompatibilityBanner.tsx
│
├── lib/                              # Pure business logic — no React, no UI
│   ├── gateway/                      # AI API gateway — provider-agnostic call routing
│   │   ├── index.ts                  # gatewayCall(callType, prompt, options) — main entry point
│   │   ├── router.ts                 # Active provider selection, round-robin key rotation, fallback logic
│   │   ├── logger.ts                 # Writes ai_call_logs entries after every call
│   │   ├── adapters/
│   │   │   ├── gemini.ts             # Gemini request formatter + response normaliser
│   │   │   └── groq.ts               # Groq request formatter + response normaliser
│   │   └── prompts.ts                # All system and user prompt templates (provider-agnostic)
│   ├── eval/
│   │   ├── runEval.ts                # Orchestrates the LLM-as-judge call and stores result
│   │   └── evalSchema.ts             # Zod schema for judge response validation
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client (@supabase/ssr)
│   │   ├── server.ts                 # Server Supabase client (API routes + Server Components)
│   │   ├── middleware.ts             # Session refresh helper for middleware.ts
│   │   ├── sessions.ts               # DB queries: create, update, fetch sessions
│   │   ├── transcripts.ts            # DB queries: save and fetch transcript turns
│   │   ├── reports.ts                # DB queries: save and fetch reports
│   │   ├── feedback.ts               # DB queries: save session feedback
│   │   ├── resumes.ts                # DB queries: CRUD for user_resumes
│   │   ├── profiles.ts               # DB queries: get and update profiles (incl. role, is_suspended)
│   │   ├── providers.ts              # DB queries: CRUD for ai_providers + ai_provider_keys
│   │   ├── callLogs.ts               # DB queries: insert and fetch ai_call_logs
│   │   └── evalResults.ts            # DB queries: insert and fetch eval_results
│   ├── speech/
│   │   ├── ttsWrapper.ts             # SpeechSynthesis API abstraction + word boundary events
│   │   ├── speechRecognition.ts      # Web Speech API abstraction + silence detection
│   │   └── browserSupport.ts         # Detects TTS and STT browser support
│   ├── pdf/
│   │   ├── parseResume.ts            # pdf.js resume text extraction
│   │   └── generateReport.ts         # jsPDF report + transcript PDF generation
│   ├── scoring.ts                    # Score averaging, label mapping (1–5 → Excellent/Poor)
│   ├── tokenCounter.ts               # Character-based token estimation
│   ├── questionDedup.ts              # Question deduplication logic
│   └── silenceDetector.ts            # 2-second silence threshold state machine
│
├── store/                            # Zustand state
│   ├── sessionStore.ts               # Main session store: questions, transcript, speech state
│   └── uiStore.ts                    # Global UI state: toasts, loading flags
│
├── hooks/                            # Custom React hooks
│   ├── useSession.ts                 # Session lifecycle: start, end, question advance
│   ├── useTTS.ts                     # TTS hook: speak, word events, completion
│   ├── useSpeechRecognition.ts       # STT hook: start, interim results, silence commit
│   ├── useResumeUpload.ts            # Resume upload + pdf.js parse orchestration
│   ├── useSessionTimer.ts            # Elapsed time counter (setInterval)
│   ├── useReducedMotion.ts           # Wraps Framer Motion useReducedMotion for global access
│   └── useAvatarDropdown.ts          # Avatar menu open/close state and navigation handlers
│
├── types/                            # TypeScript type definitions — shared across app
│   ├── session.ts                    # Session, Question, ConversationTurn, ContextPayload, SliderValue, SessionState
│   ├── report.ts                     # PerformanceReport, AnswerEvaluation, DimensionScore
│   ├── resume.ts                     # UserResume, ResumeSource
│   ├── auth.ts                       # UserProfile (includes role: 'user' | 'admin', is_suspended)
│   ├── gateway.ts                    # GatewayCallType, GatewayRequest, GatewayResponse, ProviderAdapter
│   ├── eval.ts                       # EvalResult, EvalDimension, EvalMetrics
│   ├── admin.ts                      # AdminUser, AIProvider, AIProviderKey, CallLog
│   └── api.ts                        # API request/response shapes
│
├── schemas/                          # Zod validation schemas
│   ├── questionSchema.ts             # Validates Gemini question generation response
│   ├── followupSchema.ts             # Validates Gemini follow-up response
│   ├── reportSchema.ts               # Validates Gemini report response
│   └── resumeSchema.ts               # Validates resume upload API request
│
├── utils/                            # Stateless utility functions
│   ├── formatters.ts                 # Date formatting, score formatting, truncation
│   ├── constants.ts                  # App-wide constants: limits, thresholds, labels
│   ├── animations.ts                 # Shared Framer Motion variants: pageTransition, fadeIn, staggerContainer, chatBubble
│   └── errors.ts                     # Typed error classes for API and app errors
│
├── e2e/                              # Playwright end-to-end tests
│   ├── fixtures/
│   │   ├── auth.ts                   # Logged-in user fixture (bypasses UI login)
│   │   ├── adminAuth.ts              # Logged-in admin fixture (role = admin)
│   │   ├── speechMock.ts             # Stubs Web Speech API and SpeechSynthesis
│   │   └── gatewayMock.ts            # Intercepts all /api/* AI gateway routes
│   ├── auth.spec.ts
│   ├── setup.spec.ts
│   ├── session.spec.ts
│   ├── report.spec.ts
│   ├── dashboard.spec.ts
│   ├── profile.spec.ts
│   ├── middleware.spec.ts
│   ├── admin.spec.ts                 # Admin dashboard: user CRUD, provider config, logs, evals
│   └── gateway.spec.ts               # Gateway: round-robin, provider fallback, error handling
│
├── middleware.ts                     # Next.js edge middleware — route protection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── stryker.config.ts
├── .eslintrc.json
├── .prettierrc
├── .env.local                        # Never committed — gitignored
└── .env.example                      # Committed — documents required env vars
```

### Structural Principles

Every file has exactly one reason to exist. Pages import components; components use hooks; hooks call lib functions; lib functions call external services. This one-way dependency chain means any layer can be unit tested in isolation by mocking the layer below it.

The `lib/supabase/` directory is split into one file per domain entity (`sessions.ts`, `resumes.ts`, etc.) rather than one monolithic database file. Each file exports typed async functions that encapsulate the Supabase query and return typed results or throw typed errors. API routes import from these functions — they never write inline Supabase queries.

The `types/` directory is the single source of truth for all TypeScript interfaces. No inline type definitions in component or lib files. If a type is used in more than one place, it lives in `types/`.

The `schemas/` directory isolates all Zod validation. Gemini API responses are unpredictable — every response is validated against a strict Zod schema before any downstream code consumes it. Parse failures trigger a structured retry, not a crash.

Property-based tests using `fast-check` co-locate with their source file (`scoring.test.ts` alongside `scoring.ts`). They are not in a separate directory. The distinction between example-based and property-based tests is in the test body (using `fc.property()`) not the file location.

Framer Motion animation variants are co-located with the component that uses them, defined as `const variants = { ... }` constants at the top of the component file. Shared animation presets (page transition, fade-in, stagger container) are defined in `utils/animations.ts` and imported by individual components.

All test files (`.test.ts`, `.spec.ts`) co-locate with their source file except E2E tests, which live in `e2e/`. Unit test files follow the naming convention `filename.test.ts` alongside the source `filename.ts`.

---

## 10. Database Architecture

### Overview

MIRA uses Supabase Postgres as its primary database. The schema has two logical domains: the user domain (`profiles`, `user_resumes`) and the session domain (`sessions`, `transcripts`, `reports`, `session_feedback`). Three additional tables support the infrastructure layer: `ai_providers` and `ai_call_logs` for the gateway, and `eval_results` for the LLM-as-judge system.

All tables have Row Level Security enabled. Regular users can only access their own rows. Admin-only tables enforce role-based access — only users with `role = admin` in `profiles` can read them.

---

### Entity Relationship Overview

```
auth.users (Supabase managed)
    │
    │ 1:1
    ▼
profiles (role: user | admin)
    │
    │ 1:many
    ▼
user_resumes ◄──────────────────────────────┐
                                             │ optional FK
    │                                        │
    │ 1:many                                 │
    ▼                                        │
sessions ────────────────────────────────────┘
    │
    ├──── 1:many ──► transcripts
    │
    ├──── 1:1 ──────► reports
    │
    ├──── 1:1 ──────► session_feedback
    │
    └──── 1:1 ──────► eval_results  (anonymised — no user_id stored)

ai_providers  (admin-managed, no FK to users)
    │
    │ 1:many
    ▼
ai_call_logs  (gateway audit log — provider + call metadata)
```

`eval_results` links to `sessions` by session ID for internal correlation but stores no `user_id` — it is intentionally anonymised so the admin who views eval metrics cannot correlate results to individual users.

---

### Table Definitions

#### `profiles`

Extends the Supabase `auth.users` record with application-level user data. Created automatically via a database trigger on every new `auth.users` insert.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, FK → auth.users(id) | Matches the Supabase Auth user ID exactly. Used as the foreign key anchor for all other user-owned tables. |
| `email` | text | NOT NULL | Copied from `auth.users` at creation. Display only — auth managed by Supabase. |
| `full_name` | text | nullable | User-editable display name. |
| `role` | text | NOT NULL, DEFAULT 'user', CHECK IN ('user', 'admin') | User role. `user` for regular candidates. `admin` for team members with admin dashboard access. Set to `admin` via direct SQL for v1. |
| `is_suspended` | boolean | NOT NULL, DEFAULT false | Set to true by admin to block login. Checked by middleware on every authenticated request. |
| `created_at` | timestamptz | DEFAULT now() | Account creation timestamp. |

**Associations:** One `profiles` row per `auth.users` row (1:1). Parent of `user_resumes` (1:many) and `sessions` (1:many).

---

#### `user_resumes`

Stores metadata and extracted text for each resume PDF a user saves to their profile. The actual PDF file is stored in Supabase Storage — this table holds the reference path and the pre-parsed text.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique resume record identifier. |
| `user_id` | uuid | NOT NULL, FK → profiles(id) | Owner of this resume. RLS enforced on this column. |
| `file_name` | text | NOT NULL | The original filename as uploaded (e.g. `Aditya_Resume_2026.pdf`). Displayed in the UI. |
| `storage_path` | text | NOT NULL | Full path within the `resumes` Supabase Storage bucket: `{userId}/{timestamp}_{filename}.pdf`. Used by the download API to generate a signed URL. |
| `extracted_text` | text | NOT NULL | Plain text content extracted from the PDF client-side by pdf.js at upload time. This is what gets passed to the AI — never the binary PDF itself. Stored here so re-selection in setup is instant with no re-parsing. |
| `is_default` | boolean | DEFAULT false | Marks this resume as the user's default. At most one row per `user_id` may have this set to true. Enforced by the `unset_previous_default` trigger. |
| `uploaded_at` | timestamptz | DEFAULT now() | Upload timestamp displayed in the profile resume list. |

**Associations:** Belongs to one `profiles` (many:1). Optionally referenced by `sessions` via `resume_id` (1:many optional). A user may have up to 10 rows (enforced at application layer).

**Trigger:** `enforce_single_default` — fires `BEFORE INSERT OR UPDATE`. When a row is set to `is_default = true`, all other rows for the same `user_id` are set to `is_default = false` in the same transaction.

---

#### `sessions`

The central table of the schema. Represents one complete interview session from setup through completion. Every piece of session data — the resume used, the JD, the mode, the duration, and the final score — is captured here.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique session identifier. Used as the dynamic route parameter in `/reports/[sessionId]`. |
| `user_id` | uuid | NOT NULL, FK → profiles(id) | Owner of the session. RLS enforced on this column. |
| `resume_id` | uuid | nullable, FK → user_resumes(id) | Optional back-reference to the saved resume used. NULL if the user uploaded a new resume without saving, or pasted text. |
| `created_at` | timestamptz | DEFAULT now() | Session creation time — when the user confirmed setup and the question generation API was called. |
| `completed_at` | timestamptz | nullable | Set when `status` transitions to `completed` or `abandoned`. NULL while in progress. |
| `duration_secs` | integer | nullable | Elapsed session time in seconds. Computed from `completed_at - created_at` and stored for display on the report and dashboard. |
| `slider_value` | smallint | NOT NULL, CHECK (BETWEEN 1 AND 10) | The Technical/Behavioral ratio selected on the slider. 1 = 100% technical, 5 = 50/50, 10 = 100% behavioral. Stored for display on dashboard cards, report headers, and PDF cover. |
| `jd_text` | text | NOT NULL | Full job description text as entered by the user. Passed to the AI on every API call and stored for re-generating reports from the dashboard. |
| `resume_text` | text | NOT NULL | Full extracted resume text used in this session. Always stored here directly regardless of source (saved resume, new upload, or paste) so the session is self-contained. |
| `jd_role_title` | text | nullable | Role title extracted from the JD text (e.g. "Senior Product Manager"). Populated by a lightweight extraction at session creation. Displayed on dashboard cards and the report header. |
| `status` | text | DEFAULT 'in_progress' | Session lifecycle state. Values: `in_progress` (active session), `completed` (all questions answered, report generated), `abandoned` (user ended early or navigated away). |
| `overall_score` | numeric(3,2) | nullable | Final aggregated score (1.00–5.00). Computed as the average of all per-answer `numericScore` values in the report. Populated when the report is saved. Denormalised here for fast dashboard queries without joining `reports`. |

**Associations:** Belongs to one `profiles` (many:1). Optionally belongs to one `user_resumes` (many:1). Parent of `transcripts` (1:many), `reports` (1:1), and `session_feedback` (1:1).

---

#### `transcripts`

Stores the full conversation as an ordered sequence of turns. Each row is one message — either an AI question or a candidate answer. The complete interview conversation is reconstructable by querying all rows for a session ordered by `turn_index`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique turn identifier. |
| `session_id` | uuid | NOT NULL, FK → sessions(id) | The session this turn belongs to. |
| `turn_index` | integer | NOT NULL | Zero-based sequential position of this turn in the conversation. Used for ordering. Unique within a session. |
| `speaker` | text | NOT NULL | Either `'interviewer'` (AI question) or `'candidate'` (user answer). Determines chat bubble alignment in the UI. |
| `content` | text | NOT NULL | The full text of this turn — the question text for interviewer turns, the committed transcription for candidate turns. |
| `question_id` | text | nullable | The `id` field from the generated question JSON. Links interviewer turns to the original question object for per-answer report alignment. NULL for candidate turns. |
| `created_at` | timestamptz | DEFAULT now() | Timestamp of this turn. Informational only — ordering is by `turn_index`. |

**Associations:** Belongs to one `sessions` (many:1). No child tables.

**Query pattern:** `SELECT * FROM transcripts WHERE session_id = $1 ORDER BY turn_index ASC` — the standard query for reconstructing the full interview for the report page and PDF.

---

#### `reports`

Stores the complete AI-generated performance evaluation for a session. One report per session, created after the final answer is submitted and the rating screen is completed. The full structured JSON from Gemini is stored in `report_json` as JSONB, with the most frequently accessed top-level fields denormalised into typed columns for query efficiency.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique report identifier. |
| `session_id` | uuid | NOT NULL, FK → sessions(id), UNIQUE | One report per session. The UNIQUE constraint prevents duplicate report generation. |
| `overall_score` | numeric(3,2) | NOT NULL | Average of all per-answer numeric scores (1.00–5.00). Denormalised from `report_json` for fast access. Also written back to `sessions.overall_score`. |
| `top_strengths` | text[] | NOT NULL | Array of 3 strength strings extracted from the Gemini response. Displayed in the report summary section. |
| `top_improvements` | text[] | NOT NULL | Array of 3 improvement area strings. Displayed alongside `top_strengths`. |
| `role_alignment_summary` | text | NOT NULL | The full paragraph from Gemini evaluating how the candidate's answers map to the specific JD requirements. The most JD-specific section of the report. |
| `report_json` | jsonb | NOT NULL | The complete structured report from Gemini. Contains the full per-answer breakdown: `questionId`, `numericScore`, `qualitativeLabel`, `dimensionScores` (6 dimensions), and `feedbackText` per answer. Queried by the report page and PDF generator. |
| `created_at` | timestamptz | DEFAULT now() | Report generation timestamp. |

**Associations:** Belongs to one `sessions` (1:1). No child tables.

**Query pattern for report page:** `SELECT * FROM reports WHERE session_id = $1 LIMIT 1` — returns the full report including `report_json` which is then parsed into the typed `PerformanceReport` interface client-side.

---

#### `session_feedback`

Stores the post-session star rating and optional written feedback submitted by the user on the rating screen. One row per session. The data is captured for future prompt refinement analysis but is not consumed by any v1 feature.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique feedback record identifier. |
| `session_id` | uuid | NOT NULL, FK → sessions(id), UNIQUE | Links to the session being rated. UNIQUE ensures one rating per session. |
| `user_id` | uuid | NOT NULL, FK → profiles(id) | Redundant with `sessions.user_id` but stored here to allow direct RLS on this table without joining sessions. |
| `star_rating` | smallint | NOT NULL, CHECK (BETWEEN 1 AND 5) | The 1–5 star rating submitted by the user. The check constraint is enforced at the database level. |
| `feedback_text` | text | nullable | Optional written feedback. Max 500 characters enforced at the application layer. Raw text stored without sanitisation — never rendered as HTML. |
| `created_at` | timestamptz | DEFAULT now() | Rating submission timestamp. |

**Associations:** Belongs to one `sessions` (1:1). Belongs to one `profiles` (many:1).

---

#### `ai_providers`

Stores configuration for each AI provider registered by the admin. Each provider has its own key pool. No foreign key to `profiles` — this is infrastructure configuration, not user data.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique provider record identifier. |
| `name` | text | NOT NULL, UNIQUE | Provider identifier (e.g. `gemini`, `groq`). Used by the gateway to select the correct adapter. |
| `display_name` | text | NOT NULL | Human-readable label shown in the admin dashboard (e.g. "Google Gemini Pro", "Groq LLaMA"). |
| `is_active` | boolean | NOT NULL, DEFAULT false | Exactly one provider may have `is_active = true` at any time. Enforced by a database trigger. The gateway routes all calls to the active provider. |
| `created_at` | timestamptz | DEFAULT now() | Timestamp when the provider was first configured. |

**Associations:** Parent of `ai_provider_keys` (1:many) and `ai_call_logs` (1:many).

**Trigger:** `enforce_single_active_provider` — fires `BEFORE INSERT OR UPDATE`. When a row is set to `is_active = true`, all other rows are set to `is_active = false` in the same transaction.

---

#### `ai_provider_keys`

Stores individual API keys for each provider. Keys are encrypted at rest using pgcrypto. Multiple keys per provider enable the round-robin rotation strategy.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique key record identifier. |
| `provider_id` | uuid | NOT NULL, FK → ai_providers(id) | The provider this key belongs to. |
| `key_value_encrypted` | bytea | NOT NULL | The API key encrypted using `pgp_sym_encrypt` from pgcrypto. Never returned in any API response after storage. |
| `key_index` | integer | NOT NULL | Zero-based position within this provider's key pool. Used for round-robin selection. Unique within a provider. |
| `label` | text | nullable | Optional admin-provided label to distinguish keys (e.g. "Primary key", "Backup key"). |
| `is_active` | boolean | NOT NULL, DEFAULT true | Allows disabling a specific key without deleting it. |
| `created_at` | timestamptz | DEFAULT now() | Key registration timestamp. |

**Associations:** Belongs to one `ai_providers` (many:1).

---

#### `ai_call_logs`

Records every AI call made through the gateway. Used for admin observability. Stores metadata only — never stores prompt content or response content.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique log entry identifier. |
| `provider_id` | uuid | NOT NULL, FK → ai_providers(id) | The provider that handled this call. |
| `key_index` | integer | NOT NULL | The index of the key used within the provider's pool. The actual key value is never stored here. |
| `call_type` | text | NOT NULL | One of: `question-generation`, `follow-up`, `summarize-context`, `report`, `judge`. |
| `latency_ms` | integer | NOT NULL | Time in milliseconds from gateway call to provider response. |
| `estimated_tokens` | integer | nullable | Character-based token estimate for the prompt sent. |
| `http_status` | smallint | NOT NULL | HTTP status code returned by the provider (200, 429, 503, etc.). |
| `error_message` | text | nullable | Provider error message if http_status is not 2xx. Truncated to 500 chars. |
| `created_at` | timestamptz | DEFAULT now() | Timestamp of the call. |

**Associations:** Belongs to one `ai_providers` (many:1). Not linked to sessions or users — gateway calls are infrastructure events, not user data.

**RLS:** SELECT restricted to `role = admin`. No INSERT from client — written exclusively by the gateway module server-side using the service role key.

---

#### `eval_results`

Stores the LLM-as-judge evaluation output for each session. Intentionally anonymised — `user_id` is not stored. The `session_id` is stored for internal correlation but is not exposed in the admin eval metrics view.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique eval record identifier. |
| `session_id` | uuid | NOT NULL, FK → sessions(id), UNIQUE | Internal reference to the session that was evaluated. Not displayed in the admin metrics view. |
| `overall_eval_score` | numeric(3,2) | NOT NULL | Average of all five dimension scores (1.00–5.00). |
| `question_quality_score` | smallint | NOT NULL | Score 1–5: specificity and JD/resume relevance of the generated questions. |
| `question_quality_rationale` | text | NOT NULL | 1–3 sentence explanation from the judge. |
| `calibration_score` | smallint | NOT NULL | Score 1–5: how accurately the question set reflects the slider ratio. |
| `calibration_rationale` | text | NOT NULL | 1–3 sentence explanation. |
| `followup_score` | smallint | NOT NULL | Score 1–5: appropriateness of follow-up injection decisions. NULL if no follow-ups occurred. |
| `followup_rationale` | text | nullable | 1–3 sentence explanation. NULL if no follow-ups occurred. |
| `report_accuracy_score` | smallint | NOT NULL | Score 1–5: whether the performance report fairly reflects the session quality. |
| `report_accuracy_rationale` | text | NOT NULL | 1–3 sentence explanation. |
| `tone_score` | smallint | NOT NULL | Score 1–5: naturalness and professionalism of AI-generated language. |
| `tone_rationale` | text | NOT NULL | 1–3 sentence explanation. |
| `provider_used` | text | NOT NULL | Name of the provider used for the judge call (e.g. `gemini`). |
| `created_at` | timestamptz | DEFAULT now() | Timestamp when the eval ran. |

**Associations:** Belongs to one `sessions` (1:1). No direct link to `profiles` — anonymised by design.

**RLS:** SELECT restricted to `role = admin`. INSERT by server-side API route only.

---

### Table Relationship Summary

| Relationship | Type | FK Column | Notes |
|---|---|---|---|
| `auth.users` → `profiles` | 1:1 | `profiles.id` | Auto-created via trigger on auth signup |
| `profiles` → `user_resumes` | 1:many | `user_resumes.user_id` | Up to 10 resumes per user |
| `profiles` → `sessions` | 1:many | `sessions.user_id` | Unlimited sessions per user |
| `user_resumes` → `sessions` | 1:many (optional) | `sessions.resume_id` | NULL if resume not saved to profile |
| `sessions` → `transcripts` | 1:many | `transcripts.session_id` | Ordered by `turn_index` |
| `sessions` → `reports` | 1:1 | `reports.session_id` | UNIQUE constraint enforced |
| `sessions` → `session_feedback` | 1:1 | `session_feedback.session_id` | UNIQUE constraint enforced |
| `sessions` → `eval_results` | 1:1 | `eval_results.session_id` | UNIQUE — one eval per session; anonymised (no user_id) |
| `profiles` → `session_feedback` | 1:many | `session_feedback.user_id` | Enables direct RLS without join |
| `ai_providers` → `ai_provider_keys` | 1:many | `ai_provider_keys.provider_id` | Multiple keys per provider for round-robin |
| `ai_providers` → `ai_call_logs` | 1:many | `ai_call_logs.provider_id` | Gateway audit trail per provider |

---

### Denormalisation Decisions

Two fields are intentionally denormalised for performance:

`sessions.overall_score` duplicates `reports.overall_score`. This allows the dashboard session list query to return all session cards with scores in a single `SELECT * FROM sessions WHERE user_id = $1` query — no join to `reports` needed.

`session_feedback.user_id` duplicates `sessions.user_id`. This allows RLS on `session_feedback` to be enforced using `auth.uid() = user_id` directly, without a join through `sessions`.

---

### Row Level Security Policy Summary

| Table | Access | Condition |
|---|---|---|
| `profiles` | User: all operations | `auth.uid() = id` |
| `profiles` | Admin: all operations | `auth.uid() = id` OR `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'` |
| `user_resumes` | User: all operations | `auth.uid() = user_id` |
| `sessions` | User: all operations | `auth.uid() = user_id` |
| `transcripts` | User: all operations | `auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id)` |
| `reports` | User: all operations | `auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id)` |
| `session_feedback` | User: all operations | `auth.uid() = user_id` |
| `eval_results` | Admin SELECT only | `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'` |
| `ai_providers` | Admin: all operations | `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'` |
| `ai_provider_keys` | Admin: all operations | `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'` |
| `ai_call_logs` | Admin SELECT only | `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'` |
| Storage `resumes` bucket | User: INSERT / SELECT / DELETE | `(storage.foldername(name))[1] = auth.uid()::text` |

---

## 11. UX & Design Considerations

### Design System

The design system is built on ShadCN/UI components styled with Tailwind CSS utility classes, animated with Framer Motion, and extended with custom components where ShadCN has no matching primitive. All custom components follow the same design token conventions as ShadCN.

#### ShadCN/UI Components Used

The following ShadCN components are used across the application. All are installed via the ShadCN CLI and placed in `components/ui/`.

| Component | Used For |
|---|---|
| `Button` | All CTA buttons, action buttons, submit buttons throughout |
| `Input` | Email, password, and display name fields on auth and profile pages |
| `Textarea` | Resume paste input, JD input, feedback text area on rating screen |
| `Card` | Session history cards on dashboard, per-answer report cards, resume list items on profile |
| `CardHeader`, `CardContent`, `CardFooter` | Internal structure of card components |
| `Dialog` | Delete resume confirmation, end-early session modal, navigation warning modal |
| `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` | Internal dialog structure |
| `Badge` | Interview mode tags, qualitative score labels (Excellent / Good / Needs Work / Poor), default resume indicator |
| `Progress` | Question progress bar in session header, loading progress during report generation |
| `Skeleton` | Loading state placeholders on dashboard (session cards, chart), profile resume list |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Resume input tabs on setup Step 1 (Saved Resumes / Upload New / Paste Text) |
| `Avatar`, `AvatarImage`, `AvatarFallback` | User avatar in navbar, displayed with initials as fallback |
| `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator` | Avatar dropdown menu in navbar |
| `Separator` | Visual dividers in report sections, profile page sections |
| `Label` | Form field labels on auth pages, setup wizard, profile page |
| `Checkbox` | "Save to my profile" option on Upload New resume tab in setup |
| `RadioGroup`, `RadioGroupItem` | Any future single-select option groups (reserved for extensibility) |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Any future dropdown selectors (reserved for extensibility) |
| `ScrollArea` | Session chat area (enables styled scrolling with hidden scrollbar), transcript viewer on report page |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Per-answer expandable cards on the report page |
| `HoverCard`, `HoverCardTrigger`, `HoverCardContent` | Dimension score tooltips on the report page |
| `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent` | Icon button tooltips (mic button state, download button, set-as-default button) |
| `Alert`, `AlertTitle`, `AlertDescription` | Browser compatibility warning, pdf.js extraction failure notice, resume cap warning |
| `Slider` | Technical/Behavioral ratio slider on setup Step 3 — 10 discrete breakpoints, snapping behavior |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` | Mobile navigation drawer (hamburger menu on small viewports) |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` | React Hook Form + Zod integrated form fields on auth and profile pages |

#### Toast Notification System

All transient user notifications use a toast component. Toasts are non-blocking, auto-dismiss after 4 seconds, and appear in the bottom-right corner of the screen on desktop and bottom-center on mobile.

Toast variants and color semantics:

| Variant | Color | Use Cases |
|---|---|---|
| `success` | Green background, dark green text | Resume uploaded successfully, report saved, session completed, display name updated, PDF download started |
| `error` | Red background, dark red text | Gemini API failure, Supabase write failure, resume upload failure, Storage delete failure, pdf.js extraction failure, resume cap reached |
| `warning` | Amber background, dark amber text | Browser compatibility notice, approaching token limit, microphone permission not granted |
| `info` | Blue background, dark blue text | Session state restored, auto-saved notification |

The `Toaster` component from ShadCN (or `sonner` as the underlying library) is mounted in the root layout and accessible globally via a `toast()` utility function from `lib/toast.ts`. Toast calls are made from lib functions and API error handlers — never directly from UI components.

---

### Navigation & Avatar Dropdown

The top navigation bar is present on all protected pages (`/dashboard`, `/setup`, `/session` header bar only, `/report`, `/profile`). It contains:

- MIRA logo (left) — navigates to `/dashboard`
- "New Interview" button (center-right) — navigates to `/setup`
- Avatar dropdown (far right) — shows user initials or Google profile photo

**Avatar Dropdown Menu items (in order):**

1. User email address (non-interactive, display only, muted text)
2. Separator
3. **My Resumes** — navigates to `/profile` scrolled to the resumes section
4. **Profile Settings** — navigates to `/profile`
5. Separator
6. **Sign Out** — clears Supabase session, redirects to `/login`

The "My Resumes" menu item is the primary entry point for users to manage their saved resumes outside of the setup flow. It uses a `FileText` icon from `lucide-react` to visually distinguish it from the general profile settings option.

---

### Information Architecture

```
/                   Landing page — value prop, sign up CTA
/login              Auth — login form + Google button
/signup             Auth — registration form + Google button
/dashboard          Home base — quick start + session history + score trend
/setup              3-step wizard: (1) Resume → (2) JD → (3) Technical/Behavioral slider + confirm
/session            Single page managing 7 internal states sequentially:
                      [1] Witty phrases (while API call runs)
                      [2] Mic permission request
                      [3] 5-second countdown (5→4→3→2→1)
                      [4] Live chat interview (greeting → questions → follow-ups → closing note)
                      [5] Rating screen (1–5 stars + optional feedback)
                      [6] AI closing note (TTS delivery)
                      [7] Report wait + completion (navigate to dashboard or report)
/reports            All reports listing page
/reports/[id]       Full report detail — scores, per-question analysis, transcript, PDF download
/profile            Account settings + saved resume manager
```

---

### Key Screen Descriptions

**Landing Page:** Marketing page with hero section, feature highlights, and sign-up CTA. Includes browser compatibility notice banner. Fully responsive — single column on mobile, two-column hero on desktop.

**Setup — Step 3 (Slider):** The third step displays the ShadCN `Slider` component spanning the full width of the card, labelled "Technical" on the left and "Behavioral" on the right. 10 discrete snap points. A live ratio label beneath the slider updates at each snap: e.g. "60% Technical / 40% Behavioral". The slider defaults to breakpoint 5 (50/50). Below the slider, the confirmation preview shows resume excerpt, JD excerpt, and the selected ratio before the user confirms.

**Witty Phrases Screen (Session state 1):** Full-screen, centered. A large witty phrase displayed in bold, rotating every 2–3 seconds with a smooth Framer Motion cross-fade. No spinner, no progress bar. This screen persists for the duration of the Gemini question generation API call.

**Microphone Permission Screen (Session state 2):** Full-screen, centered card. A microphone icon, a clear one-sentence explanation of why access is needed, an "Allow Microphone" button (triggers browser permission prompt), and a "Continue with Text Input" text link below it for users who decline. Transitions automatically to countdown when permission is granted or declined.

**5-Second Countdown Screen (Session state 3):** Full-screen, dark background. A large centered number counting down from 5 to 1, each digit animating in with Framer Motion (scale 1.2 → 1.0, fade in, 900ms per digit). A "Get ready…" label beneath the count. Auto-advances — no user interaction required.

**Live Chat Interface (Session state 4):** Full-screen conversational chat. AI messages left-aligned with avatar, candidate responses right-aligned. All AI text delivered word-by-word via TTS and simultaneously rendered in the chat bubble. The session opens with the dynamically generated personalised greeting before any questions are asked. All questions and follow-ups are phrased in natural human language — no numbering or mechanical prefixes. Persistent header with session timer (MM:SS) and question counter. Large mic button at bottom center — pulsing animation while active.

**Rating Screen (Session state 5):** Clean minimal card centered on screen. Five star icons with Framer Motion hover and selection animations. Optional textarea. "Submit & Continue" button disabled until star selected.

**AI Closing Note Screen (Session state 6):** Full-screen centered card. The dynamically generated personalised closing note delivered via TTS word-by-word, rendered in the card simultaneously. Transitions automatically once TTS completes.

**Report Wait Screen (Session state 7a):** Full-screen, centered. "Analysing your performance…" with a smooth Framer Motion animated indicator. No timer or countdown — persists until report is ready or an error occurs.

**Completion Screen (Session state 7b):** Full-screen, centered. Two buttons: "Go to Dashboard" and "View Report". No auto-advance — user chooses. If report generation failed, "View Report" is replaced with "Retry Report Generation".

**Reports Listing Page (`/reports`):** Reverse-chronological list of all completed reports. Each entry shows date, role, Technical/Behavioral ratio, overall score badge, qualitative label, and star rating the user gave. Two action buttons per entry: "View Report" (navigates to `/reports/[id]`) and "Download PDF". Loading skeleton while fetching. Empty state on first visit.

**Report Detail Page (`/reports/[sessionId]`):** Top score card (large overall score, qualitative label, session metadata row). Role alignment summary. Two-column strengths/improvements grid (single column on mobile). Per-question Accordion — each item shows question text, candidate's answer, numeric score, qualitative label badge, 6 dimension score badges, and 2–4 sentence feedback. Collapsible full transcript section at bottom. "Download PDF" button sticky at top. Staggered Framer Motion fade-in for Accordion items on load.

**Dashboard:** Responsive grid of session history cards. Score trend line chart. "Start New Interview" CTA. Empty state on first visit.

**Profile Page:** Display name editor. Resume section with count indicator. Resume list with action buttons (or dropdown on mobile). Upload zone.

---

### Responsiveness Patterns

All layouts use Tailwind's responsive prefix system. Key patterns:

- Navigation: full nav on `md+`, hamburger Sheet drawer on `sm` and below
- Setup wizard: single column form on mobile, max-width centered card on desktop
- Session chat: full-height flex column at all sizes, fixed bottom input bar
- Dashboard grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Report layout: single column on mobile, two-column sidebar layout on `lg+`
- Profile resume list: action buttons inline on `md+`, collapsed to dropdown on mobile

---

### Accessibility Notes

- All interactive elements reachable via keyboard (Tab + Enter/Space)
- ARIA live regions for mic status, TTS state, live transcript updates, and toast notifications
- Star rating component uses `role="radiogroup"` with individual `role="radio"` and `aria-label` per star
- Report score labels always use text in addition to color — never color alone
- All ShadCN components are ARIA-compliant out of the box
- Mobile Sheet navigation includes focus trap and `aria-modal`
- All Framer Motion animations respect `prefers-reduced-motion` via `useReducedMotion` hook

---

## 12. Testing Strategy

### Philosophy

Testing in MIRA is specification-first. Tests are written before implementation following the AI-TDD workflow described in Section 4. The test suite is the living specification of the system — it does not change to accommodate implementation. If a test fails, the implementation is wrong.

The 80% coverage threshold is a hard gate in CI. PRs that drop overall coverage below 80% are blocked from merging. Coverage is not a goal in itself — it is a minimum floor that ensures no untested path exists in business-critical code.

**TDD maps directly to Scrum artifacts:**

| Scrum Artifact | TDD Equivalent |
|---|---|
| Acceptance criterion | Failing test (RED) |
| Sprint dev work | Implement to pass (GREEN) |
| Code review / PR | Tests prove criteria met |
| Definition of Done | All criteria have passing tests |

Each git commit maps to a verifiable acceptance criterion from a GitHub Issue.

---

### Layer 1 — Unit & Integration Tests (Vitest + React Testing Library)

**Framework:** Vitest with `@testing-library/react` and `@testing-library/user-event`

**Coverage Threshold:** 80% across all metrics (statements, branches, functions, lines). Configured in `vitest.config.ts`:

```
coverage:
  provider: v8
  reporters: [text, lcov, html]
  thresholds: statements 80, branches 80, functions 80, lines 80
  exclude: **/*.config.*, **/types/**, **/*.d.ts, e2e/**
```

**What to unit test:**

| Area | Test Targets |
|---|---|
| Utility functions | Resume text extraction, token counter, question deduplication, score averaging, PDF filename generation, score-to-label mapping |
| Zustand store | All store actions: setResumeText, setSliderValue, addAnswer, updateContextPayload, setSessionPhase, setGeneratedContent, resetSession, consecutiveFollowUpCount enforcement, state transitions, selectedResumeId tracking |
| AI gateway | `gatewayCall` routing, round-robin key selection, all-keys-exhausted fallback to next provider, provider adapter normalisation (Gemini ↔ normalised, Groq ↔ normalised), call log write, pgcrypto decryption path |
| API route handlers | `/api/generate-questions`, `/api/generate-followup`, `/api/summarize-context`, `/api/generate-report`, `/api/judge` — mock gateway module, test request validation, Zod parse, error handling |
| Admin API routes | `/api/admin/users`, `/api/admin/providers`, `/api/admin/logs`, `/api/admin/evals` — role check enforced; non-admin returns 403; suspended user blocked |
| Resume API routes | `/api/resumes/upload`, `/api/resumes/[id]`, `/api/resumes/[id]/download` |
| Eval system | `runEval.ts` — mock gateway, verify 5 dimensions sent, Zod parse of judge response, `eval_results` write |
| React components | Setup form validation, slider interaction, resume tab switching, rating star interaction, report card rendering, session timer, admin user table pagination, admin provider key masking |
| SpeechSynthesis wrapper | Word-by-word emission timing, TTS complete event, fallback detection |
| Web Speech API wrapper | Interim result handling, silence threshold logic, commit-on-silence behavior, fallback activation |
| Middleware | All route classifications — unauthenticated → redirect, admin route + non-admin → 403, suspended user → blocked, authenticated auth page → redirect to dashboard, static asset → passthrough |
| Supabase data layer | Mock Supabase client — session save, report save, feedback save, resume CRUD, dashboard fetch, provider CRUD, call log insert, eval result insert/fetch, admin user list/suspend/delete |

**Mocking strategy:**
- AI gateway: mocked via `vi.mock('lib/gateway')` — all API routes that call the gateway use this mock
- Supabase client: mocked via a custom factory returning vi-compatible spies
- Web Speech API and SpeechSynthesis API: mocked via `vi.stubGlobal` in test setup
- Next.js router: mocked via `next/navigation` mocks
- Environment variables: set in `vitest.config.ts` under `env`

---

### Layer 1b — Property-Based Tests (fast-check)

Property-based tests are used alongside example-based unit tests for all logic modules with large or unbounded input spaces. Rather than hand-picking specific inputs, `fast-check` generates hundreds of randomised inputs per run and verifies that invariant properties always hold. These tests live in the same `*.test.ts` files as unit tests, co-located with the source file.

**Property-based test targets:**

| Module | Property Being Tested |
|---|---|
| `lib/scoring.ts` | Overall score always falls within [1.00, 5.00] regardless of input score distribution |
| `lib/scoring.ts` | Score-to-label mapping is total and exhaustive — every integer in [1, 5] maps to exactly one qualitative label, never undefined |
| `lib/tokenCounter.ts` | Estimated token count is always a positive integer for any non-empty string input |
| `lib/tokenCounter.ts` | Token count scales monotonically — a longer string never produces a lower token count than a shorter string |
| `lib/questionDedup.ts` | The deduplicated output array is always a subset of the input, never longer than the original |
| `lib/questionDedup.ts` | Deduplication is idempotent — running it twice on the same input produces the same result |
| `lib/silenceDetector.ts` | The silence threshold callback never fires in under 2000ms regardless of the input timing sequence |
| `store/sessionStore.ts` | `addAnswer` always increments the conversation history length by exactly 1 |
| `store/sessionStore.ts` | `resetSession` always returns the store to its initial state regardless of prior mutations |
| `store/sessionStore.ts` | `consecutiveFollowUpCount` never exceeds 2; any attempt to evaluate a follow-up when count is already 2 must return false regardless of Gemini's decision |
| `store/sessionStore.ts` | `consecutiveFollowUpCount` resets to 0 exactly when the session advances to the next pre-generated question, not before |

---

### Layer 2 — End-to-End Tests (Playwright)

**Framework:** Playwright with TypeScript

**Browsers:** Chromium (primary), WebKit (Safari compatibility)

**Test scope — critical user flows:**

| Flow | Description |
|---|---|
| Full happy path | Sign up → Setup (saved resume + JD + mode) → Complete full session (mocked TTS + speech) → Rating → Report rendered → PDF download |
| Auth: email signup + login | Sign up with email/password → Login → Protected route access → Logout → Verify redirect |
| Auth: Google OAuth | OAuth redirect → Callback → Dashboard render (stubbed with Playwright auth fixture) |
| Middleware redirects | Unauthenticated → `/dashboard` redirects to `/login?returnTo=/dashboard`; Authenticated → `/login` redirects to `/dashboard` |
| Resume management | Upload PDF on profile → Set as default → Navigate to setup → Verify pre-selected → Delete resume → Verify removed |
| Session: saved resume flow | Select saved resume in setup → Complete session → Verify `resume_id` saved on session |
| Session: early exit | Start session → End early → Confirm modal → Closing → Rating → Report with partial answers |
| Browser fallback | Disable Web Speech API → Verify text input renders → Complete session via text input |
| Dashboard | Login → View session list → Score trend chart renders → Re-download report → PDF generated |
| Navigation warning | Active session → Click browser back → Warning modal appears |
| Failed Gemini recovery | Mock Gemini 503 → Verify retry UI → Mock recovery → Session proceeds |
| Admin: user management | Login as admin → view user list → suspend a user → verify suspended user cannot log in → reactivate user → verify login restored → delete a user → verify data purged |
| Admin: provider configuration | Login as admin → add a new provider with 2 keys → set it as active → verify gateway routes to new provider → remove one key → verify round-robin skips removed key |
| Admin: access control | Login as regular user → attempt to navigate to `/admin` → verify 403 and redirect to `/dashboard` → attempt direct POST to `/api/admin/users` → verify 403 response |
| Gateway: round-robin | Configure provider with 3 keys → make 3 sequential AI calls → verify each call uses a different key in rotation |
| Gateway: provider fallback | Configure 2 providers, active provider has 1 key → mock key returning 429 → verify gateway falls back to second provider |
| Session: all pre-generated questions asked | Complete a full session with follow-ups injected → verify every pre-generated question appears in the transcript regardless of how many follow-ups were asked |
| Report: no follow-up differentiation | Complete session with follow-up questions → navigate to `/reports/[sessionId]` → verify no question has a "follow-up" label, badge, or different styling → verify all questions appear at the same Accordion level |

**Test data strategy:** A dedicated Supabase test project (separate from production) with seeded test users. Playwright uses fixtures to authenticate test users directly via Supabase Auth API, bypassing the UI login for speed on all non-auth tests.

---

### Layer 3 — Mutation Testing (Stryker)

**Framework:** `@stryker-mutator/vitest-runner` with `@stryker-mutator/typescript-checker`

**Target mutation score:** 70% minimum. Stryker runs on a weekly schedule in CI, not on every PR, to keep pipeline runtime manageable.

**Scope:** Applied to the five highest-risk pure logic modules:

| Module | Rationale |
|---|---|
| `lib/scoring.ts` | Score computation directly affects report quality — wrong mutations would produce incorrect evaluation output |
| `lib/tokenCounter.ts` | Token overflow detection is a correctness boundary — mutations could cause context window errors |
| `lib/questionDedup.ts` | Deduplication protects session quality — missed mutations could allow repeated questions |
| `store/sessionStore.ts` | State machine correctness — mutations could corrupt conversation history |
| `lib/silenceDetector.ts` | Timing logic — mutations could cause premature or missed answer submission |

**Thresholds:** `high: 80, low: 70, break: 60` — pipeline fails if mutation score drops below 60%.

---

## 13. CI/CD Pipeline & Deployment

### Overview

MIRA uses a three-environment deployment model: PR Preview, Staging, and Production. The GitHub Actions pipeline runs on every pull request targeting `main`. No direct pushes to `main` are permitted. The pipeline enforces strict quality gates at each stage. Production deployment uses a blue-green strategy with rollback capability.

---

### Environments

| Environment | Trigger | URL | Database | Purpose |
|---|---|---|---|---|
| **PR Preview** | Every PR opened/updated | Unique Vercel preview URL per PR | Supabase test project | Per-PR isolated testing, reviewer demos |
| **Staging** | Push to `staging` branch | Fixed Vercel staging URL | Supabase staging project (isolated) | Pre-production validation, blue-green swap target |
| **Production** | Merge to `main` after review | Production URL | Supabase production project | Live application |

Staging uses a separate Supabase project with its own database, auth, and storage — fully isolated from production data. The staging environment mirrors the production configuration exactly (same environment variable structure, same Vercel project settings).

---

### Pipeline Stage Order

```
PR opened or updated → targeting main
        │
        ▼
Stage 1: Build Check
  ├── type-check        → tsc --noEmit (TypeScript, strict mode)
  └── next-build        → next build (production build, catches compile errors)

        │ (only if Stage 1 passes)
        ▼
Stage 2: Code Quality (parallel jobs)
  ├── lint-check        → ESLint (next/core-web-vitals + TypeScript + jsx-a11y)
  ├── format-check      → Prettier --check (fails on any formatting diff)
  ├── dependency-audit  → yarn audit --level high (dependency vulnerability scan)
  ├── secrets-scan      → trufflesecurity/trufflehog-actions-scan
  │                        Scans all commits in the PR for committed secrets, API keys,
  │                        credentials, and tokens. Fails on any detected secret.
  └── codeql-analysis   → GitHub CodeQL static analysis (SAST)
                           Scans TypeScript source for injection risks, insecure patterns,
                           and known vulnerability classes
                           Fails on any Critical or High severity finding
                           Results posted to GitHub Security tab

        │ (only if Stage 2 passes)
        ▼
Stage 3: Unit Tests + Coverage
  └── vitest            → Run all unit tests including property-based tests (fast-check)
                           Coverage report generated (lcov + html + text-summary)
                           Fail if any threshold < 80% (statements, branches, functions, lines)
                           Upload lcov to Codecov — posts delta comment on every PR
                           Coverage badge updated on README

        │ (only if Stage 3 passes)
        ▼
Stage 4: E2E Tests
  └── playwright        → Run Playwright tests on Chromium + WebKit
                           Uses next start on the build from Stage 1
                           Test Supabase project used (env vars from GitHub Secrets)
                           Uploads test report + failure screenshots as artifacts

        │ (only if Stage 4 passes — runs on weekly schedule, not every PR)
        ▼
Stage 5: Mutation Testing (weekly scheduled run only)
  └── stryker           → Run Stryker on 5 scoped modules
                           Fail if mutation score < 60% (break threshold)
                           Upload HTML report as artifact

        │ (runs on every PR, read-only, no write access)
        ▼
Stage 6: Claude Code Review (anthropics/claude-code-action@v1)
  └── claude-code       → Reads the PR diff and all changed files
                           Analyzes code changes for correctness, patterns, and issues
                           Posts inline comments on specific lines of the diff
                           Posts a PR-level summary comment with findings
                           READ-ONLY — no commits, no branch writes, no approvals
                           Permissions: contents: read, pull-requests: write (comments only)

        │ (only after all above stages pass)
        ▼
Stage 7: PR Preview Deploy
  └── vercel-preview    → Deploy PR branch to a Vercel preview URL (not production)
                           Preview URL posted as a PR comment
                           Each PR gets its own isolated preview environment
                           Preview torn down when PR is closed or merged
```

**Production deployment** is a separate workflow — not part of the PR pipeline. It triggers only on push to `main` after a PR is reviewed, approved by a team member, and merged.

---

### Blue-Green Deployment Strategy

MIRA uses a blue-green deployment strategy for production releases. The staging branch deployment on Vercel serves as the "green" environment before a production swap.

```
Staging branch → Vercel staging URL (green environment)
        │
        │ Team validates on staging
        │ All checks pass
        ▼
Merge staging → main
        │
        ▼
Production workflow triggers:
  1. next build on main
  2. Deploy to Vercel production (blue-green instant swap)
  3. Vercel atomically routes all traffic to the new deployment
  4. Previous deployment remains available for rollback
```

**Rollback procedure:** Vercel retains all previous production deployments. If a production issue is detected after a deploy, rollback is performed by re-promoting the previous deployment in the Vercel dashboard. This is an instant traffic swap with zero downtime. The rollback step is documented in the project README and takes less than 60 seconds to execute.

**Performance gate:** The production workflow fails and the deploy is blocked if the Next.js production build reports TypeScript errors, or if the build output size exceeds a defined threshold (configured in the workflow). This prevents deploying a degraded build.

---

---

### Claude Code Action Configuration

```yaml
# In .github/workflows/pr.yml
- name: Claude Code Review
  uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
  permissions:
    contents: read
    pull-requests: write
```

The Claude Code review step has `contents: read` only — it reads the diff and source files but cannot write to the repository, create commits, push branches, or approve/merge PRs. Its only write permission is `pull-requests: write`, scoped exclusively to posting review comments and a summary comment on the PR. This is the only action in the pipeline with any write capability, and that write is limited to comments.

---

---

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn",
    "jsx-a11y/alt-text": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Branch Protection Rules

- `main` branch is protected — no direct pushes, no force pushes
- All pipeline status checks (Stages 1–4) must pass before a PR can be merged
- Minimum 1 pull request approval required (Likhith and Jaya approve each other's PRs)
- Stale reviews are dismissed when new commits are pushed to the PR branch

---

## 14. Production Monitoring

### Overview

MIRA uses three monitoring tools in production: Sentry for error tracking and alerting, Vercel Analytics for APM and Web Vitals, and Better Stack for uptime monitoring. All monitoring is configured to send alerts to the team email. No paid tiers are required — all tools operate within free tier limits for a course project.

### Error Tracking — Sentry

Sentry is integrated via `@sentry/nextjs`. It captures unhandled exceptions across both the Next.js server (API routes, server components) and the client (React errors, unhandled promise rejections). Source maps are uploaded on each production deploy so stack traces link to original TypeScript source lines.

**Alert rules configured in Sentry:**
- New issue first seen → email alert immediately
- Existing issue regresses after being resolved → email alert immediately
- Error volume exceeds 10 occurrences in 1 hour → email alert

**What Sentry captures for MIRA specifically:**
- AI gateway call failures (provider error, all keys exhausted, timeout)
- Supabase write failures during session save
- Report generation failures
- Unhandled exceptions in any API route
- Client-side React Error Boundary catches

### APM — Vercel Analytics

Vercel Analytics is enabled on the production Vercel project at zero additional cost. It provides:
- Request latency per API route (p50, p95, p99)
- Error rate per route
- Web Vitals per page (LCP, FID, CLS, TTFB)
- Visitor count and geographic distribution

The Vercel Analytics dashboard is accessible to both team members via the Vercel project.

### Uptime Monitoring — Better Stack

Better Stack monitors the production URL (`https://mira.app` or equivalent) with a 1-minute check interval using HTTP checks. A downtime alert is triggered after 2 consecutive failed checks and sends an email to the team. The Better Stack status page is publicly accessible and linked from the project README.

### Monitoring Dashboard Access

| Tool | Access |
|---|---|
| Sentry | Project dashboard shared with both team members via Sentry org |
| Vercel Analytics | Accessible via Vercel project dashboard to both team members |
| Better Stack | Status page public; alert config accessible to both team members |

---

## 15. Scope

### In Scope — v1

- User authentication: email/password and Google OAuth via Supabase
- Admin user type with separate dashboard: user CRUD, AI provider configuration, call logs, eval metrics
- Top navigation with avatar dropdown (My Reports, My Resumes, Profile Settings, Sign Out)
- Resume input: PDF upload (pdf.js parsed) and plain text paste
- Saved resume profiles: upload, store, default, delete, re-download via Supabase Storage
- Resume selection in setup: saved resumes tab, upload new with optional save, paste text
- Job description text input
- Technical/Behavioral ratio slider (10 breakpoints; situational questions folded into behavioral)
- AI API gateway: provider-agnostic, round-robin within provider key pool, automatic fallback across providers on exhaustion, request normalisation per provider adapter, call logging
- AI provider configuration via admin dashboard (add/remove providers and API keys, designate active provider)
- Provider API keys encrypted at rest with pgcrypto
- Contextual follow-up questions (dual trigger: weak answers + interesting answers; max 2 consecutive; no cap on total; all pre-generated questions always asked)
- All questions treated identically in UI, report, and PDF — no labelling or differentiation
- Dynamically generated personalised opening greeting and closing note via AI gateway
- Witty rotating phrases loading screen during question generation
- Dedicated microphone permission request screen
- 5-second literal countdown before session begins
- Live chat session with word-by-word TTS and speech transcription
- Text input fallback for unsupported browsers or denied mic permission
- Linear session flow (no skip, no re-answer)
- Session timer (displayed); question counter (internal only, not shown to user)
- Rolling context summarization via gateway at 12,000 token threshold
- Session question set cached in sessionStorage to survive page refresh
- Post-session flow: rating screen → AI closing note → report generation wait → navigation choice
- 1–5 star rating + optional written feedback (stored in Supabase)
- AI-generated performance report (6 dimensions, numeric score + qualitative label per answer)
- LLM-as-judge evaluation system: 5 dimensions, runs async after every session, results in admin dashboard with historical metrics
- `/reports` page and `/reports/[sessionId]` full report detail with per-question accordion, transcript, PDF download
- PDF download: cover page + full transcript + per-question scores and feedback
- User dashboard: quick start, session history list, score trend chart
- Profile page: saved resume manager, display name editor
- Full Supabase persistence: sessions, transcripts, reports, feedback, user_resumes, ai_providers, ai_call_logs, eval_results
- Middleware route protection: user routes, admin routes (role check), API routes (session + role)
- OWASP Top 10 explicitly addressed and documented
- Full responsiveness across all device sizes (mobile 320px through desktop 1536px+)
- Framer Motion animations and transitions throughout
- Global toast system with success, error, warning, and info color variants
- Mobile navigation Sheet drawer
- Three-environment deployment: PR Preview → Staging → Production (blue-green)
- Rollback capability via Vercel instant deployment re-promotion
- Sentry error tracking, Vercel Analytics APM, Better Stack uptime monitoring
- GitHub Actions multi-stage CI/CD pipeline with secrets scanning, SAST, Claude Code Action review
- TruffleHog secrets scanning on every PR

### Out of Scope — v1 (Future Consideration)

| Feature | Notes |
|---|---|
| Per-user rate limits and pricing model with provider allocation | Gateway architecture supports this — admin designates one active provider for all users in v1; per-user provider routing is deferred |
| Feedback-driven prompt refinement | Star ratings and feedback are stored; using them to auto-tune prompts is deferred |
| Mobile support (< 768px) | Requires dedicated layout design pass |
| Multi-round interview simulation | Single session meets v1 user need |
| Video / facial expression analysis | Significant infrastructure and model complexity |
| Company-specific interview presets (FAANG, consulting, etc.) | Addable as mode preset in v2 |
| Social / shared sessions | Out of current persona scope |
| Admin ability to promote users to admin via dashboard UI | Admin role assignment via DB only in v1 |
| Push notifications or email reminders | Post-v1 engagement feature |

---

## 16. Assumptions & Constraints

### Assumptions

| # | Assumption |
|---|---|
| A1 | Users will primarily access MIRA on Chrome or Edge where both Web Speech API and SpeechSynthesis API are fully supported. |
| A2 | Users will provide a resume and job description with sufficient textual detail (minimum ~200 words each) for Gemini to generate meaningful, specific questions. |
| A3 | The Gemini Pro API will return well-structured JSON when prompted with a schema-constrained system prompt. |
| A4 | Users have a functional microphone and will grant microphone permission to the browser. |
| A5 | Sessions will not exceed 45 minutes, keeping token usage within manageable per-session limits. |
| A6 | The Supabase free tier (500MB database, 1GB file storage, 50,000 MAU) is sufficient for the course project demonstration period. |
| A7 | Both team members (Likhith and Jaya) will work from feature branches and submit changes via pull requests to main. |
| A8 | Resume PDFs uploaded by users are standard text-based PDFs. Scanned image-only PDFs will produce empty or garbled extracted text — this is accepted behavior in v1 with no OCR fallback. |
| A9 | The Supabase JWT secret is stable and does not rotate during the project period, ensuring middleware session verification remains valid throughout. |

### Constraints

| # | Constraint |
|---|---|
| C1 | All AI provider API keys must never be exposed to the client. All AI calls are proxied through the gateway module in Next.js API routes. Provider keys are decrypted only at call time and never returned in any API response. |
| C2 | Speech recognition accuracy is dependent on the Web Speech API, which varies by browser, accent, ambient noise, and microphone quality. MIRA cannot guarantee transcription accuracy. |
| C3 | The SpeechSynthesis API voice quality varies significantly by operating system and browser. MIRA cannot control voice naturalness on all platforms. |
| C4 | Session length and total API calls are uncapped — every pre-generated question must be asked plus all follow-ups triggered. Cost per session varies by session length and provider. |
| C5 | jsPDF client-side PDF rendering has limited font and layout flexibility compared to server-side PDF solutions. |
| C6 | The project deadline of April 19, 2026 constrains total development time to approximately 4 weeks from March 22, 2026. |
| C7 | The middleware runs at the Next.js Edge Runtime and cannot use Node.js APIs. Only edge-compatible Supabase SSR methods are used for session and role validation. |
| C8 | Supabase Storage signed URLs for resume downloads expire after 60 seconds. Sharing a download link is not a supported use case. |
| C9 | The Supabase service role key must only be used in server-side API routes and never in any `NEXT_PUBLIC_` environment variable. |
| C10 | A user is limited to 10 saved resumes. This cap is enforced at both the application and database layers. |
| C11 | The pgcrypto extension must be enabled in the Supabase project for provider key encryption. This is a one-time database setup step. |
| C12 | Admin role assignment in v1 is performed directly via Supabase SQL. There is no UI for initial admin creation. |

---

## 17. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Web Speech API unavailable or inaccurate | Medium | High | Text input fallback on all session screens; browser compatibility notice on setup page |
| R2 | Gemini returns malformed JSON (not schema-conformant) | Medium | High | Validate and parse response with Zod schema; retry with explicit schema re-prompt on parse failure |
| R3 | Performance report is too generic and not role-specific | Medium | High | System prompt explicitly requires JD references per answer; automated prompt testing across 5 persona types before launch |
| R4 | Session transcript exceeds Gemini context window | Low | Medium | Token counter in session controller; summarise early turns at 12K token threshold before each API call |
| R5 | User closes browser tab mid-session | Medium | Medium | `beforeunload` warning; session state in Zustand persists for tab-restore within the same session |
| R6 | Gemini API rate limit hit during session | Low | High | Exponential backoff retry (3 attempts); graceful error UI with "Retry" option |
| R7 | Supabase write failure during session save | Low | Medium | Report renders from in-memory Zustand state regardless; retry save in background; user notified via toast |
| R8 | PDF generation fails or produces corrupt file | Low | Medium | Test jsPDF across Chrome, Edge, Safari before M6; offer copy-to-clipboard fallback for report text |
| R9 | Stryker mutation tests significantly slow CI | Medium | Low | Mutation testing runs on a weekly schedule only, not on every PR; scoped to 5 high-risk modules |
| R10 | Both team members working on the same files causes merge conflicts | Medium | Medium | Clear module ownership: Likhith owns session/AI layer, Jaya owns auth/dashboard/UI; feature branch naming convention enforced |
| R11 | Middleware misconfiguration exposes protected routes or creates redirect loops | Low | High | Dedicated middleware unit tests covering every route classification; login→dashboard and dashboard→login redirect loop tested explicitly in Playwright E2E suite |
| R12 | pdf.js fails to extract text from certain resume PDFs (image-only scans, encrypted files) | Medium | Medium | Detect empty extraction result and surface an inline warning: "We couldn't read this PDF. Please paste your resume as text instead." The paste text fallback is always available on Step 1 |
| R13 | All configured AI provider keys are exhausted (all return 429 or errors simultaneously) | Low | High | Gateway returns a structured error; the calling feature surfaces a retry option to the user. Admin is notified via Sentry error. Admin can add additional keys via the admin dashboard without a deployment. |
| R14 | Admin account is compromised — attacker gains access to AI provider key configuration | Low | High | Provider keys are encrypted at rest. Admin routes require both a valid session and role=admin checked at middleware AND RLS layer. Admin actions are not exposed via any public-facing route. |
| R15 | LLM-as-judge eval produces misleading scores, giving false confidence about AI quality | Medium | Medium | Eval scores are internal only (admin dashboard). They are one signal among many. Team reviews eval trends over time rather than treating any single score as definitive. |
| R16 | Sentry DSN or Better Stack key committed to repository | Low | Medium | TruffleHog secrets scanning on every PR blocks commits containing secrets. `.env.example` documents variable names only. Gitignore covers `.env.local`. |
| R17 | Staging and production environments diverge (different env vars, different DB schema) | Medium | Medium | Staging Supabase project mirrors production schema via shared migration files. Environment variable parity is documented in the README and checked during each sprint. |

---

## 18. Timeline

**Start date:** March 22, 2026 · **Final milestone target:** April 17, 2026 · **Submission deadline:** April 19, 2026

| Sprint | Dates | Focus | Target |
|---|---|---|---|
| Sprint 1 | Mar 22 – Mar 28 | Foundation — auth, middleware, CI/CD, Supabase schema + storage | Mar 28 |
| Sprint 2 | Mar 29 – Apr 4 | Resume management, profile page, setup wizard, question generation | Apr 4 |
| Sprint 3 | Apr 5 – Apr 11 | Live session — TTS, speech recognition, follow-up injection | Apr 11 |
| Sprint 4 | Apr 12 – Apr 17 | Report engine, dashboard, PDF export, full test suite, production deploy | **Apr 17** |

Full sprint breakdown, per-milestone deliverables, owners, and exit criteria are maintained in the separate **Sprint Plan & Milestones** document.

---

*This document is the single source of truth for MIRA v1 product requirements. All GitHub issues and implementation decisions should reference section and requirement IDs from this PRD. Update this document as decisions evolve during development.*
