#!/usr/bin/env node
/**
 * VibeSurf Health Check Hook
 *
 * Runs on SessionStart to verify VibeSurf server is running.
 * Displays a warning if not available, but doesn't block plugin loading.
 */

const VIBESURF_URL = 'http://127.0.0.1:9335';
const HEALTH_ENDPOINT = `${VIBESURF_URL}/health`;
const TIMEOUT_MS = 3000; // 3 seconds

async function checkVibeSurfHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(HEALTH_ENDPOINT, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      // VibeSurf is running - no output needed
      return {
        running: true,
        message: null
      };
    } else {
      return {
        running: false,
        message: generateWarningMessage()
      };
    }
  } catch (error) {
    // Connection failed - VibeSurf not running
    return {
      running: false,
      message: generateWarningMessage()
    };
  }
}

function generateWarningMessage() {
  return `⚠️  VibeSurf server is not running - surf skill will not work

To enable browser automation capabilities:
  1. Install: uv tool install vibesurf
  2. Start: vibesurf
  3. Restart Claude Code

VibeSurf must be running on ${VIBESURF_URL} for surf commands to work.
`;
}

async function main() {
  const result = await checkVibeSurfHealth();

  if (!result.running && result.message) {
    // Output warning message for Claude to see
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: result.message
      }
    }));
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Health check error:', error);
  process.exit(0); // Don't fail the session start
});
