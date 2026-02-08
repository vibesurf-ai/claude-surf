---
name: config-composio
description: Use when user asks to configure Composio API key, enable or disable Composio toolkits (Gmail, GitHub, Slack, etc.), manage app integrations, or authenticate with external services.
---

# Config Composio - Composio Integration Management

## Overview

Manage Composio API key and toolkit configurations. Enable/disable app integrations like Gmail, GitHub, Slack, and more.

## When to Use

- User needs to set up Composio API key
- User wants to enable a toolkit (Gmail, GitHub, Slack, etc.)
- User needs to disable a toolkit
- User wants to check which toolkits are available
- User needs to manage toolkit authentication (OAuth)
- User wants to configure toolkit tools selection

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/api/composio`

### API Key Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Check Status | GET | `/api/composio/status` | Get Composio connection status |
| Verify Key | POST | `/api/composio/verify-key` | Verify and store API key |

### Toolkit Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Toolkits | GET | `/api/composio/toolkits` | Get all available toolkits |
| Toggle Toolkit | POST | `/api/composio/toolkit/{slug}/toggle` | Enable/disable toolkit |
| Get Tools | GET | `/api/composio/toolkit/{slug}/tools` | Get tools for a toolkit |
| Update Tools | POST | `/api/composio/toolkit/{slug}/tools` | Update selected tools |
| Connection Status | GET | `/api/composio/toolkit/{slug}/connection-status` | Check OAuth connection |

## Request Examples

### Verify API Key
```json
POST /api/composio/verify-key
{
  "api_key": "your-composio-api-key"
}
```

### Enable Toolkit
```json
POST /api/composio/toolkit/gmail/toggle
{
  "enabled": true,
  "force_reauth": false
}
```

### Disable Toolkit
```json
POST /api/composio/toolkit/gmail/toggle
{
  "enabled": false
}
```

### Update Tool Selection
```json
POST /api/composio/toolkit/gmail/tools
{
  "selected_tools": {
    "GMAIL_SEND_EMAIL": true,
    "GMAIL_FETCH_EMAILS": false
  }
}
```

## Common Toolkits

| Toolkit | Description |
|---------|-------------|
| `gmail` | Send and receive emails |
| `github` | Repository management, PRs, issues |
| `slack` | Send messages, manage channels |
| `google_calendar` | Event management |
| `google_sheets` | Spreadsheet operations |
| `notion` | Page and database management |
| `trello` | Card and board management |
| `asana` | Task management |
| `jira` | Issue tracking |

## OAuth Flow

When enabling a toolkit that requires OAuth:

1. **Enable toolkit** → `POST /api/composio/toolkit/{slug}/toggle` with `enabled: true`
2. **Check response** → If `requires_oauth: true`, an `oauth_url` is provided
3. **User authenticates** → Open `oauth_url` in browser to complete OAuth
4. **Verify connection** → `GET /api/composio/toolkit/{slug}/connection-status`

## Using Composio Tools

Once toolkits are enabled, their tools become available through the `integrations` skill:

```
1. List available tools → GET /api/tool/search?keyword=composio
2. Execute tool → POST /api/tool/execute
   {
     "action_name": "execute_extra_tool",
     "parameters": {
       "tool_name": "cpo.{toolkit}.{action}",
       "tool_arguments": {...}
     }
   }
```

## Tool Naming Convention

Composio tools follow the pattern: `cpo.{toolkit_slug}.{action_name}`

Examples:
- `cpo.gmail.GMAIL_SEND_EMAIL`
- `cpo.github.GITHUB_CREATE_PULL_REQUEST`
- `cpo.slack.SLACK_SEND_MESSAGE`

## Workflow

1. **Check API key status** → `GET /api/composio/status`
2. **Set up API key** (if needed) → `POST /api/composio/verify-key`
3. **List available toolkits** → `GET /api/composio/toolkits`
4. **Enable desired toolkit** → `POST /api/composio/toolkit/{slug}/toggle`
5. **Complete OAuth** (if required) → Use provided `oauth_url`
6. **Use tools** → Execute via `integrations` skill
