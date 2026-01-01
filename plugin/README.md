# Claude-Surf

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**VibeSurf integration for Claude Code** - Control real browsers, execute AI skills, run workflows, and integrate with external apps directly from Claude.

## Overview

Claude-Surf is a Claude Code plugin that bridges Claude with [VibeSurf](https://github.com/vibesurf-ai/VibeSurf), enabling powerful browser automation and web interaction capabilities.

### What You Can Do

- 🌐 **Browser Control** - Navigate websites, interact with elements, extract data
- 🤖 **AI Skills** - Search, crawl, code generation, content summarization
- 🔄 **Workflows** - Execute pre-built automation workflows
- 🔌 **App Integrations** - Gmail, GitHub, Slack, and 100+ apps via Composio/MCP
- ⚡ **Browser-Use Agent** - Parallel multi-task automation using AI sub-agents

## Prerequisites

### 1. Claude Code
Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI:

```bash
# Installation instructions at https://docs.anthropic.com/en/docs/claude-code
```

### 2. VibeSurf
Install and run VibeSurf:

```bash
# Install VibeSurf
uv tool install vibesurf

# Start VibeSurf server
vibesurf
```

VibeSurf must be running on `http://127.0.0.1:9335` for Claude-Surf to work.

**Important**: Claude Code will check VibeSurf status on startup and warn you if it's not running.

## Installation

### Option 1: From Marketplace (Coming Soon)

```bash
/plugin marketplace add vibesurf-ai/claude-surf
/plugin install claude-surf
```

### Option 2: Local Installation

```bash
# 1. Clone repository
git clone https://github.com/vibesurf-ai/claude-surf
cd claude-surf

# 2. Install dependencies and build
cd skills/surf
npm install
npm run build
cd ../..

# 3. Add marketplace and install plugin (in Claude Code)
/plugin marketplace add ./
/plugin install claude-surf
```

**Installation Steps**:
1. **Build the plugin**: Run `npm install` and `npm run build` in `skills/surf/`
2. **Add marketplace**: Use `/plugin marketplace add ./` from the project root directory
3. **Install plugin**: Use `/plugin install claude-surf` to install from the local marketplace
4. **Restart Claude Code**: Restart to ensure the plugin loads correctly

**Verification**:
```bash
# Check installed plugins
/plugin

# Test the surf command
/surf
```

## Usage

### Automatic Mode (Recommended)

Claude automatically detects when to use VibeSurf tools based on your request:

```
Development & Debugging:
> I'm getting error "MODULE_NOT_FOUND", search for latest solutions
Claude uses skill_search to find recent fixes beyond documentation

> WebFetch failed for this API endpoint, get the data manually
Claude uses navigate + skill_crawl to bypass fetch limitations

Automation & Workflows:
> Create a GitHub release for version 2.0.0 with these release notes
Claude uses execute_browser_use_agent or Composio GitHub integration

> Fill out this job application form with my resume details
Claude uses execute_browser_use_agent for form automation

Data Extraction:
> Extract all product prices from this Amazon search page
Claude uses skill_code for structured list extraction

> Compare pricing across these 3 competitor websites
Claude uses execute_browser_use_agent with parallel tasks

Batch Operations:
> Download documentation from these 5 URLs
Claude uses execute_browser_use_agent with parallel execution
```

### Manual Mode

#### List All Actions

```
/surf
```

Shows categorized list of all available VibeSurf actions:
- Browser Control
- AI Skills
- Workflows
- Extra Tools (Composio/MCP)
- Other

#### Execute Specific Action

```
/surf:{action_name}
```

Examples:
- `/surf:get_browser_state` - See current browser tabs and page state
- `/surf:skill_search` - AI-powered web search
- `/surf:search_workflows` - Find available workflows
- `/surf:execute_extra_tool` - Use Composio/MCP integrations

Claude will interactively prompt for any required parameters.

## Quick Start Examples

### Example 1: Browser Automation

```
> /surf:get_browser_state

Claude shows current tabs, DOM tree, and screenshot path

> /surf:navigate

Claude prompts for URL
> https://example.com

Claude navigates to the URL

> /surf:click_element

Claude prompts for element index (from browser state)
> 5

Claude clicks the element
```

### Example 2: AI-Powered Search

```
> /surf:skill_search

Claude prompts for query
> latest developments in AI agents

Claude prompts for rank
> true

Claude returns AI-generated summary with sources
```

### Example 3: Workflow Execution

```
> /surf:search_workflows

Claude prompts for keywords
> video download

Claude shows matching workflows with parameters

> /surf:execute_workflow

Claude prompts for workflow ID
> 1234

Claude prompts for tweak parameters (optional)
> {"ComponentID-123": {"url": "https://youtube.com/watch?v=..."}}

Claude executes the workflow
```

### Example 4: App Integration

```
> /surf:get_all_toolkit_types

Claude lists Composio and MCP toolkits

> /surf:search_extra_tool

Claude prompts for toolkit type
> gmail

Claude prompts for search filters
> send

Claude shows Gmail send-related actions

> /surf:execute_extra_tool

Claude prompts for tool name and parameters
> Tool: cpo.gmail.send_email
> Params: {"to": "john@example.com", "subject": "Test", "body": "Hello"}

Claude sends the email via Composio
```

## Key Features

### 1. Intelligent Browser Control
- Get comprehensive browser state (tabs, DOM, screenshot)
- Interact with elements using index references
- Multi-tab support
- Screenshot and HTML extraction

### 2. AI Skills
- **Advanced Search**: AI-generated summaries with source aggregation
- **Smart Crawling**: LLM-powered structured data extraction
- **Code Generation**: Generate and execute JavaScript on webpages
- **Content Summary**: AI summarization of webpage content
- **Finance Data**: Comprehensive stock data from Yahoo Finance
- **Trending News**: Real-time news from multiple sources

### 3. Workflow System
- Search pre-built workflows by keyword or ID
- View adjustable parameters (tweaks)
- Execute with custom values
- Results include file paths and detailed outputs

### 4. External App Integrations
- **Composio**: 100+ app integrations (Gmail, GitHub, Slack, Notion, etc.)
- **MCP**: Custom MCP server integrations
- Discover tools, view schemas, execute actions
- Direct API access (faster than browser automation)

## Action Categories

### Browser Control
- `get_browser_state` - Current tabs, DOM, screenshot
- `navigate` - Go to URL
- `click_element` - Click by index
- `input_text` - Type into fields
- `scroll` - Scroll pages
- `take_screenshot` - Capture screenshots
- And more...

### Browser-Use Agent
- `execute_browser_use_agent` - Launch AI sub-agents for parallel multi-task automation

### AI Skills
- `skill_search` - AI-powered search
- `skill_crawl` - Extract structured data
- `skill_code` - Generate/execute JavaScript (recommended for extracting lists of items)
- `skill_summary` - Summarize content
- `skill_finance` - Stock data
- `skill_trend` - Trending news

### Workflows
- `search_workflows` - Find workflows
- `execute_workflow` - Run workflows with tweaks

### Extra Tools
- `get_all_toolkit_types` - List toolkits
- `search_extra_tool` - Find tools in toolkit
- `get_extra_tool_info` - Get tool schema
- `execute_extra_tool` - Execute tool action

## Best Practices

### Browser-Use Agent (Recommended for Complex Tasks)
- Use for any task with >2 steps or multiple tabs
- Describe the goal, not the steps (agent figures it out)
- Parallel tasks run simultaneously for efficiency
- Trust the agent - it's autonomous and intelligent

### Browser Interactions
1. Always call `get_browser_state` first to see available elements
2. Use element indices from browser state for precise interaction
3. Tab IDs are the last 4 characters of target IDs
4. Take screenshots for visual debugging

### AI Skills
- Use `skill_search` for quick information retrieval
- Use `skill_crawl` for single-page structured data extraction
- Use `skill_code` for extracting lists of structured data (all posts, products, listings, etc.)
  - Automatically generates optimized JavaScript code
  - Perfect for scraping multiple items with the same structure
- Specify `tab_id` for multi-tab scenarios

### Workflows
- Search workflows before execution to see parameters
- Use `tweak_params` to customize behavior
- Workflow results often include file paths

### App Integrations
- Prefer Composio tools over browser automation for API tasks
- Use parameter filters to reduce response noise
- Check authentication if errors occur

## Troubleshooting

### VibeSurf Not Running

**Error**: "VibeSurf server is not running"

**Solution**:
```bash
vibesurf  # Start VibeSurf server
```

### Element Not Found

**Error**: "Element index N not found"

**Solution**: Run `get_browser_state` first to see current indices

### Action Not Found

**Error**: "Action 'X' not found"

**Solution**: Run `/surf` to see all available actions

### Authentication Errors

**Error**: Composio/MCP authentication failed

**Solution**: Check credentials configuration in VibeSurf

### Connection Timeout

**Error**: Request timeout

**Solution**: Increase timeout in client options or check network

## Configuration

### Default Settings

```typescript
{
  baseUrl: 'http://127.0.0.1:9335',
  timeout: 120000,  // 120 seconds
  retries: 3,
  retryDelay: 1000  // 1 second
}
```

### Custom Configuration

Modify `skills/surf/client/vibesurf-client.ts` to customize settings.

## Development

### Setup

```bash
cd skills/surf
npm install
npm run build
```

### Testing

```bash
# List actions
npm run surf

# Execute action (example)
npm run surf surf:get_browser_state
```

### Project Structure

```
claude-surf/
├── .claude-plugin/           # Plugin metadata
│   ├── marketplace.json
│   └── plugin.json
├── skills/surf/              # Main skill
│   ├── SKILL.md             # Skill definition
│   ├── client/              # VibeSurf client
│   │   ├── types.ts
│   │   └── vibesurf-client.ts
│   ├── commands/            # Command handlers
│   │   ├── surf.ts
│   │   └── utils.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

- [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) - Browser automation framework
