# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude-Surf is a Claude Code plugin that integrates with VibeSurf, exposing browser automation, AI skills, workflows, and external app integrations through a **pure markdown skill system**.

**Key Dependency**: VibeSurf server must be running on `http://127.0.0.1:9335` for this plugin to function.

## Architecture

### Superpowers-Inspired Design

This plugin follows the **superpowers** architecture pattern:

- **No build system** - Pure markdown skills, no compilation
- **Hook-based injection** - SessionStart injects skill content
- **Frontmatter-driven** - `description` field defines triggers
- **Direct API access** - Claude calls VibeSurf HTTP API directly

### Project Structure

```
claude-surf/
├── .claude-plugin/
│   ├── plugin.json          # Plugin metadata
│   └── marketplace.json     # Marketplace configuration
├── hooks/
│   ├── hooks.json           # Hook configuration
│   ├── session-start.sh     # Health check + skill injection
│   └── run-hook.cmd         # Cross-platform wrapper
├── skills/
│   ├── surf/                # Main entry skill (auto-injected)
│   ├── search/              # AI web search
│   ├── js_code/             # Structured data extraction
│   ├── crawl/               # Page content extraction
│   ├── summary/             # Page summarization
│   ├── finance/             # Stock data
│   ├── trend/               # Trending news
│   ├── screenshot/          # Screenshots
│   ├── browser/             # Direct browser control (21 actions)
│   ├── browser-use/         # AI multi-step automation
│   ├── website-api/         # Platform APIs (XiaoHongShu/etc)
│   ├── workflows/           # Pre-built workflows
│   └── integrations/        # External apps (Gmail/GitHub/etc)
├── README.md
└── CLAUDE.md
```

## Skill System

### Auto-Injected Skill

**`surf`** - Main entry point, automatically injected via SessionStart hook
- Provides navigation to all other skills
- Contains VibeSurf API documentation
- No manual invocation needed

### On-Demand Skills

All other 12 skills are loaded via the **Skill tool** when needed:
- `search` - AI web search
- `js_code` - Extract structured data with auto-generated JS
- `crawl` - Extract page content
- `summary` - Summarize webpages
- `finance` - Stock data from Yahoo Finance
- `trend` - Trending news
- `screenshot` - Page screenshots
- `browser` - Direct browser control
- `browser-use` - AI multi-step automation
- `website-api` - Social platform APIs
- `workflows` - Pre-built automations
- `integrations` - Gmail/GitHub/Slack/etc

### Skill Frontmatter

Each `SKILL.md` file has YAML frontmatter:

```yaml
---
name: skill-name
description: Use when [triggering conditions and symptoms]
---
```

**Critical**: The `description` field determines when Claude loads the skill. It should:
- Start with "Use when..."
- Describe triggering conditions, NOT workflow
- Include specific symptoms and examples

## VibeSurf API

VibeSurf exposes three core HTTP endpoints at `http://127.0.0.1:9335`:

### 1. List Available Actions
```bash
GET /api/tool/search?keyword={optional_keyword}
```
Returns all available VibeSurf actions.

### 2. Get Action Parameters
```bash
GET /api/tool/{action_name}/params
```
Returns JSON schema for the action's parameters.

### 3. Execute Action
```bash
POST /api/tool/execute
Content-Type: application/json

{
  "action_name": "action_name_here",
  "parameters": {
    // action-specific parameters
  }
}
```

### Standard Workflow

1. **Discover actions** → `GET /api/tool/search`
2. **Get parameters** → `GET /api/tool/{action_name}/params`
3. **Execute** → `POST /api/tool/execute`

## Plugin Configuration

### Claude Code Plugin Structure

**`.claude-plugin/plugin.json`** - Plugin metadata
```json
{
  "name": "surf",
  "description": "VibeSurf integration - Control browsers, automate workflows...",
  "version": "1.0.0"
}
```

**`.claude-plugin/marketplace.json`** - Marketplace configuration
```json
{
  "name": "claude-surf",
  "plugins": [{
    "name": "surf",
    "source": "./"
  }]
}
```

**`hooks/hooks.json`** - SessionStart hook configuration
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup|resume|clear|compact",
      "hooks": [{
        "type": "command",
        "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start.sh"
      }]
    }]
  }
}
```

### Health Check Hook

**`hooks/session-start.sh`** - Runs on session start:
1. Checks if VibeSurf is running (`curl http://127.0.0.1:9335/health`)
2. If running: Injects `surf` skill content to context
3. If not running: Displays warning with installation instructions

**Non-blocking**: Hook timeout is 3 seconds, won't prevent session start.

## Skill Reference

### AI Skills (7)

| Skill | Action | Purpose |
|-------|--------|---------|
| `search` | `skill_search` | AI-powered web search (Gemini) |
| `js_code` | `skill_code` | Auto-generate JS to extract lists/tables |
| `crawl` | `skill_crawl` | Extract page content with LLM |
| `summary` | `skill_summary` | Summarize webpage |
| `finance` | `skill_finance` | Stock data from Yahoo Finance |
| `trend` | `skill_trend` | Trending news from NewsNow |
| `screenshot` | `skill_screenshot` | Take screenshots |

### Browser Skills (2)

| Skill | Actions | Purpose |
|-------|---------|---------|
| `browser` | 21 actions (browser.*) | Direct control (navigate, click, input, etc.) |
| `browser-use` | `execute_browser_use_agent` | AI multi-step automation |

### Integration Skills (3)

| Skill | Actions | Purpose |
|-------|---------|---------|
| `website-api` | 2 actions | XiaoHongShu, Weibo, Zhihu, Douyin, YouTube |
| `workflows` | 2 actions | Pre-built automation sequences |
| `integrations` | 4 actions | Gmail, GitHub, Slack, 100+ apps |

## Important VibeSurf Actions

### Browser-Use Agent (Most Powerful)

**Action**: `execute_browser_use_agent`

Launches autonomous AI agents for multi-step tasks:
- Supports parallel execution (unique tab_id per agent)
- Task-oriented: describe goal, agent figures out steps
- Use for: Form filling, multi-site research, complex extraction

**When to use**: Any task with >2 steps or multiple tabs

### Browser Actions

All `browser.*` actions for direct control:
- `browser.navigate` - Go to URL
- `browser.click` - Click element
- `browser.input` - Type text
- `browser.switch` - Switch tabs
- `browser.extract` - LLM data extraction
- `browser.screenshot` - Take screenshot
- And 15 more...

### Extra Tools (Composio/MCP)

- `get_all_toolkit_types` - List available apps
- `search_tool` - Find tools in toolkit
- `get_tool_info` - Get tool schema
- `execute_extra_tool` - Run app action

## Testing the Plugin

### Local Testing Workflow

1. **Start VibeSurf**: `vibesurf`
2. **Install plugin**: `/plugin install ./` (from project root)
3. **Restart Claude Code**
4. **Test**: Ask Claude to search web, navigate browser, etc.

### Verifying VibeSurf Connection

```bash
# Check if VibeSurf is running
curl http://127.0.0.1:9335/health

# List all available actions
curl http://127.0.0.1:9335/api/tool/search

# Get parameters for specific action
curl http://127.0.0.1:9335/api/tool/skill_search/params
```

## Documentation Sync

When modifying functionality:
1. Update relevant `skills/*/SKILL.md` - affects Claude's behavior
2. Update `README.md` - user-facing documentation
3. Keep skill descriptions consistent with actual VibeSurf API
4. Test with Claude Code to verify skill loading

## Key Design Patterns

### Error Handling

VibeSurf returns structured responses:
```json
{
  "success": boolean,
  "result": any,
  "extracted_content": string,
  "long_term_memory": string,
  "attachments": string[]
}
```

Handle errors by checking `success` field and `result` for error messages.

### Action Discovery Pattern

Before executing unknown actions:
1. Search for action: `GET /api/tool/search?keyword=...`
2. Get parameters: `GET /api/tool/{action}/params`
3. Build request: `POST /api/tool/execute`

### Skill Decision Making

When user makes a browser/automation request:
1. Consult `surf` skill (already in context)
2. `surf` skill points to appropriate specialized skill
3. Use Skill tool to load that skill
4. Follow skill's guidance to call VibeSurf API
