---
name: config-schedule
description: Use when user asks to schedule workflows, manage cron jobs for automated workflow execution, enable/disable schedule triggers, or view workflow execution schedules.
---

# Config Schedule - Workflow Schedule Management

## Overview

Manage scheduled workflow executions using cron expressions. Schedule workflows to run automatically at specified times.

## When to Use

- User wants to schedule a workflow to run automatically
- User needs to set up cron-based workflow triggers
- User wants to enable/disable existing schedules
- User needs to view or update workflow schedules
- User wants to see which workflows have schedules configured

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/api/schedule`

### Schedule Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Schedules | GET | `/api/schedule` | Get all workflow schedules |
| Get Schedule | GET | `/api/schedule/{flow_id}` | Get schedule for specific workflow |
| Create Schedule | POST | `/api/schedule` | Create new schedule for a workflow |
| Update Schedule | PUT | `/api/schedule/{flow_id}` | Update existing schedule |

## Request Examples

### Create Schedule
```json
POST /api/schedule
{
  "flow_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "cron_expression": "0 9 * * 1-5",
  "is_enabled": true,
  "description": "Run every weekday at 9 AM"
}
```

### Update Schedule
```json
PUT /api/schedule/{flow_id}
{
  "cron_expression": "0 12 * * *",
  "is_enabled": true,
  "description": "Run daily at noon"
}
```

### Enable/Disable Schedule
```json
PUT /api/schedule/{flow_id}
{
  "is_enabled": false
}
```

## Schedule Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| flow_id | string | Yes | Workflow/Flow ID to schedule |
| cron_expression | string | No | Cron expression (e.g., '0 9 * * 1-5') |
| is_enabled | bool | No | Whether the schedule is active |
| description | string | No | Description of the schedule |

## Cron Expression Format

Standard cron format: `minute hour day_of_month month day_of_week`

| Expression | Description |
|------------|-------------|
| `0 9 * * 1-5` | Every weekday at 9:00 AM |
| `0 12 * * *` | Every day at 12:00 PM |
| `0 */6 * * *` | Every 6 hours |
| `0 0 * * 0` | Every Sunday at midnight |
| `0 8,20 * * *` | At 8:00 AM and 8:00 PM daily |

## Workflow

1. **Get workflow ID** → From existing workflows or import
2. **Create schedule** → `POST /api/schedule` with cron expression
3. **Verify schedule** → `GET /api/schedule/{flow_id}` to confirm
4. **Update as needed** → `PUT /api/schedule/{flow_id}` to modify

## Notes

- Each workflow can only have one schedule
- Schedules are automatically reloaded after creation/update
- The schedule manager must be running for schedules to execute
- `next_execution_at` is automatically calculated from the cron expression
