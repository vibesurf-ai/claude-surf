# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude-Surf is a Claude Code plugin that integrates with VibeSurf, exposing VibeSurf's browser automation, AI skills, workflows, and external app integrations (Composio/MCP) through a `/surf` command interface.

**Key Dependency**: VibeSurf server must be running on `http://127.0.0.1:9335` for this plugin to function.

## Development Commands

```bash
# Install dependencies
cd skills/surf
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Test command execution locally
npm run surf                    # Lists all actions
npm run surf surf:navigate      # Execute specific action
```

## Architecture

### Three-Layer Design

1. **HTTP Client Layer** (`skills/surf/client/`)
   - `vibesurf-client.ts`: Communicates with VibeSurf's HTTP API
   - `types.ts`: TypeScript definitions for API contracts
   - Handles retry logic, timeouts, error types, action categorization

2. **Command Layer** (`skills/surf/commands/`)
   - `surf.ts`: Entry point for `/surf` and `/surf:{action_name}` commands
   - `utils.ts`: Parameter prompting, formatting, validation
   - Bridges user input with client API calls

3. **VibeSurf API** (External)
   - `GET /health` - Server health check
   - `GET /api/tool/search?keyword={keyword}` - Action discovery
   - `GET /api/tool/{action_name}/params` - Get JSON schema for action
   - `POST /api/tool/execute` - Execute action with params

### Action Categorization

Actions are auto-categorized in `vibesurf-client.ts:categorizeAction()`:

- **Browser Control**: Actions containing browser/navigate/click/input/scroll
- **AI Skills**: Actions starting with `skill_`
- **Workflows**: Actions containing `workflow`
- **Extra Tools**: Actions starting with `cpo.`/`mcp.` or containing `toolkit`
- **Other**: Everything else (including `execute_browser_use_agent`)

This categorization powers the `/surf` command's organized action list.

### Natural Language Parameter Support

The plugin supports both interactive and natural language parameter input:

**Interactive**: `/surf:navigate` → prompts for URL
**Natural Language**: `/surf:navigate 谷歌首页` → Claude converts "谷歌首页" to `{url: "https://www.google.com"}`

Implementation in `surf.ts:executeAction()`:
1. Parse command to extract action name and trailing text
2. Fetch parameter schema from VibeSurf API
3. If natural language detected: display schema + hint for Claude to convert
4. If not: run interactive prompts via `utils.ts:promptForParameters()`

## Plugin Configuration

### Claude Code Plugin Structure

```
.claude-plugin/
├── marketplace.json    # Marketplace metadata (owner, version, keywords)
├── plugin.json         # Plugin metadata (name, description, license)
└── hooks.json          # SessionStart hook for VibeSurf health check

scripts/
└── vibesurf-health-check.js  # Health check on session start

skills/surf/
└── SKILL.md           # Skill definition with frontmatter
```

**Critical**: `SKILL.md` frontmatter's `description` field determines when Claude auto-invokes this skill. It includes trigger phrases like "browse", "automate", "search for", etc.

### Skill Invocation Flow

1. **Session Start**: Hook checks VibeSurf health at `http://127.0.0.1:9335/health`
   - If not running: Displays warning with installation instructions
   - If running: Silent (plugin ready to use)
2. User types browser/automation-related request
3. Claude Code matches against `SKILL.md` description
4. Skill loads, making VibeSurf client available
5. Claude can now call `/surf` commands or auto-select appropriate actions

### Health Check Hook

The `SessionStart` hook (`hooks.json`) runs `vibesurf-health-check.js`:
- 3-second timeout for health check
- Non-blocking: doesn't prevent session start if VibeSurf is down
- Provides immediate feedback to user about VibeSurf status

## Key Design Patterns

### Error Handling Hierarchy

Custom error types in `types.ts`:
- `ServerNotRunningError`: VibeSurf not reachable → tell user to install/start
- `ActionNotFoundError`: Invalid action name → suggest `/surf` to list
- `ParameterValidationError`: Schema mismatch
- `ExecutionError`: Action failed → display VibeSurf's error message

All handled in `surf.ts:main()` with specific user guidance.

### Parameter Schema Processing

VibeSurf returns JSON Schema for action params. The plugin:
1. Parses `required` vs optional fields
2. Prompts for required params first
3. Applies type coercion (string→number, string→boolean, CSV→array)
4. Validates enum values if present
5. Supports default values from schema

See `utils.ts:promptForParameter()` for type conversion logic.

### Action Result Formatting

VibeSurf returns:
```typescript
{
  success: boolean,
  result?: any,
  extracted_content?: string,
  long_term_memory?: string,
  attachments?: string[]
}
```

Client formats this in `vibesurf-client.ts:formatActionResult()` with markdown:
- Status emoji (✅/❌)
- Extracted content
- Summary (long_term_memory)
- File attachments list

## Important VibeSurf Actions

### Browser-Use Agent (Parallel Automation)
`execute_browser_use_agent` - Most powerful action for complex tasks
- Launches autonomous AI agents that complete multi-step workflows
- Supports parallel execution (multiple agents on different tabs)
- Task-oriented: describe goal, agent figures out steps

**When to use**:
- Any task with >2 steps
- Multi-tab workflows
- Parallel independent tasks (e.g., research across 3 websites)

**Parameters**:
```json
{
  "tasks": [
    {"task": "description", "tab_id": "optional"}
  ]
}
```

### Skill Actions
- `skill_code`: Auto-generates JS to extract structured data (lists, tables)
- `skill_crawl`: LLM-powered single-page data extraction
- `skill_search`: AI search with ranked results

### Extra Tools
- `search_extra_tool`: Find Composio/MCP tools
- `get_extra_tool_info`: Get tool schema
- `execute_extra_tool`: Run external app actions (Gmail, GitHub, etc.)

## Testing the Plugin

### Local Testing Workflow

1. Ensure VibeSurf is running: `vibesurf`
2. Build plugin: `cd skills/surf && npm run build`
3. Install locally in Claude Code: `/plugin add /path/to/claude-surf`
4. Restart Claude Code
5. Test health check: `/surf` (should list actions)
6. Test action execution: `/surf:get_browser_state`
7. Test natural language: `/surf:navigate 谷歌首页`

### Verifying VibeSurf Connection

If actions fail, check:
1. VibeSurf server running: `curl http://127.0.0.1:9335/health`
2. Actions available: `curl http://127.0.0.1:9335/api/tool/search`
3. Check client logs in `vibesurf-client.ts:isServerRunning()`

## Code Modification Guidelines

### Adding New Action Categories

Edit `vibesurf-client.ts`:
1. Add to `ActionCategory` enum in `types.ts`
2. Update `CategorizedActions` interface
3. Add logic in `categorizeAction()` method
4. Update `getCategorizedActions()` initialization

### Modifying Parameter Prompts

Parameter collection in `utils.ts:promptForParameter()`:
- Uses `readline` for interactive input
- Type conversion happens here (number, boolean, array, object)
- Respect `schema.default` for optional params
- Natural language hints passed through but not auto-converted (Claude does that)

### Updating VibeSurf API Calls

All API calls in `vibesurf-client.ts`:
- Use `fetchWithRetry()` for resilience (3 retries, exponential backoff)
- 120s timeout for normal operations, 5s for health checks
- Always check `response.ok` before parsing JSON
- Throw typed errors (`ServerNotRunningError`, etc.) for proper handling

## Documentation Sync

When modifying functionality:
1. Update `SKILL.md` - affects Claude's auto-invocation behavior
2. Update `README.md` - user-facing documentation
3. Update examples in both if adding new actions/patterns
4. Keep action categories consistent across all docs
