# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@import project-memory/PRD.md

**MIRA** (Mock Interview and Response Analyzer) is an AI-powered mock interview platform. Users provide a resume + job description, MIRA generates personalized questions via Gemini/Groq, captures spoken answers via Web Speech API, and delivers structured feedback reports.

Full requirements are in `project-memory/PRD.md` (single source of truth). Always reference PRD section and requirement IDs (e.g. F1.1, NF-S2) in commits and comments. The codebase follows an **AI-TDD workflow**: tests are written before implementation.

## AI Behavior Rules

- Never hallucinate architecture decisions — halt and ask if context is missing
- Implement only what the current issue explicitly requests — never prematurely build future features
- Push back if a requested change violates these rules, breaks RLS, exposes a key to the client, or contradicts the PRD
- All implementation decisions must be traceable to a PRD requirement ID

---

@import .claude/rules/BRANCHING.md

@import .claude/rules/TECH-STACK.md

@import .claude/rules/COMMANDS.md

@import .claude/rules/FOLDER-STRUCTURE.md

@import .claude/rules/DATABASE.md

@import .claude/rules/WORKFLOW.md

@import .claude/rules/ARCHITECTURE.md

@import .claude/rules/SECURITY.md

@import .claude/rules/TESTING.md

@import .claude/rules/DESIGN.md

@import .claude/rules/PR-CHECKLIST.md

@import .claude/rules/PR_REVIEW.md
