#!/usr/bin/env node
/**
 * SessionStart hook for surf plugin - Cross-platform Node.js version
 * Checks VibeSurf health and injects surf skill content
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Determine plugin root directory
const scriptDir = __dirname;
const pluginRoot = path.dirname(scriptDir);

// Get VibeSurf endpoint from environment variable or use default
const vibesurfEndpoint = process.env.VIBESURF_ENDPOINT || 'http://127.0.0.1:9335';

// Check VibeSurf health
let vibesurfStatus = 'unknown';
let vibesurfMessage = '';

// Check if VibeSurf is running (with timeout)
const checkVibeSurf = () => {
  return new Promise((resolve) => {
    const req = http.get(`${vibesurfEndpoint}/health`, { timeout: 3000 }, (res) => {
      if (res.statusCode === 200) {
        vibesurfStatus = 'running';
      } else {
        vibesurfStatus = 'not_running';
        vibesurfMessage = `\n\n<important-reminder>VibeSurf is not running.\n\nTo use surf skills, start VibeSurf:\n\`\`\`bash\nvibesurf\n\`\`\`\n\nInstall VibeSurf: \`uv tool install vibesurf\`\n\nVibeSurf must be running on ${vibesurfEndpoint} for browser automation to work.\n\nYou can customize the endpoint by setting the VIBESURF_ENDPOINT environment variable.</important-reminder>`;
      }
      resolve();
    });

    req.on('error', () => {
      vibesurfStatus = 'not_running';
      vibesurfMessage = `\n\n<important-reminder>VibeSurf is not running.\n\nTo use surf skills, start VibeSurf:\n\`\`\`bash\nvibesurf\n\`\`\`\n\nInstall VibeSurf: \`uv tool install vibesurf\`\n\nVibeSurf must be running on ${vibesurfEndpoint} for browser automation to work.\n\nYou can customize the endpoint by setting the VIBESURF_ENDPOINT environment variable.</important-reminder>`;
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      vibesurfStatus = 'not_running';
      vibesurfMessage = `\n\n<important-reminder>VibeSurf is not running.\n\nTo use surf skills, start VibeSurf:\n\`\`\`bash\nvibesurf\n\`\`\`\n\nInstall VibeSurf: \`uv tool install vibesurf\`\n\nVibeSurf must be running on ${vibesurfEndpoint} for browser automation to work.\n\nYou can customize the endpoint by setting the VIBESURF_ENDPOINT environment variable.</important-reminder>`;
      resolve();
    });
  });
};

// Escape content for JSON
const escapeForJson = (str) => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
};

// Main execution
(async () => {
  await checkVibeSurf();

  // Read surf skill content
  const surfSkillPath = path.join(pluginRoot, 'skills', 'surf', 'SKILL.md');
  let surfContent = '';
  try {
    surfContent = fs.readFileSync(surfSkillPath, 'utf8');
  } catch (e) {
    surfContent = 'Error reading surf skill: ' + e.message;
  }

  const surfEscaped = escapeForJson(surfContent);
  const messageEscaped = escapeForJson(vibesurfMessage);

  // Output context injection as JSON
  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `<SURF_SKILLS>**VibeSurf Integration** - Status: ${vibesurfStatus} (Endpoint: ${vibesurfEndpoint})\n\nBelow is your surf skill for browser automation with VibeSurf:\n\n${surfEscaped}\n\n${messageEscaped}\n</SURF_SKILLS>`
    }
  };

  console.log(JSON.stringify(output, null, 2));
})();
