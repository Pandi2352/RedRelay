@AGENTS.md

## Claude Code specifics

- Skills live in `.claude/skills/`; subagents in `.claude/agents/`. After editing either, run
  `node scripts/sync-agents.mjs` so Antigravity gets the same content.
- Use the `reuse-reviewer` subagent after any change that adds new files, and `ui-reviewer` after UI changes.
