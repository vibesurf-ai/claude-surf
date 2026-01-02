---
name: website-api
description: Use when user asks to interact with Social media platforms like Xiaohongshu, Weibo, Zhihu, Douyin, or YouTube via their unified APIs.
---

# Website API - Platform APIs

## Overview

Unified API handling for specific website platforms.

## When to Use

- Interact with Chinese social platforms
- Need platform-specific API access
- Xiaohongshu, Weibo, Zhihu, Douyin, YouTube

## Available Actions

| Action | Description |
|--------|-------------|
| `get_website_api_params` | Get API parameters and available methods for platforms: "xiaohongshu", "weibo", "zhihu", "douyin", "youtube" |
| `call_website_api` | Call website platform API with unified handling |

## Supported Platforms

- xiaohongshu (小红书)
- weibo (微博)
- zhihu (知乎)
- douyin (抖音)
- youtube

## Usage Pattern

1. Get API params for platform
2. Call API with parameters
