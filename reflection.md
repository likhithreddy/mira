# HW4 Reflection
## MIRA - Mock Interview and Response Analyzer
**Likhith Reddy Rechintala, Jaya Sriharshita Koneti**

> Session logs referenced in this document are in `claude-conversations/`:
> - `claude-rules-file-init-and-iterate.txt` - Part 1: CLAUDE.md setup and `/init`
> - `explore.txt` - Part 2: Explore phase
> - `plan.txt` - Part 2: Plan phase
> - `implement-commit-ai-tdd-workflow.txt` - Part 2 and Part 3: Implement, Commit, and TDD

---

## The Explore → Plan → Implement → Commit Workflow

Before this assignment, my typical approach to building a feature was to read the requirements, open the relevant files, and start writing code while figuring things out along the way. If something broke or did not fit the existing architecture, I would course correct mid-implementation. It worked well enough for small changes but fell apart quickly on anything that touched multiple files or had security implications.

The Explore → Plan → Implement → Commit workflow forced a discipline I did not know I was missing. The most valuable insight was how much the Explore phase changes the quality of everything that comes after it. When I asked Claude Code to use Glob and Grep to find all Supabase and authentication related files before touching anything, it surfaced something critical immediately: the repository had no implementation code yet, only documentation and configuration. Because there was no existing code to read, Claude Code did not stop there. It went further and searched the internet, reading the actual `@supabase/ssr` package documentation and current Next.js integration guides to understand the correct patterns before a single file was written. That is not something I would have done on my own before starting to code. I would have relied on tutorials I had seen before, which in this case would have been wrong because the SSR cookie handling API changed significantly between versions.

The exploration also uncovered the critical detail that `createServerClient` requires `getAll()` and `setAll()` cookie handlers rather than the older `get/set/remove` pattern, and that `getUser()` must always be used for authorization instead of `getSession()` because `getSession()` does not validate the JWT. Getting either of those wrong would have caused subtle session bugs that are notoriously difficult to debug in production. Finding both in the Explore phase rather than during a code review meant they were baked into the plan from the start.

The Plan phase was where I noticed the biggest difference from how I used to work. Writing out exactly which files to create, what each one exports, and what the test structure looks like before writing a single line of implementation code felt slow at first. But when I got to the implementation phase, there were zero decisions left to make. Claude Code read the plan and executed it without ambiguity. There was no back and forth about how to structure the cookie handler or whether the middleware helper should return a `NextResponse` or mutate the request. All of that had already been resolved in the plan.

My previous approach collapsed those three phases into one. I would explore, plan, and implement simultaneously, which meant my mental context was constantly switching between understanding the problem and solving it. The `/clear` commands between phases enforced a clean separation that actually made each phase faster because the focus was singular.

---

## Context Management Strategies

The most effective strategy was running `/clear` at the end of each phase before starting the next one. This sounds counterintuitive because you are deliberately throwing away context, but it forced each phase to be self contained. The Explore phase had to produce a document good enough to stand alone. The Plan phase had to produce a document detailed enough that the implementation phase needed nothing else. If I had kept the same context window running across all phases, Claude Code would have been reasoning from a mix of raw exploration notes, half formed ideas, and the actual plan simultaneously, which is exactly the kind of noise that produces inconsistent output.

Saving findings to `docs/explorations/S1-04-exploration.md` and the plan to `docs/plans/S1-04-plan.md` before clearing was the mechanism that made this work. The files became the handoff between phases rather than the context window. This also means the reasoning behind every decision is permanently recorded in the repository, which is something I did not have before. If a teammate picks up this code six months from now and wonders why `setAll` is wrapped in a try/catch, the exploration file explains exactly why.

One thing I learned during the Plan phase was that Claude Code's internal plan mode and the actual plan document are two different things. When Claude proposed an agentic plan and I rejected it, the plan file had already been written to disk. That was not a failure of the workflow, it was me misunderstanding what I was rejecting. The plan file was intact and the implementation phase used it correctly. Understanding the difference between Claude Code's internal reasoning scaffolding and the actual file output it produces is something that only becomes clear by using it on a real project.

---

## Annotated Session Logs

### Session 1: CLAUDE.md Setup and `/init`
**File: `claude-conversations/claude-rules-file-init-and-iterate.txt`**

```
❯ /clear
❯ /init
```

> I ran `/clear` first to start with a completely clean context window before
> running `/init`. This is important because `/init` needs to explore the
> repository without any prior assumptions about what it will find.

```
⏺ Explore(Explore codebase structure)
  ⎿  Done (18 tool uses · 55.4k tokens · 2m 31s)
```

> Claude Code used 18 tool calls and 55,000 tokens just to explore the repo
> structure before generating a single line of CLAUDE.md. This is the kind of
> thorough upfront reading that makes the generated output actually useful
> rather than generic.

```
⏺ Write(CLAUDE.md)
  ⎿  Wrote 110 lines to CLAUDE.md
     ## Project Overview
     **MIRA** (Mock Interview and Response Analyzer) is an AI-powered mock
     interview platform...
     Full requirements are in `project-memory/PRD.md`...
     The codebase follows an AI-TDD workflow: tests are written before
     implementation.
```

> The `/init` output correctly identified MIRA's purpose, found the PRD and
> sprint plan in project-memory/, and set the AI-TDD workflow rule from reading
> those documents. This became the starting point for CLAUDE.md, which I then
> iterated on with additional rules.

```
❯ One more important thing. Let us use yarn as package manager instead of npm.
  Change it wherever needed in our application.
```

> This is an example of iterating on the `/init` output. The generated CLAUDE.md
> used npm throughout. I noticed this and asked Claude Code to update every
> reference across CLAUDE.md, SPRINT_PLAN.md, and PRD.md in a single pass rather
> than editing them manually one by one.

```
⏺ User approved Claude's plan
  Plan: Switch Package Manager from npm to yarn
  Files to Modify: CLAUDE.md, project-memory/SPRINT_PLAN.md, project-memory/PRD.md
```

> Claude Code produced a plan showing every exact change it intended to make
> before touching any file. Approving the plan rather than just letting it run
> freely meant I could verify the scope was correct. No surprises.

```
⏺ Bash(git commit -m "chore: initial repo setup with CLAUDE.md and project memory")
  ⎿  [main (root-commit) 19ddf6a] chore: initial repo setup with CLAUDE.md
     4 files changed, 3894 insertions(+)
```

> First commit to the repository. Everything in a clean initial state before
> any feature work begins.

---

### Session 2: Explore Phase
**File: `claude-conversations/explore.txt`**

```
❯ /clear
❯ Find all files in the project related to supabase or authentication.
  Then use Glob, Grep, and Read and read the @supabase/ssr package docs.
  Save your findings to docs/explorations/S1-04-exploration.md
```

> I ran `/clear` before every session to prevent context from one phase bleeding
> into the next. The prompt explicitly names three tools: Glob, Grep, and Read.
> This was intentional. Naming the tools forces a structured exploration rather
> than Claude Code jumping straight to writing code.

```
⏺ 2 Explore agents finished (ctrl+o to expand)
   ├─ Find Supabase and auth-related files · 22 tool uses · 42.8k tokens
   └─ Read @supabase/ssr package docs and Next.js integration patterns
      · 41 tool uses · 53.8k tokens
```

> Claude Code ran two parallel exploration agents totalling 63 tool calls and
> over 96,000 tokens. One agent searched the repository using Glob and Grep.
> The other went to the internet to read the actual @supabase/ssr package
> documentation and Next.js integration guides because there was no existing
> implementation code in the repository to learn from. This is the key moment
> where the Explore phase earned its place in the workflow: no existing code
> meant Claude Code had to go find the right patterns from authoritative external
> sources rather than inferring them from whatever was already in the project.

```
Key findings:
1. No source code exists yet - repo has only docs/config. S1-04 is a
   greenfield implementation.
2. createServerClient requires getAll()/setAll() cookie handlers (modern API)
3. Always use getUser() for authorization, never getSession() (no JWT validation)
4. setAll in Server Components must be wrapped in try/catch
5. Export factory functions, not singletons, to avoid shared state across requests
```

> These five findings directly shaped every implementation decision. Finding 3
> is a security implication that is easy to miss from outdated tutorials. Finding
> it here rather than during a security review meant it was built in correctly
> from the start rather than patched in later.

```
⏺ Write(docs/explorations/S1-04-exploration.md)
  ⎿  Wrote 213 lines to docs/explorations/S1-04-exploration.md
```

> 213 lines of findings saved to a persistent file before running `/clear`.
> This file is the handoff to the Plan phase. The context window is discarded
> but the knowledge survives.

---

### Session 3: Plan Phase
**File: `claude-conversations/plan.txt`**

```
❯ /clear
❯ Read @docs/explorations/S1-04-exploration.md. Plan the full implementation
  of lib/supabase/client.ts, lib/supabase/server.ts,
  and lib/supabase/middleware.ts based on S1-04 acceptance criteria.
  Save the plan to docs/plans/S1-04-plan.md.
  Write only the plan and nothing else.
```

> Third `/clear`. This session starts cold with only the exploration document
> as context. The instruction "write only the plan and nothing else" was
> deliberate. Without it, Claude Code would have started implementing
> immediately. The entire point of the plan phase is to make design decisions
> before writing production code.

```
⏺ Explore(Explore project structure and sprint plan)
  ⎿  Done (15 tool uses · 61.7k tokens · 35s)
```

> Even in the plan phase, Claude Code ran an additional exploration pass to
> read the sprint plan acceptance criteria and cross-reference them against
> the exploration findings. It was not satisfied with just the exploration
> document. It went and read the source material itself.

```
⏺ Write(docs/plans/S1-04-plan.md)
  ⎿  Wrote 195 lines to docs/plans/S1-04-plan.md
```

> 195 lines covering file by file what to create, exact function signatures,
> cookie handler shapes, and test case descriptions. This document became the
> single source of truth for the implementation session.

```
⎿  User rejected Claude's plan:
   ╭──────────────────────────╮
   │ No plan found            │
   ╰──────────────────────────╯
```

> This rejection was of Claude Code's internal agentic plan proposal, not the
> plan file. The plan file had already been successfully written to disk at this
> point. I rejected the internal proposal because I wanted to implement in a
> separate session with a fresh context window, not immediately. The file was
> intact and ready to use.

---

### Session 4: Implement and TDD
**File: `claude-conversations/implement-commit-ai-tdd-workflow.txt`**

```
❯ /clear
❯ Read @docs/plans/S1-04-plan.md and implement it exactly as planned.
  Install vitest here itself if required instead of waiting for other
  issues to be implemented.
```

> Fourth `/clear`. The implementation session only needed the plan document.
> All the knowledge from the exploration had already been distilled into the
> plan, so the exploration file was not needed here. The instruction to install
> vitest immediately rather than waiting for S1-01 was a pragmatic decision
> to unblock TDD without depending on another issue being merged first.

```
⏺ The project has no package.json yet. I need to scaffold the Next.js
  project first, then implement S1-04.
```

> Claude Code flagged the missing package.json before doing anything else
> rather than failing silently mid-implementation. This is the kind of
> upfront problem detection that saves time compared to discovering it
> after several files are already written.

```
⏺ Now let me write the failing tests first (TDD step 1).

⏺ Write(lib/supabase/__tests__/client.test.ts)
⏺ Write(lib/supabase/__tests__/server.test.ts)
⏺ Write(lib/supabase/__tests__/middleware.test.ts)
```

> All three test files were written before a single implementation file.
> The plan specified the TDD order, so Claude Code followed it without
> needing to be prompted again at this step. This is the value of a
> detailed plan: the sequencing decisions are made once, not re-debated
> during implementation.

```
⏺ Bash(yarn test 2>&1 | tail -40)
  ⎿  FAIL  lib/supabase/__tests__/middleware.test.ts > lib/supabase/middleware
     > cookie setAll() writes to both request.cookies and supabaseResponse.cookies
```

> Tests fail as expected. This is the red state. The implementation files do
> not exist yet, so every test that imports from them fails immediately.

```
⏺ Bash(git add lib/supabase/__tests__/ package.json yarn.lock tsconfig.json
      vitest.config.ts && git commit -m "...")
  ⎿  [homework-4 2ba79f6] [#S1-04] test: add failing unit tests for Supabase
     SSR client factories
     7 files changed, 4387 insertions(+)
```

> Red commit. The failing tests are now in the git history as the executable
> specification. From this point the implementation cannot be considered done
> until these specific tests pass. This is the core discipline of TDD: the
> tests define done, not the developer's judgment.

```
⏺ Write(lib/supabase/client.ts)
⏺ Write(lib/supabase/server.ts)
⏺ Write(lib/supabase/middleware.ts)
```

> Implementation files written. Each one maps directly to a test file that
> was already committed. There was no guessing about what the implementation
> needed to do because the tests already specified it exactly.

```
⏺ Bash(yarn test:coverage 2>&1 | tail -25)
  ⎿  11/11 tests passing, 100% coverage on all three implementation files
```

> Green state. All 11 tests pass with 100% coverage across the three
> implementation files.

```
⏺ Bash(git add lib/supabase/__tests__/server.test.ts vitest.config.ts && git
      commit -m "...")
  ⎿  [homework-4 d58c888] [#S1-04] test: expand server.test.ts to cover
     cookie getAll/setAll callbacks
     2 files changed, 45 insertions(+), 6 deletions(-)
```

> Refactor commit. During the coverage check, it became clear that the server
> cookie callbacks were not fully exercised by the original tests. Rather than
> lowering the coverage threshold, additional test cases were added to cover
> the `setAll` delegation and the Server Component error swallowing behavior.
> The implementation itself did not change. Only the test coverage improved.
> This is the correct TDD response: if coverage reveals a gap, add tests, never
> lower the bar.

---

## What I Would Do Differently

The one thing I underestimated was how important the plan file format is. A plan that just lists files to create is not useful. A plan that specifies exact function signatures, cookie handler shapes, and test case descriptions is what actually makes the implementation phase fast. The more specific the plan, the less the implementation phase has to figure out on its own. I would spend more time in the Plan phase on the first pass rather than discovering gaps during implementation.

I also underestimated how much the Explore phase would benefit from Claude Code going to external sources. Since there was no existing code, the internet search for `@supabase/ssr` documentation was the most valuable part of the entire workflow. That single agent reading 41 pages of documentation produced findings that directly prevented two security mistakes from making it into the codebase. In future sprints where existing code does exist, I would still prompt Claude Code explicitly to also check the official documentation for any third party libraries involved, not just read the existing implementation.
