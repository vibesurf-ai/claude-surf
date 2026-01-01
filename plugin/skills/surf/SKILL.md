---
name: surf
description: Control real browsers with VibeSurf - navigate websites, automate workflows, execute AI skills (search/crawl/code/summary), use Composio integrations (Gmail/GitHub/Slack), and run pre-built workflows. Special capability: execute_browser_use_agent for parallel multi-task browser automation using AI sub-agents. Use when users ask to browse websites, fill forms, automate tasks, search information, extract webpage data, execute workflows, or interact with external apps. Trigger phrases include "surf to [url]", "browse [website]", "automate [task]", "search for [query]", "crawl [website]", "execute workflow", "use [app name]", or any browser/web automation request.
---

# VibeSurf Integration Skill

Browser automation and AI-powered web interaction through VibeSurf. Enables Claude to control real browsers, execute intelligent workflows, and integrate with external applications.

## Prerequisites

**VibeSurf must be running** before using this skill:

```bash
vibesurf  # Starts VibeSurf server on http://127.0.0.1:9335
```

If VibeSurf is not installed:
```bash
uv tool install vibesurf
```

## Capabilities

### 1. Browser-Use Agent (Parallel Sub-Agent) ⭐
**Most Powerful**: Execute complex browser tasks using AI-powered sub-agents that work in parallel.

- **execute_browser_use_agent** - Launch autonomous browser agents that complete multi-step tasks
  - **Parallel Execution**: Run multiple agents simultaneously on different tabs
  - **Autonomous**: Just specify the goal, agent figures out the steps
  - **Task-Oriented**: Describe what you want, not how to do it
  - **Tab Management**: Each agent can work on a specific tab or create new ones

**Example Use Cases**:
- "Open 3 news sites and extract today's headlines" → 3 parallel agents
- "Research topic X across multiple sources" → Parallel deep research
- "Fill out forms on multiple websites" → Parallel form completion
- "Compare products across different e-commerce sites" → Parallel data extraction

**Key Pattern**: Think of execute_browser_use_agent as spawning intelligent workers. Each worker gets a task description and independently completes it.

### 2. Browser Control
Direct control of browser interactions (for simple, deterministic tasks):
- **get_browser_state** - Get current tabs, DOM content, and highlighted screenshot
- **navigate** - Navigate to URLs
- **click_element** - Click elements by index from browser state
- **input_text** - Type text into input fields
- **scroll** - Scroll pages or specific elements
- **take_screenshot** - Capture page screenshots
- **get_html_content** - Extract full HTML source

**When to Use**: Simple, single-step actions or when you need precise control.
**When NOT to Use**: Complex multi-step workflows → use execute_browser_use_agent instead.

**Key Pattern**: Always call `get_browser_state` first to see available element indices before clicking or interacting.

### 3. AI Skills
Intelligent web operations powered by LLMs:
- **skill_search** - Advanced search with AI-generated summaries and source aggregation
- **skill_crawl** - Extract structured data from webpages using LLM
- **skill_code** - Generate and execute JavaScript code on webpages
  - 💡 **Highly recommended** for extracting structured data (e.g., all posts, products, listings)
  - Automatically generates optimized JS code and returns parsed results
  - Perfect for scraping lists, tables, or repeated elements
- **skill_summary** - Summarize webpage content with AI
- **skill_finance** - Get comprehensive financial data for stocks (Yahoo Finance)
- **skill_trend** - Fetch trending/real-time news from multiple sources

### 4. Workflows
Execute pre-configured browser automation workflows:
- **search_workflows** - Find workflows by keyword or ID
- **execute_workflow** - Run workflows with customizable parameters (tweaks)

Workflows can automate complex multi-step tasks like auto-login, data collection, social media posting, etc.

### 5. Extra Tools (Composio & MCP)
Access external app integrations:
- **get_all_toolkit_types** - List available Composio and MCP toolkits
- **search_extra_tool** - Find specific tools within a toolkit
- **get_extra_tool_info** - Get detailed parameter schema for a tool
- **execute_extra_tool** - Execute Composio or MCP tool actions

Common integrations: Gmail, GitHub, Google Calendar, Slack, Trello, and 100+ apps.

## Usage Modes

### Automatic Discovery (Preferred)
Claude automatically uses VibeSurf tools when detecting browser/web-related requests:

**Examples**:

**Development & Debugging**:
- "Search for the latest AI news" → `skill_search`
- "I'm getting this error [error message], search for solutions" → `skill_search` (finds latest fixes beyond docs)
- "WebFetch failed for this API, get the data directly" → `navigate` + `skill_crawl` (bypasses fetch limitations)
- "Check if this library has a newer version with the bug fix" → `navigate` + `skill_crawl`

**Automation & Workflows**:
- "Create a GitHub release for v1.0.0" → `execute_browser_use_agent` or Composio GitHub
- "Fill out this registration form with my details" → `execute_browser_use_agent`
- "Auto-login to this admin dashboard and extract today's stats" → `execute_browser_use_agent`
- "Send an email via Gmail" → `execute_extra_tool` (Composio Gmail)

**Data Extraction**:
- "Open example.com and extract the main content" → `navigate` + `skill_crawl`
- "Get trending topics from 微博" → `skill_trend`
- "Extract all product prices from this e-commerce page" → `skill_code` (structured data extraction)
- "Monitor this webpage and alert me if content changes" → `execute_browser_use_agent`

**Batch Operations**:
- "Download files from these 5 URLs" → `execute_browser_use_agent` (parallel)
- "Compare features across these 3 competitor websites" → `execute_browser_use_agent` (parallel)
- "Submit this form to 10 different sites" → `execute_browser_use_agent` (parallel)

### Manual Command

**List all actions**:
```
/surf
```
Shows categorized action list with descriptions.

**Execute specific action (interactive)**:
```
/surf:{action_name}
```

**Execute with natural language parameters**:
```
/surf:{action_name} natural language description
```

Examples:
- `/surf:get_browser_state`
- `/surf:navigate` (interactive prompt for URL)
- `/surf:navigate 谷歌首页` (Claude converts "谷歌首页" to "https://www.google.com")
- `/surf:skill_search` (interactive prompt for query and rank)
- `/surf:skill_search latest AI news` (Claude converts to proper parameters)

Claude will prompt for any required parameters interactively.

## Common Patterns

### Pattern 0: Multi-Task Parallel Browser Automation (RECOMMENDED) ⭐
```
Use execute_browser_use_agent for complex multi-step or multi-tab tasks:

Example 1 - Parallel Research:
{
  "tasks": [
    {"task": "Search for Claude Code tutorials and summarize top 3 results"},
    {"task": "Open VibeSurf GitHub repo and extract the README"},
    {"task": "Find latest AI browser automation news"}
  ]
}
→ 3 agents run in parallel, each completes its task autonomously

Example 2 - Tab-Specific Tasks:
{
  "tasks": [
    {"task": "Extract product details", "tab_id": "1234"},
    {"task": "Navigate to checkout and fill shipping", "tab_id": "5678"}
  ]
}
→ 2 agents work on specific existing tabs

Example 3 - Single Complex Task:
{
  "tasks": [
    {"task": "Go to Amazon, search for 'wireless mouse', filter by 4+ stars, and extract top 5 products with prices"}
  ]
}
→ 1 agent autonomously completes multi-step workflow
```

### Pattern 1: Simple Browser Interaction
```
1. /surf:get_browser_state  # See current page and element indices
2. /surf:click_element      # Click element at index N
3. /surf:input_text         # Type into field at index M

Note: For multi-step tasks, use execute_browser_use_agent instead!
```

### Pattern 2: Web Research
```
1. /surf:skill_search       # AI-powered search with sources
   OR
2. /surf:navigate           # Go to specific URL
3. /surf:skill_crawl        # Extract structured data
```

### Pattern 3: Workflow Execution
```
1. /surf:search_workflows   # Find relevant workflows
2. /surf:execute_workflow   # Run with custom parameters
```

### Pattern 4: App Integration
```
1. /surf:get_all_toolkit_types    # See available apps
2. /surf:search_extra_tool        # Find specific actions
3. /surf:execute_extra_tool       # Execute action
```

## Best Practices

### For Browser-Use Agent (execute_browser_use_agent):
1. **Use for complex tasks**: Any task with >2 steps or multiple tabs
2. **Be task-oriented**: Describe the goal, not the steps
3. **Parallel when possible**: Independent tasks run simultaneously
4. **Unique tab IDs**: Each parallel task needs a unique tab_id (or none to create new)
5. **Trust the agent**: Browser-use agents are autonomous - they figure out the steps

**Good Task Descriptions**:
- ✅ "Search for Python tutorials and save top 3 article links"
- ✅ "Navigate to login page, fill credentials, and verify success"
- ✅ "Extract all product prices from the current page"

**Bad Task Descriptions**:
- ❌ "Click button" (too vague, use direct browser control)
- ❌ "Do step 1, then step 2, then step 3" (let agent figure out steps)

### For Browser Control:
1. **Use for simple tasks only** - Single clicks, navigation, screenshots
2. **Always start with get_browser_state** to see what's on the page
3. **Use element indices** from browser state for precise interaction
4. **Tab IDs** are the last 4 characters of target IDs shown in browser state
5. **Take screenshots** for visual debugging: `/surf:take_screenshot`
6. **For complex tasks**: Use execute_browser_use_agent instead!

### For AI Skills:
1. **skill_search** is best for quick information retrieval
2. **skill_crawl** is best for single-page structured data extraction
3. **skill_code** is best for extracting lists/arrays of structured data (all posts, products, etc.)
   - Use when you need to extract multiple items with the same structure
   - Automatically generates and executes optimized JavaScript
4. **Specify tab_id** to target specific tabs in multi-tab scenarios

### For Workflows:
1. **Search first** to find relevant workflows and see their tweak parameters
2. **Provide tweak_params** as JSON to customize workflow behavior
3. **Workflow results** often include file paths - use absolute paths returned

### For Extra Tools (Composio/MCP):
1. **Prefer Composio tools** over browser automation for API-based tasks (much faster)
2. **Optimize parameters** - use filters like `include_payload=False` to reduce noise
3. **Authentication errors** may occur if credentials are missing/expired

## Error Handling

### VibeSurf Not Running
**Error**: "VibeSurf server is not running"
**Solution**: Run `vibesurf` in a terminal

### Element Not Found
**Error**: "Element index N not found"
**Solution**: Run `get_browser_state` first to see current indices

### Action Not Found
**Error**: "Action 'X' not found"
**Solution**: Run `/surf` to see all available actions

### Parameter Errors
**Error**: "Invalid parameters"
**Solution**: Check parameter schema with action's documentation or error message

## Action Categories

When you run `/surf`, actions are organized into:
- **Browser Control** - Direct browser interactions (simple tasks only)
- **AI Skills** - Intelligent web operations
- **Workflows** - Pre-configured automation sequences
- **Extra Tools** - Composio and MCP integrations
- **Other** - Miscellaneous actions (including browser-use agent)

## Examples

### Example 1: Extract Article Content
```
User: Extract the main content from this article: https://example.com/article
Claude: [Uses navigate + skill_crawl or automatically]
```

### Example 2: Search and Research
```
User: Search for "Claude Code tutorials" and summarize the top results
Claude: [Uses skill_search with AI summary]
```

### Example 3: Multi-tab Workflow
```
User: Open these three URLs and extract their titles
Claude:
1. [Uses navigate with new_tab=true for each URL]
2. [Uses get_browser_state to see all tabs]
3. [Uses skill_crawl on each tab to extract titles]
```

### Example 4: Workflow with Customization
```
User: Use the video download workflow for this URL: https://youtube.com/watch?v=...
Claude:
1. [Uses search_workflows to find video download workflow]
2. [Uses execute_workflow with tweak_params containing the URL]
```

### Example 5: Gmail Integration
```
User: Send an email to john@example.com about project updates
Claude:
1. [Uses get_all_toolkit_types to confirm Gmail is available]
2. [Uses search_extra_tool to find email sending action]
3. [Uses execute_extra_tool with Composio Gmail to send email]
```

## Troubleshooting

**Slow responses**: Increase timeout or use simpler actions
**Authentication failures**: Check Composio/MCP credentials
**Element interactions fail**: Ensure get_browser_state was called recently
**Workflows fail**: Verify tweak_params match expected schema
**Server connection errors**: Restart VibeSurf server

## Additional Resources

- VibeSurf Documentation: https://github.com/vibesurf-ai/VibeSurf

---

**Note**: This skill requires VibeSurf server running on `http://127.0.0.1:9335`. All operations are performed locally and privately.
