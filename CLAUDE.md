# CLAUDE.md

## gstack (REQUIRED)

This project requires [gstack](https://github.com/garrytan/gstack) for all AI-assisted work. A PreToolUse hook (`.claude/hooks/check-gstack.sh`) enforces this.

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.claude/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING, install it and restart your AI coding tool:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

Do not skip skills, ignore gstack errors, or work around missing gstack.

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools. Use `~/.claude/skills/gstack/...` for gstack file paths.

Available gstack skills:

`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`
