#!/usr/bin/env node
/**
 * VibeSurf Surf Command
 *
 * Handles /surf and /surf:{action_name} commands
 *
 * Usage:
 *   /surf                    - List all available actions categorized
 *   /surf:{action_name}      - Execute specific action with interactive parameter input
 */
import { vibeSurfClient } from '../client/vibesurf-client.js';
import { ServerNotRunningError, ActionNotFoundError, ExecutionError, } from '../client/types.js';
import { formatActionsTable, promptForParameters } from './utils.js';
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || '';
    try {
        // Check if server is running
        const status = await vibeSurfClient.isServerRunning();
        if (!status.running) {
            console.error('❌ VibeSurf server is not running!');
            console.error('');
            console.error('Please install and start VibeSurf:');
            console.error('  1. Install: uv tool install vibesurf');
            console.error('  2. Start: vibesurf');
            console.error('  3. Restart Claude Code after VibeSurf is running');
            console.error('');
            console.error('VibeSurf must be running on http://127.0.0.1:9335');
            process.exit(1);
        }
        // Parse command
        if (command.startsWith('surf:')) {
            // Execute specific action: /surf:{action_name} [natural language params]
            const fullCommand = command.slice(5); // Remove 'surf:' prefix
            const parts = fullCommand.split(' ');
            const actionName = parts[0];
            const naturalLanguageParams = parts.slice(1).join(' ');
            await executeAction(actionName, naturalLanguageParams);
        }
        else if (command === '' || command === 'surf') {
            // List all actions: /surf
            await listActions();
        }
        else {
            console.error(`Unknown command: ${command}`);
            console.error('Usage: /surf or /surf:{action_name} [natural language params]');
            process.exit(1);
        }
    }
    catch (error) {
        if (error instanceof ServerNotRunningError) {
            console.error('❌ ' + error.message);
            console.error('');
            console.error('Please install and start VibeSurf, then restart Claude Code.');
            process.exit(1);
        }
        else if (error instanceof ActionNotFoundError) {
            console.error('❌ ' + error.message);
            console.error('');
            console.error('Run /surf to see all available actions.');
            process.exit(1);
        }
        else if (error instanceof ExecutionError) {
            console.error('❌ Action execution failed:');
            console.error(error.message);
            if (error.details) {
                console.error('');
                console.error('Details:', JSON.stringify(error.details, null, 2));
            }
            process.exit(1);
        }
        else {
            console.error('❌ Unexpected error:', error);
            process.exit(1);
        }
    }
}
/**
 * List all available actions categorized
 */
async function listActions() {
    console.log('# 🏄 VibeSurf Actions\n');
    const categorized = await vibeSurfClient.getCategorizedActions();
    // Display each category
    for (const [category, actions] of Object.entries(categorized)) {
        if (actions.length === 0)
            continue;
        console.log(`## ${category}\n`);
        console.log(formatActionsTable(actions));
        console.log('');
    }
    console.log('---\n');
    console.log('**Usage**: `/surf:{action_name}` to execute an action\n');
    console.log('**Example**: `/surf:get_browser_state`, `/surf:skill_search`, `/surf:search_workflows`\n');
}
/**
 * Execute a specific action with optional natural language parameters
 * Supports both interactive prompts and natural language parameter parsing
 */
async function executeAction(actionName, naturalLanguageParams) {
    console.log(`# Executing: ${actionName}\n`);
    try {
        // Get action parameters schema
        const schema = await vibeSurfClient.getActionParams(actionName);
        let params;
        // If natural language params provided, attempt to parse them
        if (naturalLanguageParams && naturalLanguageParams.trim()) {
            console.log(`📝 Natural language params detected: "${naturalLanguageParams}"\n`);
            console.log('🔄 Claude will convert this to action parameters...\n');
            // For now, inform Claude to handle the conversion
            // In production, this would be handled by Claude's LLM capabilities
            console.log('ℹ️ Please provide the parameter values based on the schema:\n');
            params = await promptForParameters(schema, naturalLanguageParams);
        }
        else {
            // Prompt for parameters interactively
            params = await promptForParameters(schema);
        }
        console.log('');
        console.log('⏳ Executing action...\n');
        // Execute action
        const result = await vibeSurfClient.executeAction(actionName, params);
        // Display result
        console.log('# Result\n');
        console.log(vibeSurfClient.formatActionResult(result));
    }
    catch (error) {
        throw error; // Re-throw to be handled by main()
    }
}
// Run main
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=surf.js.map