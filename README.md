# Claude-Surf: A Claude Code plugin for controlling browser and real-time previewing
[![Discord](https://img.shields.io/badge/Discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/86SPfhRVbk)
[![WeChat](https://img.shields.io/badge/WeChat-Group-07C160?logo=wechat&logoColor=white)](#-join-our-community)
[![WarmShao](https://img.shields.io/twitter/follow/warmshao?style=social)](https://x.com/warmshao)


[English](README.md) | [简体中文](README_zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

Choose one of the following installation methods:

#### Local Installation (Control Local Browser)
Use this method to control your local browser:

```bash
# Install VibeSurf
uv tool install vibesurf

# Start VibeSurf server
vibesurf
```

#### Docker Installation (Control Sandbox Browser)
Use this method to control a sandboxed browser in a container:

```bash
# Pull the image
docker pull ghcr.io/vibesurf-ai/vibesurf:latest

# Run the container
docker run --name vibesurf -d --restart unless-stopped \
  -p 9335:9335 \
  -p 6080:6080 \
  -p 5901:5901 \
  -v ./data:/data \
  -e IN_DOCKER=true \
  -e VIBESURF_WORKSPACE=/data/vibesurf_workspace \
  -e RESOLUTION=1440x900x24 \
  -e VNC_PASSWORD=vibesurf \
  --shm-size=4g \
  --cap-add=SYS_ADMIN \
  ghcr.io/vibesurf-ai/vibesurf:latest
```

VibeSurf must be running for Claude-Surf to work.

**Configuration**: By default, Claude-Surf connects to `http://127.0.0.1:9335`. You can customize this by setting the `VIBESURF_ENDPOINT` environment variable before starting Claude Code:

```bash
# Linux/macOS
export VIBESURF_ENDPOINT=http://192.168.1.100:9335

# Windows PowerShell
$env:VIBESURF_ENDPOINT="http://192.168.1.100:9335"

# Windows CMD
set VIBESURF_ENDPOINT=http://192.168.1.100:9335
```

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

## VSCode Integration with Real-Time Browser Preview

When using the Docker installation, you can control and preview the browser directly in VSCode alongside Claude Code:

### Open the Internal Browser

1. Open the Command Palette:
   - Windows/Linux: `Ctrl + Shift + P`
   - macOS: `Cmd + Shift + P`
2. Type and select: `Simple Browser: Show`
3. Enter the URL: `http://127.0.0.1:6080/`
4. Press Enter

### Adjust VNC Screen Size

1. Click the **Settings** icon (gear button) on the left sidebar of the VNC viewer
2. Under **Scaling Mode**, select **Local Scaling**
3. This will allow the VNC screen to automatically resize to fit the window

Now you can see Claude Code controlling the browser in real-time within VSCode!

### Demo Video

<video src="https://github.com/user-attachments/assets/e46099cf-0e10-4088-8f10-b9d175f44f77" controls="controls">Your browser does not support playing this video!</video>


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
