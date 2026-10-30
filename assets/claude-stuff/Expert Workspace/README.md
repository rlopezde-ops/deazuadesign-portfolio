# Expert Workspace LLM Instruction Kit

This kit contains one canonical instruction file and two lightweight adapters.

## Files

- `asurion-expert-workspace-llm-instructions.md`
  - The full, tool-agnostic operating manual.
  - Keep this file in the project root or another stable, documented location.

- `CLAUDE.md`
  - Place in the project root for Claude Code.
  - It directs Claude to load the canonical operating manual and adds Claude Code execution rules.

- `asurion-expert-workspace.mdc`
  - Place at `.cursor/rules/asurion-expert-workspace.mdc` for Cursor.
  - It is configured as an always-applied project rule and directs Cursor to load the canonical operating manual.

## Recommended project structure

```text
project-root/
|-- asurion-expert-workspace-llm-instructions.md
|-- CLAUDE.md
|-- .cursor/
|   `-- rules/
|       `-- asurion-expert-workspace.mdc
`-- docs/
    `-- ai-context/
        |-- ExpertWorkspace-Design principles.pdf
        |-- expert-workspace-prototype-16x9.mp4
        |-- asurion_guidelines.md
        `-- research/
```

The canonical instructions tell the model to inspect current source materials rather than rely on remembered versions. Update the file when the role, principles, product strategy, design system, or working process changes.

## Suggested use

1. Put the canonical file in the project root.
2. Add the adapter for the tool you use.
3. Put current design principles, prototype references, guidelines, and research somewhere the agent can read.
4. Begin tasks with the project-specific goal, target path, source links, constraints, and expected output.
5. For large work, review the model's plan before it begins broad implementation.
