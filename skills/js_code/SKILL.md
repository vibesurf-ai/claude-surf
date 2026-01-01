---
name: js_code
description: Use when user asks to extract structured data from a webpage like lists, tables, products, posts, or items with the same structure. This auto-generates JavaScript code and executes it to return parsed results.
---

# JS Code - Structured Data Extraction

## Overview

Automatically generates and executes JavaScript to extract structured data from webpages. **Best for extracting multiple items with the same structure.**

## When to Use

- Extract all products/prices from a page
- Get all posts/articles/listings
- Pull table data
- Extract repeated elements with same structure

## Available Actions

| Action | Description |
|--------|-------------|
| `skill_code` | Generate and execute JavaScript from functional requirements with iterative retry logic |

## How It Works

Call VibeSurf API with `skill_code` and a prompt describing what to extract. The system generates optimized JavaScript and returns parsed results.

## Best For

| Use Case | Why |
|----------|-----|
| All product prices | Repeated structure |
| All article titles | List extraction |
| Table data | Structured parsing |
| All links of a type | Pattern matching |
