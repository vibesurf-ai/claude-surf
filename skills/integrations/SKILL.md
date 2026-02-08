---
name: integrations
description: Use when user asks to interact with external apps like Gmail, GitHub, Slack, Google Calendar, Notion via Composio or MCP integrations. Direct API is faster than browser automation.
---

# Integrations - External App Automation

## Overview

Direct API access to 100+ external apps via Composio and MCP integrations.

## When to Use

- User needs Gmail, GitHub, Slack, etc.
- Service has Composio/MCP support
- Want faster, more reliable than browser automation

**Why use over browser?**
- Direct API = 10-100x faster
- More reliable (no UI changes)
- Better for bulk operations

## Available Actions

| Action | Purpose |
|--------|---------|
| `get_all_toolkit_types` | See all available apps |
| `search_extra_tool` | Find specific app actions |
| `get_extra_tool_info` | See action parameters |
| `execute_extra_tool` | Run app action |

## The Pattern

1. **List** available apps
2. **Search** for specific actions
3. **Get** parameter schema
4. **Execute** with parameters

## Tool Naming Convention

```
cpo.{service}.{action}     # Composio tools
mcp.{server}.{action}      # MCP tools
```

## Configuration Required

Before using Composio or MCP tools, you must configure them first:

| Integration | Configuration Skill | What to Configure |
|-------------|---------------------|-------------------|
| Composio (Gmail, GitHub, etc.) | `config-composio` | API key + enable toolkits |
| MCP servers | `config-mcp` | Add MCP server profiles |

**Workflow:**
1. Configure using appropriate `config-*` skill
2. Then use `integrations` skill to execute tools

For example:
1. First: `config-composio` → verify API key + enable `gmail` toolkit
2. Then: `integrations` → execute `cpo.gmail.GMAIL_SEND_EMAIL`

## Common Integrations

| Service | Common Actions |
|---------|----------------|
| Gmail | Send, read, organize emails |
| GitHub | Create PRs, issues, releases |
| Slack | Send messages, manage channels |
| Google Calendar | Create events, manage scheduling |
| Notion | Create pages, update databases |

## Best Practices

| Practice | Why |
|----------|-----|
| Search before execute | Find exact tool name and parameters |
| Use search filters | Reduce noise in results |
| Check authentication | Configure credentials in VibeSurf |
| Prefer integrations for API tasks | Faster than browser automation |

## Error Handling

| Error | Solution |
|-------|----------|
| Tool not found | Use `search_extra_tool` to find correct name |
| Auth failed | Configure credentials in VibeSurf |
| Invalid params | Use `get_extra_tool_info` to see schema |

## Integration vs Browser Automation

| Task | Use Integration | Use Browser |
|------|----------------|-------------|
| Send Gmail | ✅ Direct API | ❌ Slow |
| GitHub PR | ✅ Direct API | ❌ Overkill |
| Custom form | ❌ Not supported | ✅ `browser-use` |

**Rule:** If Composio/MCP supports the app, use integration.

## Common Toolkit Types

- `gmail`, `github`, `slack`
- `google_calendar`, `google_sheets`
- `notion`, `trello`, `asana`, `jira`
- Many more available via `get_all_toolkit_types`
