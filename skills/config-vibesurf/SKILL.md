---
name: config-vibesurf
description: Use when user asks to configure VibeSurf API key, import or export workflows, manage workflow skills, or execute custom workflows.
---

# Config VibeSurf - VibeSurf Configuration

## Overview

Manage VibeSurf API key and workflow configurations. Import, export, and execute custom workflows.

## When to Use

- User needs to set up VibeSurf API key
- User wants to import a workflow from JSON
- User needs to export a workflow to JSON

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/vibesurf`

### API Key Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Check Status | GET | `/status` | Get VibeSurf connection status |
| Verify Key | POST | `/verify-key` | Verify and store API key |

### Workflow Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Import Workflow | POST | `/import-workflow` | Import workflow from JSON |
| Export Workflow | GET | `/export-workflow/{flow_id}` | Export workflow to JSON file |

## Request Examples

### Verify API Key
```json
POST /vibesurf/verify-key
{
  "api_key": "vs-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Import Workflow
```json
POST /vibesurf/import-workflow
{
  "workflow_json": "{\"name\": \"My Workflow\", \"description\": \"...\", \"data\": {...}}"
}
```


## API Key Format

VibeSurf API keys must:
- Start with `vs-`
- Be 51 characters total length
- Example: `vs-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Workflow Import/Export

### Import
- Accepts Langflow-compatible JSON format
- Requires valid VibeSurf API key
- Returns `workflow_id` and `edit_url`

### Export
- Exports workflow to JSON file
- Removes sensitive data (API keys) automatically
- Returns file path to exported JSON

## Workflow

1. **Check API key status** → `GET /vibesurf/status`
2. **Set up API key** (if needed) → `POST /vibesurf/verify-key`
3. **Import workflows** → `POST /vibesurf/import-workflow`
4. **Export workflows** → `GET /vibesurf/export-workflow/{flow_id}`
