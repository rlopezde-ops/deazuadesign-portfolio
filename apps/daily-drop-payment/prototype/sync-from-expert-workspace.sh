#!/usr/bin/env bash
#
# Re-syncs vendor/ from a local expert-workspace checkout, or (with --check) reports how far the
# vendored tree has drifted from it.
#
#   ./prototype/sync-from-expert-workspace.sh --check   # report drift, change nothing
#   ./prototype/sync-from-expert-workspace.sh           # pull upstream over vendor/
#
# The nine files listed in prototype/DEVIATIONS.md are deliberately different and are skipped in
# both modes. After a real sync, re-read DEVIATIONS.md: any newly-introduced `import.meta.env` or
# network call has to be handled again.

set -euo pipefail

SRC="${EXPERT_WORKSPACE:-$HOME/Documents/GitHub/expert-workspace}"
APP="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DST="$APP/vendor"
MODE="${1:-sync}"

if [ ! -d "$SRC" ]; then
  echo "expert-workspace not found at: $SRC" >&2
  echo "Set EXPERT_WORKSPACE to override." >&2
  exit 1
fi

# Deliberate stand-ins — never overwritten, never reported as drift.
STAND_INS=(
  "expert-ui/src/expert-hub/data/usePayMetrics.ts"
  "expert-ui/src/expert-hub/data/useSchedule.ts"
  "expert-ui/src/expert-hub/right-panel/useHubPanelStore.ts"
  "expert-ui/src/expert-hub/right-panel/useLeaderboardSelectionStore.ts"
  "expert-ui/src/components/header/HeaderControls.tsx"
  "packages/theme/overrides/components.module.css"
  "packages/sales-tools/src/api/getCurrentLeaderboard.ts"
  "packages/sales-tools/src/sales-context/SalesContext.tsx"
  "packages/sales-tools/src/modules/widget-container/leaderboard/hooks/useLeaderboard.ts"
)

is_stand_in() {
  local rel="$1"
  for s in "${STAND_INS[@]}"; do [ "$s" = "$rel" ] && return 0; done
  return 1
}

# Map a vendored path back to its upstream location.
upstream_path() {
  case "$1" in
    expert-ui/*) echo "$SRC/apps/${1}" ;;
    packages/*)  echo "$SRC/${1}" ;;
    *)           echo "" ;;
  esac
}

drift=0
verbatim=0
skipped=0
missing=0

while IFS= read -r abs; do
  rel="${abs#"$DST"/}"
  if is_stand_in "$rel"; then skipped=$((skipped + 1)); continue; fi

  up="$(upstream_path "$rel")"
  if [ -z "$up" ] || [ ! -f "$up" ]; then
    echo "  no upstream counterpart: $rel"
    missing=$((missing + 1))
    continue
  fi

  if cmp -s "$up" "$abs"; then
    verbatim=$((verbatim + 1))
  else
    drift=$((drift + 1))
    if [ "$MODE" = "--check" ]; then
      echo "  DRIFTED: $rel"
    else
      cp "$up" "$abs"
      echo "  updated: $rel"
    fi
  fi
done < <(find "$DST" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' \) | sort)

echo
echo "verbatim: $verbatim   drifted: $drift   documented stand-ins skipped: $skipped   unmatched: $missing"

if [ "$MODE" = "--check" ] && [ "$drift" -gt 0 ]; then
  echo "Run without --check to pull upstream over the drifted files." >&2
  exit 1
fi
