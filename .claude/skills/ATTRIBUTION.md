# Attribution

Most skills in this folder come from **Superpowers** by Jesse Vincent,
licensed under MIT.

- Source: https://github.com/obra/superpowers
- License: see `SUPERPOWERS-LICENSE` (MIT, © 2025 Jesse Vincent)

Skills imported from Superpowers:

- brainstorming
- dispatching-parallel-agents
- executing-plans
- finishing-a-development-branch
- receiving-code-review
- requesting-code-review
- subagent-driven-development
- systematic-debugging
- test-driven-development
- using-git-worktrees
- verification-before-completion
- writing-plans
- writing-skills
- using-superpowers (injected at session start by `.claude/hooks/session-start`)

The `SessionStart` hook (`.claude/hooks/session-start`, wired in
`.claude/settings.json`) is adapted from Superpowers' own session-start hook.

## frontend-design

The `frontend-design` skill comes from Anthropic's official Claude Code plugins,
licensed under Apache 2.0.

- Author: Anthropic
- License: see `FRONTEND-DESIGN-LICENSE` (Apache License 2.0)

## architecture & system-design

The `architecture` and `system-design` skills come from Anthropic's engineering
skills for Claude Code.

- Author: Anthropic
- `architecture` — create/evaluate Architecture Decision Records (ADRs).
- `system-design` — design systems, services, APIs, data models, boundaries.

Skills you add yourself under `.claude/skills/<name>/SKILL.md` are covered by
the same automatic behaviour — the hook tells Claude to check *any* applicable
skill, so no hook changes are needed for new skills.
