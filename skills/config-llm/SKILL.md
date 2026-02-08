---
name: config-llm
description: Use when user asks to configure LLM profiles, manage AI model settings, add/update/remove LLM configurations, or switch between different LLM providers like OpenAI, Anthropic, Google, etc.
---

# Config LLM - LLM Profile Management

## Overview

Manage LLM (Large Language Model) profiles for VibeSurf. Configure different AI providers, models, and their parameters.

## When to Use

- User wants to add a new LLM profile
- User needs to switch default LLM
- User wants to update LLM settings (temperature, max_tokens, etc.)
- User needs to see available LLM providers and models
- User wants to list or manage existing LLM profiles

## API Endpoints

Base path: `$VIBESURF_ENDPOINT/config`

### Profile Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Profiles | GET | `/llm-profiles?active_only=true` | List all LLM profiles |
| Get Profile | GET | `/llm-profiles/{profile_name}` | Get specific profile details |
| Create Profile | POST | `/llm-profiles` | Create new LLM profile |
| Update Profile | PUT | `/llm-profiles/{profile_name}` | Update existing profile |
| Set Default | POST | `/llm-profiles/{profile_name}/set-default` | Set profile as default |
| Get Default | GET | `/llm-profiles/default/current` | Get current default profile |

### Provider Management

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Providers | GET | `/llm/providers` | Get available LLM providers |
| Get Models | GET | `/llm/providers/{provider_name}/models` | Get models for a provider |

## Common Providers

- `openai` - GPT-4, GPT-3.5, etc.
- `anthropic` - Claude models
- `google` - Gemini models
- `deepseek` - DeepSeek models
- `openrouter` - Multi-provider access
- `local` - Local/self-hosted models

## Request Examples

### Create Profile
```json
POST /config/llm-profiles
{
  "profile_name": "my-openai",
  "provider": "openai",
  "model": "gpt-4",
  "api_key": "sk-...",
  "temperature": 0.7,
  "max_tokens": 4096,
  "is_default": false
}
```

### Update Profile
```json
PUT /config/llm-profiles/my-openai
{
  "temperature": 0.5,
  "max_tokens": 2048
}
```

## Profile Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| profile_name | string | Yes | Unique profile identifier |
| provider | string | Yes | Provider name |
| model | string | Yes | Model name |
| api_key | string | Yes | API key for the provider |
| base_url | string | No | Custom base URL |
| temperature | float | No | Sampling temperature (0-2) |
| max_tokens | int | No | Maximum tokens to generate |
| top_p | float | No | Nucleus sampling |
| frequency_penalty | float | No | Frequency penalty (-2 to 2) |
| seed | int | No | Random seed |
| description | string | No | Profile description |
| is_default | bool | No | Set as default profile |

## Workflow

1. **Get available providers** → `GET /llm/providers`
2. **Choose provider and model** → `GET /llm/providers/{provider}/models`
3. **Create profile** → `POST /llm-profiles`
4. **Set as default** (optional) → `POST /llm-profiles/{name}/set-default`
