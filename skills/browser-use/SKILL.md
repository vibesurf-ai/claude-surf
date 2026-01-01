---
name: browser-use
description: Use when task requires multiple steps, unknown UI, form filling, or parallel automation across multiple tabs. This launches autonomous AI agents that figure out the steps themselves.
---

# Browser-Use Agent - Autonomous Automation

## Overview

Launch AI sub-agents that complete multi-step browser tasks autonomously. **Most powerful VibeSurf capability.**

**Prerequisite:** VibeSurf running on `http://127.0.0.1:9335`

## When to Use

- Multi-step workflows (3+ steps)
- Form filling
- Unknown UI/complex navigation
- Parallel automation across tabs
- Research across multiple sites

**Don't use for:**
- Single action → Use `browser` skill
- Simple data extraction → Use `js_code`, `crawl`, or `search` skills

## Available Actions

| Action | Description |
|--------|-------------|
| `execute_browser_use_agent` | Execute browser-use agent tasks. Specify tab_id to work on specific tab. Each tab_id must be unique during parallel execution. |

## How It Works

Describe the **goal**, agent figures out the **steps**:
- Navigate to URLs
- Find and interact with elements
- Fill forms
- Extract data
- Return structured results

## Task-Oriented Thinking

**Good task descriptions:**
- ✅ "Fill out the registration form with these details"
- ✅ "Search for Python tutorials and summarize top 3"
- ✅ "Go to login page, authenticate, then check dashboard"

**Bad task descriptions:**
- ❌ "Click button" (too vague, use `browser`)
- ❌ "Extract prices" (use `js_code` instead)
- ❌ "Step 1: navigate, Step 2: click..." (let agent figure it out)

## Parallel Execution

Provide multiple tasks to run agents in parallel. Each task needs a unique `tab_id` for parallel execution.

## Best Practices

| Practice | Why |
|----------|-----|
| Describe goal, not steps | Agent figures out navigation |
| Use parallel for independent tasks | Much faster |
| One task per agent | Clear responsibilities |
| Unique tab_id per task | Required for parallel execution |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Over-specifying steps | Describe goal, let agent figure it out |
| Using for single click | Use `browser` instead |
| Using for simple extraction | Use `js_code` or `crawl` instead |
| Duplicate tab_id in parallel | Each agent needs unique tab_id |

## Decision Guide

| Choose | When |
|--------|------|
| `browser` | 1-2 steps, known elements |
| `browser-use` | 3+ steps, unknown UI, parallel tasks |
| `js_code`/`crawl`/`search` | Simple data extraction |

**Rule of thumb:** More than 2 steps OR don't know exact elements → use `browser-use`.
