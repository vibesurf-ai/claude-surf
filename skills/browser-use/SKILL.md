---
name: browser-use
description: Use when task requires multiple steps, unknown UI, form filling, or parallel automation across multiple tabs. This launches autonomous AI agents that figure out the steps themselves.
---

# Browser-Use Agent - Autonomous Automation

## Overview

Launch AI sub-agents that complete multi-step browser tasks autonomously. **Most powerful VibeSurf capability.**

## When to Use

**browser-use is a high-level, task-oriented sub-agent approach:**
- Complex tasks where you describe the **goal** and desired **output**, let the agent figure out the steps
- Long workflows that would require many manual browser operations
- Unknown or dynamic UI that needs autonomous exploration
- Parallel automation across multiple tabs

**Note:** browser-use and `browser` skill are complementary, not mutually exclusive. Both can accomplish the same tasks - browser-use is higher-level automation, while `browser` gives you precise control.

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

## Working with Existing Tabs

> **🎯 Important: tab_id Selection**
>
> **When user refers to their already-opened pages** (e.g., "the current page", "from my open tabs", "the second tab"):
>
> 1. **FIRST** call `get_browser_state` to get all open tabs and their IDs
> 2. **THEN** use the correct `tab_id` from the response
> 3. **NEVER** use `tab_id: null` or omit it - that creates a NEW tab
>
> **Key distinction:**
> - `tab_id: "existing_id"` → Work on user's existing tab
> - `tab_id: null` or omitted → Create a brand new tab

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

## Fallback Strategy

> **🔄 When browser-use Fails or Needs Manual Control**
>
> If `execute_browser_use_agent` fails, gets stuck, or you need more precise control:
>
> **Seamlessly fallback to manual `browser` operations:**
> 1. `get_browser_state` - Inspect current page state and available elements
> 2. `browser.{action}` - Perform specific action (click, input, navigate, etc.)
> 3. `get_browser_state` - Verify result and determine next action
> 4. Repeat this cycle until task completes
>
> **This is the recommended recovery pattern** - browser-use and browser are complementary tools.

## Choosing the Right Approach

| Approach | Best For | Characteristics |
|----------|----------|-----------------|
| **browser-use** | Complex, long tasks | Task-oriented, autonomous, describe goal + output |
| **browser** | Precise control needed | Step-by-step, explicit actions, full control |
| **Hybrid** | Best of both | Start with browser-use, fallback to browser if needed |

**Principle:** Choose based on task complexity and control needs, not step count. Both can handle multi-step workflows and form filling.
