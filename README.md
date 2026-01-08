# Claude-Surf

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**VibeSurf integration for Claude Code** - Control real browsers, execute AI skills, run workflows, and integrate with external apps.

## Overview

Claude-Surf is a Claude Code plugin that bridges Claude with [VibeSurf](https://github.com/vibesurf-ai/VibeSurf), enabling powerful browser automation and web interaction capabilities.

### What You Can Do

- **Browser Control** - Navigate websites, interact with elements
- **AI Skills** - Search, crawl, extract data, summarize content
- **Workflows** - Execute pre-built automation workflows
- **App Integrations** - Gmail, GitHub, Slack, and 100+ apps via Composio/MCP
- **Browser-Use Agent** - Parallel multi-task automation using AI sub-agents

## Prerequisites

### 1. Claude Code
Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI.

### 2. VibeSurf
Install and run VibeSurf:

```bash
# Install VibeSurf
uv tool install vibesurf

# Start VibeSurf server
vibesurf
```

VibeSurf must be running on `http://127.0.0.1:9335` for Claude-Surf to work.

## Installation

### From GitHub Marketplace (Recommended)

```bash
# Add the marketplace
/plugin marketplace add vibesurf-ai/claude-surf

# Install the plugin
/plugin install surf
```

### Local Installation

```bash
# Clone repository
git clone https://github.com/vibesurf-ai/claude-surf
cd claude-surf

# Add to marketplace and install
/plugin marketplace add ./
/plugin install surf
```

**Restart Claude Code** to load the plugin.

## How It Works

This plugin uses **Claude Code's skill system** with a SessionStart hook:

1. **Session Start**: Hook checks VibeSurf health and injects surf skill content
2. **Auto-Detection**: Claude automatically loads surf skill for browser/automation tasks
3. **Direct API Access**: Claude can call VibeSurf's HTTP API directly

**No build process required** - pure markdown skills + minimal JavaScript.

## Skills Overview

The plugin provides these specialized skills:

### AI Skills
| Skill | Purpose |
|-------|---------|
| `search` | AI-powered web search |
| `fetch` | Fetch URL content as structured markdown |
| `js_code` | Auto-generate JS to extract lists/tables |
| `crawl` | Extract page content with LLM |
| `summary` | Summarize webpage |
| `finance` | Stock data from Yahoo Finance |
| `trend` | Trending news |
| `screenshot` | Page screenshots |

### Browser Skills
| Skill | Purpose |
|-------|---------|
| `browser` | Direct control (navigate, click, input, etc.) |
| `browser-use` | AI multi-step automation |

### Integration Skills
| Skill | Purpose |
|-------|---------|
| `website-api` | XiaoHongShu, Weibo, Zhihu, Douyin, YouTube |
| `workflows` | Pre-built automation sequences |
| `integrations` | Gmail, GitHub, Slack, 100+ apps |

## Quick Reference

| Goal | Use Skill |
|------|----------|
| Search web | `search` |
| Fetch URL content | `fetch` |
| Extract prices/products | `js_code` |
| Summarize page | `summary` |
| Stock data | `finance` |
| Navigate/click | `browser` |
| Fill form | `browser-use` |
| Send email | `integrations` |

## Best Practices

### Browser-Use Agent
- Be task-oriented: Describe WHAT you want, not HOW
- Use parallel for independent tasks
- Trust the agent to figure out steps

### Direct Browser Control
- Always call `get_browser_state` first
- Use element indices from browser state
- Tab IDs are last 4 characters of target IDs

### AI Skills
- `js_code` for lists/arrays (products, posts, listings)
- `crawl` for single-page content extraction
- `search` for AI-generated summaries

## Troubleshooting

| Error | Solution |
|-------|----------|
| VibeSurf not running | Run `vibesurf` |
| Element not found | Call `get_browser_state` first |
| Action not found | Check with VibeSurf API |
| Timeout | Simplify task or increase timeout |

## Project Structure

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
│   ├── surf/                # Main entry point
│   ├── search/              # AI web search
│   ├── fetch/               # Fetch URL content as markdown
│   ├── js_code/             # Structured data extraction
│   ├── crawl/               # Page content extraction
│   ├── summary/             # Page summarization
│   ├── finance/             # Stock data
│   ├── trend/               # Trending news
│   ├── screenshot/          # Screenshots
│   ├── browser/             # Direct browser control
│   ├── browser-use/         # AI automation
│   ├── website-api/         # Platform APIs
│   ├── workflows/           # Pre-built workflows
│   └── integrations/        # External apps
├── README.md
├── CLAUDE.md
└── LICENSE
```

## Architecture Notes

This plugin follows the **superpowers** architecture pattern:

- **No build system** - Pure markdown skills, no compilation
- **Hook-based injection** - SessionStart injects skill content
- **Frontmatter-driven** - `description` field defines triggers
- **Direct API access** - Claude calls VibeSurf HTTP API directly (no client wrapper needed)

## Contributing

Contributions welcome! This is a markdown-first plugin - edit skills directly and test.

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

- [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) - Browser automation framework
