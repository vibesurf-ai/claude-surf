#!/bin/bash
echo "Checking plugin structure..."
echo ""

# Check required files
files=(
  ".claude-plugin/marketplace.json"
  ".claude-plugin/plugin.json"
  ".claude-plugin/hooks.json"
  "package.json"
  "skills/surf/SKILL.md"
  "skills/surf/package.json"
  "skills/surf/dist/client/vibesurf-client.js"
  "skills/surf/dist/commands/surf.js"
  "scripts/vibesurf-health-check.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ MISSING: $file"
  fi
done

echo ""
echo "Plugin directory structure:"
ls -la .claude-plugin/
