#!/usr/bin/env bash
# PostToolUse hook: runs Prettier on any file written or edited by Edit/Write tools.

set -euo pipefail

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

# Skip if no file path
[ -z "$file_path" ] && exit 0

# Only format files that Prettier can handle
if echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx|json|md|css|html|yml|yaml)$'; then
  npx prettier --write "$file_path" >&2
fi
