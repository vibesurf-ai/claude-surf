---
name: browser
description: Use when user needs direct browser control like navigating to URLs, clicking elements, typing text, scrolling, switching tabs, taking screenshots, or inspecting page state.
---

# Browser - Direct Browser Control

## Overview

Direct control of browser interactions. Use for simple, single actions.

## When to Use

- Navigate to a URL
- Click/input/scroll
- Switch/close tabs
- Get page state
- Extract visible data

## Available Actions

| Action | Description |
|--------|-------------|
| `get_browser_state` | Get current browser state including tabs, DOM content, and highlighted screenshot |
| `browser.search` | Search on web |
| `browser.navigate` | Navigate to URL |
| `browser.go_back` | Go back |
| `browser.wait` | Wait for condition |
| `browser.click` | Click element |
| `browser.input` | Input text into field |
| `browser.switch` | Switch to another tab by tab_id |
| `browser.close` | Close a tab by tab_id |
| `browser.extract` | LLM extracts structured data from page markdown |
| `browser.scroll` | Scroll page |
| `browser.send_keys` | Send keyboard keys |
| `browser.find_text` | Scroll to and find text |
| `browser.dropdown_options` | Get dropdown options |
| `browser.select_dropdown` | Select dropdown option |
| `browser.evaluate` | Execute JavaScript in browser |
| `browser.hover` | Hover on element |
| `browser.download_media` | Download media from URL |
| `browser.get_html_content` | Get HTML content and save to file |
| `browser.reload_page` | Refresh current page |
| `browser.start_console_logging` | Start monitoring console logs (console.log/warn/error) |
| `browser.stop_console_logging` | Stop console logging and retrieve all logs |
| `browser.start_network_logging` | Start monitoring network traffic (requests/responses) |
| `browser.stop_network_logging` | Stop network logging and get HAR file |

## Key Actions

### Getting Started
- `get_browser_state` - Always call first to see current state

### Navigation
- `browser.navigate` - Go to URL
- `browser.go_back` - Go back
- `browser.reload_page` - Refresh page

### Interaction
- `browser.click` - Click element
- `browser.input` - Type text
- `browser.send_keys` - Send keyboard keys
- `browser.hover` - Hover on element

### Data & Info
- `browser.extract` - LLM extracts structured data from page
- `browser.get_html_content` - Get full HTML
- `browser.find_text` - Find and scroll to text

### Tabs
- `browser.switch` - Switch to tab by tab_id (last 4 chars of target_id)
- `browser.close` - Close tab by tab_id

### Advanced
- `browser.evaluate` - Execute custom JavaScript

### Debugging & Testing
- `browser.start_console_logging` - Start monitoring console logs
- `browser.stop_console_logging` - Stop and retrieve console logs (saved to file)
- `browser.start_network_logging` - Start monitoring network traffic
- `browser.stop_network_logging` - Stop and retrieve network logs as HAR file

**Use case**: Website testing, local frontend/backend debugging, reverse engineering
**Workflow**: Call `start_*` first, perform actions, then call `stop_*` to get logs

## When NOT to Use

- Multi-step automation → Use `browser-use` skill
- Form filling → Use `browser-use` skill
- Simple data extraction → Use `js_code`, `crawl`, or `browser.extract`

## Best Practices

1. Call `get_browser_state` first to see available elements
2. Use element indices/IDs from browser state
3. Tab IDs are last 4 characters of target_id
4. Use `browser.extract` for LLM-based extraction from page markdown
5. Use `browser.evaluate` for custom JavaScript operations
