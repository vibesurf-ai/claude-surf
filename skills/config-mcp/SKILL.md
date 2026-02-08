---
name: config-mcp
description: Use when user asks to configure MCP (Model Context Protocol) profiles, add MCP servers, manage MCP integrations, or enable/disable MCP tools for extended functionality.
---

# Config MCP - MCP Profile Management

## Overview

Manage MCP (Model Context Protocol) profiles for VibeSurf. MCP allows integrating external tools and data sources with the AI.

## When to Use

- User wants to add a new MCP server
- User needs to configure MCP integrations
- User wants to update MCP server parameters
- User needs to list or manage existing MCP profiles
- User wants to enable/disable MCP tools

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/api/config`

### MCP Profile Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Profiles | GET | `/api/config/mcp-profiles?active_only=true` | List all MCP profiles |
| Get Profile | GET | `/api/config/mcp-profiles/{mcp_id}` | Get specific profile details |
| Create Profile | POST | `/api/config/mcp-profiles` | Create new MCP profile |
| Update Profile | PUT | `/api/config/mcp-profiles/{mcp_id}` | Update existing profile |

## Request Examples

### Create MCP Profile
```json
POST /api/config/mcp-profiles
{
  "display_name": "My MCP Server",
  "mcp_server_name": "server-name",
  "mcp_server_params": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-name"],
    "env": {
      "API_KEY": "..."
    }
  },
  "description": "Description of what this MCP server does"
}
```

### Update MCP Profile
```json
PUT /api/config/mcp-profiles/{mcp_id}
{
  "display_name": "Updated Name",
  "mcp_server_params": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-name"],
    "env": {
      "API_KEY": "new-key"
    }
  }
}
```

## Profile Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| display_name | string | Yes | Human-readable name |
| mcp_server_name | string | Yes | MCP server identifier |
| mcp_server_params | object | Yes | Server configuration |
| description | string | No | Profile description |
| is_active | bool | No | Enable/disable profile |

## MCP Server Params

| Field | Type | Description |
|-------|------|-------------|
| command | string | Command to run (e.g., npx, uvx, docker) |
| args | array | Arguments for the command |
| env | object | Environment variables |

## Using MCP Tools

Once MCP profiles are configured, their tools become available through the `integrations` skill:

```
1. List available tools → GET /api/tool/search?keyword=mcp
2. Execute MCP tool → POST /api/tool/execute
   {
     "action_name": "execute_extra_tool",
     "parameters": {
       "tool_name": "mcp.{server_name}.{tool_name}",
       "tool_arguments": {...}
     }
   }
```

## Common MCP Servers

- `@modelcontextprotocol/server-filesystem` - File system access
- `@modelcontextprotocol/server-github` - GitHub integration
- `@modelcontextprotocol/server-postgres` - PostgreSQL access
- `@modelcontextprotocol/server-puppeteer` - Browser automation

## Workflow

1. **Identify MCP server** → Choose from available MCP servers
2. **Create profile** → `POST /api/config/mcp-profiles` with server params
3. **Verify tools** → Use `integrations` skill to list and use MCP tools
