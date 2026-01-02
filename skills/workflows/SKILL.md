---
name: workflows
description: Use when user asks to execute, find, or run pre-built VibeSurf automation workflows like video downloads, auto-login, or data collection templates.
---

# Workflows - Pre-Built Automations

## Overview

Execute pre-configured VibeSurf workflows for common automation tasks.

## When to Use

- You know a workflow exists for your task
- You want reusable automation sequences
- Task has a known pattern (video download, auto-login, etc.)

**Examples:**
- Video download workflows
- Auto-login sequences
- Data collection templates
- Social media posting

## Available Actions

| Action | Purpose |
|--------|---------|
| `search_workflows` | Find workflows by keyword |
| `get_workflow_params` | See required parameters |
| `execute_workflow` | Run with custom values |

## The Pattern

1. **Search** for workflow with keyword
2. **Check** parameters required
3. **Execute** with tweak parameters (custom values)

## Tweak Parameters

Workflows have adjustable components called "tweaks". Provide custom values to customize workflow behavior without modifying the workflow itself.

## Best Practices

| Practice | Why |
|----------|-----|
| Search before executing | Confirm workflow exists and see parameters |
| Use tweaks for customization | Don't modify workflow directly |
| Check results | Returns file paths and detailed output |

## Common Workflow Types

| Type | Description |
|------|-------------|
| Video Download | Download from YouTube, etc. |
| Auto-Login | Authenticate to sites |
| Data Collection | Scrape structured data |
| Social Post | Post to platforms |

## Workflow vs Browser-Use

| Factor | Workflows | Browser-Use |
|--------|-----------|-------------|
| Reusability | Pre-built, reusable | Custom, one-off |
| Setup | None (already exists) | Describe task each time |
| Use when | Known pattern exists | Custom automation needed |

**Decision:** Known pattern → workflows. Unique task → browser-use.

## Error Handling

| Error | Solution |
|-------|----------|
| Workflow not found | Use `search_workflows` to find correct ID |
| Invalid tweak params | Check `get_workflow_params` for correct IDs |
| Execution failed | Verify all required params provided |

## Finding Workflows

Common search keywords:
- `video download`, `youtube`
- `auto login`
- `data collection`, `scrape`
- `social media`
