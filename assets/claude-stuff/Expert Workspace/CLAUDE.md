# Claude Project Instructions

Before planning or editing, read and follow `asurion-expert-workspace-llm-instructions.md` in full.

Additional Claude Code rules:

1. Inspect the repository, relevant source files, and current git status before making changes.
2. Preserve all uncommitted user work. Do not reset, discard, or overwrite unrelated changes.
3. For complex features, create a concise, reviewable implementation plan and wait for user approval before broad changes unless the user explicitly asks you to proceed.
4. For small, contained tasks, do the work directly without creating unnecessary process.
5. Use existing architecture, components, tokens, and conventions before adding new patterns or dependencies.
6. Keep changes scoped and reviewable. Do not refactor unrelated code.
7. Use realistic synthetic data and never add secrets or customer PII.
8. Cover relevant loading, error, stale, retry, interrupted, and success states.
9. Run the relevant formatter, lint, typecheck, tests, and build. Never claim validation that was not performed.
10. Finish with a concise summary of files changed, behavior changed, validation performed, and anything not verified.
