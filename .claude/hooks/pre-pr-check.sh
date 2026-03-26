#!/usr/bin/env bash
# Pre-PR hook: runs before every `gh pr create` Bash call.
# Injects the PR checklist into model context and gates on pre-checks passing.

set -euo pipefail

input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // ""')

# No-op for any command that is not a PR creation
echo "$cmd" | grep -q "gh pr create" || exit 0

# Resolve project root from this script's location (.claude/hooks/ → project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
cd "$PROJECT_ROOT"

echo "=== Pre-PR checks running ===" >&2

# Run all pre-checks sequentially
if yarn lint && yarn format:check && yarn test --coverage && yarn test:integration && yarn test:e2e; then
  # All checks passed — inject checklist reminder into model context
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: "MANDATORY PR CHECKLIST (PR-CHECKLIST.md) — complete ALL steps before writing the PR body:\nStep 1: gh issue view <N> — extract every acceptance criterion and test case\nStep 2: Validate each AC against the actual files on this branch — find specific code or test that satisfies it\nStep 3: Present a validation table with Pass/Fail for EVERY AC row and every test case row\nStep 4: ALL rows must be checked — any unchecked row is a blocker; fix it and re-validate\nStep 5: PR body must include: (a) detailed description of everything implemented and every significant decision, (b) all ACs listed with checked checkboxes [x], (c) all test cases listed with checked checkboxes [x]\nStep 6: STOP after gh pr create — never approve or merge your own PR; notify the user and await their review"
    }
  }'
else
  # One or more checks failed — block the PR creation
  jq -n '{"continue": false, "stopReason": "Pre-PR checks failed. Fix all lint, format, test, and coverage errors before creating the PR."}'
  exit 1
fi
