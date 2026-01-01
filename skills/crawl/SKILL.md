---
name: crawl
description: Use when user asks to extract main content, structured data, or specific information from a webpage using LLM-powered crawling.
---

# Crawl - LLM-Powered Page Extraction

## Overview

Crawl or scrape a webpage with LLM analysis.

## When to Use

- Extract main article content
- Get specific information from a page
- Parse structured data
- Analyze page content

## Available Actions

| Action | Description |
|--------|-------------|
| `skill_crawl` | Crawl or scrape a web page with tab_id |

## How It Works

Call VibeSurf API with `skill_crawl` and prompt describing what to extract. Returns LLM-parsed structured data.
