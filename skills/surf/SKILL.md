---
name: surf
description: Use when user asks to browse websites, automate browser tasks, fill forms, extract webpage data, search web information, or interact with external apps. This is the main entry point that delegates to specialized skills.
---

# Surf - VibeSurf Browser Automation

## Overview

Control real browsers through VibeSurf. This skill delegates to specialized sub-skills.

> **🚨 VIBESURF STATUS (Auto-detected at session start)**
>
> Check the `<SURF_SKILLS>` status at the TOP of this context:
> - ✅ **Status: running** → Proceed with surf skills
> - ❌ **Status: not_running** → Ask user to run `vibesurf` (NEVER run it yourself)
>
> **Check manually:** `curl $VIBESURF_ENDPOINT/health` (default: http://127.0.0.1:9335)

## How to Call VibeSurf API

VibeSurf exposes three core HTTP endpoints. All requests go to the configured endpoint (check the status line above for the actual endpoint):

### 1. List Available Actions
```bash
GET $VIBESURF_ENDPOINT/api/tool/search?keyword={optional_keyword}
```
Returns all available VibeSurf actions.

### 2. Get Action Parameters
```bash
GET $VIBESURF_ENDPOINT/api/tool/{action_name}/params
```
Returns JSON schema for the action's parameters.

### 3. Execute Action
```bash
POST $VIBESURF_ENDPOINT/api/tool/execute
Content-Type: application/json

{
  "action_name": "action_name_here",
  "parameters": {
    // action-specific parameters
  }
}
```

**Workflow:**
1. Search for action → Get action name
2. Get params schema → See required/optional parameters
3. Execute → Call with parameters

> **⚠️ CRITICAL: Parameter Error Handling**
>
> **ALWAYS** call `GET /api/tool/{action_name}/params` before executing ANY action if you are unsure about parameters.
>
> **When you encounter a parameter error:**
> 1. **STOP** - Do not guess or make up parameters
> 2. **CALL** `GET /api/tool/{action_name}/params` to get the exact schema
> 3. **READ** the response to identify required vs optional parameters
> 4. **RETRY** with correct parameters
>
> Never blindly retry with incorrect parameters. Always fetch the schema first!

## Which Skill to Use

| Task Type | Use Skill | Action Name |
|-----------|-----------|-------------|
| AI web search | `search` | `skill_search` |
| Fetch URL content as markdown | `fetch` | `skill_fetch` |
| Extract lists/tables | `js_code` | `skill_code` |
| Extract page content | `crawl` | `skill_crawl` |
| Summarize page | `summary` | `skill_summary` |
| Stock/financial data | `finance` | `skill_finance` |
| Trending news | `trend` | `skill_trend` |
| Screenshot | `screenshot` | `skill_screenshot` |
| Precise browser control | `browser` | `browser.*` actions |
| Task-oriented automation (sub-agent) | `browser-use` | `execute_browser_use_agent` |
| Social Media Platform APIs | `website-api` | `get_website_api_params`, `call_website_api` |
| Pre-built workflows | `workflows` | `search_workflows`, `execute_workflow` |
| Gmail/GitHub/Slack | `integrations` | `get_all_toolkit_types`, `execute_extra_tool` |
| LLM profile settings | `config-llm` | `config/llm-profiles/*` |
| MCP server config | `config-mcp` | `config/mcp-profiles/*` |
| VibeSurf key/workflows | `config-vibesurf` | `vibesurf/verify-key`, `vibesurf/import-workflow` |
| Composio key/toolkits | `config-composio` | `composio/verify-key`, `composio/toolkits` |

## Configuration Skills

Use these skills to configure VibeSurf settings:

| Config Task | Skill | When to Use |
|-------------|-------|-------------|
| Add/switch LLM | `config-llm` | Manage AI model profiles (OpenAI, Anthropic, etc.) |
| Add MCP server | `config-mcp` | Configure MCP integrations for extended tools |
| VibeSurf API key | `config-vibesurf` | Set up API key, import/export workflows |
| Enable Gmail/GitHub/etc | `config-composio` | Configure Composio toolkits and OAuth |

**Note:** After configuring Composio or MCP tools, use them through the `integrations` skill (see tool naming: `cpo.{toolkit}.{action}` or `mcp.{server}.{action}`).

## Decision Flow

```
Browser/Web Task
│
├─ Need to search for information/bug/issue? → search (skill_search) [PREFERRED]
│  Examples: "Search for solutions to [bug name]", "Find latest info about [topic]"
│  Fallback: If skill_search doesn't find complete info → browser.search + browser.click + extract/summary/crawl
│
├─ Need to fetch URL content directly? → fetch (skill_fetch)
│  Examples: "Fetch content from [URL]", "Get documentation at [URL]", "Read this webpage"
│  Use for: Getting structured markdown from any URL without browser interaction
│
├─ Need to open website? → browser (browser.navigate)
│  Examples: "Open documentation site", "Go to [URL]", "Check this page"
│
├─ Need to extract data?
│  ├─ Lists/tables/repeated items? → js_code (skill_code)
│  Examples: "Extract all product prices", "Get all post titles"
│  └─ Main content? → crawl (skill_crawl)
│  Examples: "Get the article content", "Extract main section"
│
├─ Need summary? → summary (skill_summary)
│  Examples: "Summarize this page", "What's this about?"
│
├─ Stock/finance data? → finance (skill_finance)
│  Examples: "Stock price for AAPL", "Financial data for [company]"
│
├─ Trending news? → trend (skill_trend)
│  Examples: "What's trending", "Hot topics"
│
├─ Screenshot? → screenshot (skill_screenshot)
│  Examples: "Take a screenshot", "Show me the page"
│
├─ Need precise control or step-by-step operations? → browser (browser.*)
│  Examples: "Click the button", "Type in the field", "Scroll down", "Navigate then click"
│  Use for: Any browser task where you want explicit control over each action
│
├─ Debug/test website or monitor logs? → browser (debugging actions)
│  Examples: "Monitor console logs", "Capture network traffic", "Debug this page"
│  Workflow: start_console_logging/start_network_logging → perform actions → stop_*_logging
│  Use cases: Website testing, frontend/backend debugging, reverse engineering
│
├─ Complex task-oriented automation? → browser-use (execute_browser_use_agent)
│  Examples: "Fill out this form", "Extract data from multiple pages", "Login and check dashboard"
│  Use for: Complex tasks where describing the goal is easier than specifying steps
│  Fallback: If browser-use fails → use browser with get_browser_state loop
│
├─ Platform API (XiaoHongShu/Youtube/etc)? → website-api
│  Examples: "Get XiaoHongShu posts", "Call Weibo API"
│
├─ External app (Gmail/Google Calendar/GitHub)? → integrations
│  Examples: "Send email via Gmail", "Create GitHub PR", "Post to Slack"
│
└─ Pre-built workflow? → workflows
│  Examples: "Run video download workflow", "Execute auto-login workflow"
│
├─ Need to configure LLM/MCP/VibeSurf/Composio? → config-* skills
│  Examples: "Add OpenAI API key", "Enable Gmail toolkit", "Import workflow"
│  - LLM profiles → config-llm
│  - MCP servers → config-mcp
│  - VibeSurf key/workflows → config-vibesurf
│  - Composio key/toolkits → config-composio
```

## Quick Reference

| Goal | Skill | Action |
|------|-------|--------|
| Search web | `search` | `skill_search` |
| Fetch URL content | `fetch` | `skill_fetch` |
| Extract prices/products | `js_code` | `skill_code` |
| Get main content | `crawl` | `skill_crawl` |
| Summarize page | `summary` | `skill_summary` |
| Stock data | `finance` | `skill_finance` |
| Hot topics | `trend` | `skill_trend` |
| Take screenshot | `screenshot` | `skill_screenshot` |
| Click/navigate/type | `browser` | `browser.click`, `browser.navigate`, etc. |
| Task-oriented automation | `browser-use` | `execute_browser_use_agent` (fallback to `browser` if fails) |
| Social Media Platform APIs | `website-api` | `call_website_api` |
| Send email | `integrations` | `execute_extra_tool` |
| Run workflow | `workflows` | `execute_workflow` |
| Configure LLM profiles | `config-llm` | `config/llm-profiles/*` |
| Configure MCP servers | `config-mcp` | `config/mcp-profiles/*` |
| Configure VibeSurf key | `config-vibesurf` | `vibesurf/verify-key` |
| Enable Composio toolkits | `config-composio` | `composio/toolkits` |

## Common Patterns

| Request | Use Skill | Action |
|---------|-----------|--------|
| "Search for X" | `search` | `skill_search` (preferred) |
| "Search for bug/issue" | `search` first, fallback to `browser` | `skill_search`, then `browser.search` + extract if needed |
| "Fetch content from [URL]" | `fetch` | `skill_fetch` |
| "Get documentation at [URL]" | `fetch` | `skill_fetch` |
| "Read this webpage" | `fetch` | `skill_fetch` |
| "Extract all prices" | `js_code` | `skill_code` |
| "Summarize this page" | `summary` | `skill_summary` |
| "Stock info for AAPL" | `finance` | `skill_finance` |
| "What's trending" | `trend` | `skill_trend` |
| "Take a screenshot" | `screenshot` | `skill_screenshot` |
| "Navigate and click" | `browser` | `browser.navigate`, `browser.click` |
| "Fill out this form" | `browser-use` or `browser` | `execute_browser_use_agent` (or manual `browser` operations) |
| "Get XiaoHongShu posts" | `website-api` | `call_website_api` |
| "Get Youtube video content or transcript" | `website-api` | `call_website_api` |
| "Send Gmail" | `integrations` | `execute_extra_tool` |
| "Run video download" | `workflows` | `execute_workflow` |
| "Debug console logs" | `browser` | `browser.start_console_logging` → actions → `browser.stop_console_logging` |
| "Monitor network traffic" | `browser` | `browser.start_network_logging` → actions → `browser.stop_network_logging` |
| "Test this website" | `browser` | Use console/network logging actions |
| "Configure LLM" | `config-llm` | `config/llm-profiles` endpoints |
| "Add MCP server" | `config-mcp` | `config/mcp-profiles` endpoints |
| "Set VibeSurf API key" | `config-vibesurf` | `vibesurf/verify-key` |
| "Import workflow" | `config-vibesurf` | `vibesurf/import-workflow` |
| "Enable Gmail/GitHub" | `config-composio` | `composio/toolkits` + toggle endpoints |

## Error Handling

| Error | Solution |
|-------|----------|
| VibeSurf not running | **Check status in context** (SessionStart hook already detected)<br>**If not_running**: Inform user to run `vibesurf`<br>**NEVER** run the command yourself |
| Don't know which skill | Read skill descriptions above |
| Action not found | Call `GET /api/tool/search` to list all actions |
| Wrong parameters | Call `GET /api/tool/{action_name}/params` to see schema |
| browser-use fails or gets stuck | Fallback to `browser`: use `get_browser_state` → `browser.{action}` → repeat loop |
| LLM/Crawl/Summary errors | **Cause**: No LLM profile configured<br>**Solution**: Use `config-llm` to add an LLM profile first |
| Integration tools empty/not found | **Cause**: Composio/MCP not configured<br>**Solution**: Use `config-composio` or `config-mcp` to enable toolkits first |

## VibeSurf Status (Auto-Detected at Session Start)

**🔍 LOOK FOR THE STATUS IN THE CONTEXT ABOVE - DO NOT IGNORE IT**

The status appears at the very top:
```
<SURF_SKILLS>**VibeSurf Integration** - Status: running/not_running
```

**Actions based on status:**
- **Status: running** → VibeSurf is ready, use surf actions directly
- **Status: not_running** → Inform user to start VibeSurf, **DO NOT** run commands to start it yourself

**To manually re-check status (only if needed):**
```bash
curl $VIBESURF_ENDPOINT/health
# Returns HTTP 200 if running, connection error if not running
# Default endpoint: http://127.0.0.1:9335 (if VIBESURF_ENDPOINT is not set)
```

## Getting Browser State

> **🔍 Check Current Browser State**
>
> **When user asks about current page content or browser status** (e.g., "What's on the current page?", "What tabs are open?", "What's the browser showing?"), use the `get_browser_state` action to get the current browser state including:
> - All open tabs and their URLs
> - Active tab information
> - Page content/state
> - Highlighted Screenshot
>
> **Action:** `get_browser_state`
>
> This is essential when you don't have context about what the user is currently viewing in their browser.

## browser vs browser-use

**Both skills can accomplish the same browser tasks - they're complementary tools:**

| Approach | Best For | How It Works |
|----------|----------|--------------|
| **browser-use** | Complex, long tasks | Task-oriented sub-agent: describe goal + desired output, agent figures out steps |
| **browser** | Precise control | Step-by-step manual control: explicit actions with full visibility |
| **Hybrid** | Best reliability | Try browser-use first, fallback to browser if it fails |

**Fallback pattern when browser-use fails:**
```
browser-use fails or gets stuck
→ get_browser_state (inspect page)
→ browser.{action} (perform action)
→ get_browser_state (verify & plan next)
→ repeat until complete
```

**Key principle:** Choose based on task complexity and control needs, not step count. Browser-use is not exclusive to multi-step tasks; browser can handle complex workflows too.
