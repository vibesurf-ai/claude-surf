---
name: surf
description: Use when user asks to browse websites, automate browser tasks, fill forms, extract webpage data, search web information, or interact with external apps. This is the main entry point that delegates to specialized skills.
---

# Surf - VibeSurf Browser Automation

## Overview

Control real browsers through VibeSurf. This skill delegates to specialized sub-skills.

**Prerequisites:** VibeSurf running on `http://127.0.0.1:9335`:
```bash
vibesurf  # or: uv tool install vibesurf
```

## How to Call VibeSurf API

VibeSurf exposes three core HTTP endpoints. All requests go to `http://127.0.0.1:9335`:

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
| Extract lists/tables | `js_code` | `skill_code` |
| Extract page content | `crawl` | `skill_crawl` |
| Summarize page | `summary` | `skill_summary` |
| Stock/financial data | `finance` | `skill_finance` |
| Trending news | `trend` | `skill_trend` |
| Screenshot | `screenshot` | `skill_screenshot` |
| Direct browser actions | `browser` | `browser.*` actions |
| Multi-step automation | `browser-use` | `execute_browser_use_agent` |
| Social Media Platform APIs | `website-api` | `get_website_api_params`, `call_website_api` |
| Pre-built workflows | `workflows` | `search_workflows`, `execute_workflow` |
| Gmail/GitHub/Slack | `integrations` | `get_all_toolkit_types`, `execute_extra_tool` |

## Decision Flow

```
Browser/Web Task
│
├─ Need to search? → search (skill_search)
│  Examples: "Search for solutions to [bug name]", "Find latest info about [topic]"
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
├─ Single browser action? → browser (browser.*)
│  Examples: "Click the button", "Type in the field", "Scroll down"
│
├─ Multi-step automation? → browser-use (execute_browser_use_agent)
│  Examples: "Fill out this form", "Extract data from multiple pages", "Login and check dashboard"
│
├─ Platform API (XiaoHongShu/etc)? → website-api
│  Examples: "Get XiaoHongShu posts", "Call Weibo API"
│
├─ External app (Gmail/GitHub)? → integrations
│  Examples: "Send email via Gmail", "Create GitHub PR", "Post to Slack"
│
└─ Pre-built workflow? → workflows
│  Examples: "Run video download workflow", "Execute auto-login workflow"
```

## Quick Reference

| Goal | Skill | Action |
|------|-------|--------|
| Search web | `search` | `skill_search` |
| Extract prices/products | `js_code` | `skill_code` |
| Get main content | `crawl` | `skill_crawl` |
| Summarize page | `summary` | `skill_summary` |
| Stock data | `finance` | `skill_finance` |
| Hot topics | `trend` | `skill_trend` |
| Take screenshot | `screenshot` | `skill_screenshot` |
| Click/navigate/type | `browser` | `browser.click`, `browser.navigate`, etc. |
| Fill form | `browser-use` | `execute_browser_use_agent` |
| Social Media Platform APIs | `website-api` | `call_website_api` |
| Send email | `integrations` | `execute_extra_tool` |
| Run workflow | `workflows` | `execute_workflow` |

## Common Patterns

| Request | Use Skill | Action |
|---------|-----------|--------|
| "Search for X" | `search` | `skill_search` |
| "Extract all prices" | `js_code` | `skill_code` |
| "Summarize this page" | `summary` | `skill_summary` |
| "Stock info for AAPL" | `finance` | `skill_finance` |
| "What's trending" | `trend` | `skill_trend` |
| "Take a screenshot" | `screenshot` | `skill_screenshot` |
| "Navigate and click" | `browser` | `browser.navigate`, `browser.click` |
| "Fill out this form" | `browser-use` | `execute_browser_use_agent` |
| "Get XiaoHongShu posts" | `website-api` | `call_website_api` |
| "Send Gmail" | `integrations` | `execute_extra_tool` |
| "Run video download" | `workflows` | `execute_workflow` |

## Error Handling

| Error | Solution |
|-------|----------|
| VibeSurf not running | Run `vibesurf` |
| Don't know which skill | Read skill descriptions above |
| Action not found | Call `GET /api/tool/search` to list all actions |
| Wrong parameters | Call `GET /api/tool/{action_name}/params` to see schema |
