/**
 * Utility functions for surf command
 */

import * as readline from 'readline';
import type { Action, ActionSchema, PropertySchema } from '../client/types.js';

/**
 * Format actions as a markdown table
 */
export function formatActionsTable(actions: Action[]): string {
  if (actions.length === 0) {
    return '_No actions in this category_';
  }

  const lines: string[] = [];
  lines.push('| Action | Description |');
  lines.push('|--------|-------------|');

  for (const action of actions) {
    const name = action.action_name;
    const desc = action.description || 'No description';
    lines.push(`| \`${name}\` | ${desc} |`);
  }

  return lines.join('\n');
}

/**
 * Prompt user for parameters based on schema
 * Optionally uses natural language hint for parameter inference
 */
export async function promptForParameters(
  schema: ActionSchema,
  naturalLanguageHint?: string
): Promise<Record<string, any>> {
  const params: Record<string, any> = {};
  const required = schema.required || [];
  const properties = schema.properties || {};

  // Check if there are any properties to collect
  if (Object.keys(properties).length === 0) {
    console.log('ℹ️ This action requires no parameters.\n');
    return params;
  }

  if (naturalLanguageHint) {
    console.log(`💡 Natural language hint: "${naturalLanguageHint}"\n`);
    console.log('Claude should convert this to appropriate parameters based on the schema below:\n');
  }

  console.log('📝 Parameter schema:\n');
  console.log(JSON.stringify(schema, null, 2));
  console.log('\n---\n');

  // Iterate through required parameters first, then optional
  const requiredParams = required.map((name) => ({ name, prop: properties[name], required: true }));
  const optionalParams = Object.entries(properties)
    .filter(([name]) => !required.includes(name))
    .map(([name, prop]) => ({ name, prop, required: false }));

  const allParams = [...requiredParams, ...optionalParams];

  for (const { name, prop, required: isRequired } of allParams) {
    const value = await promptForParameter(name, prop, isRequired, naturalLanguageHint);

    if (value !== undefined && value !== null && value !== '') {
      params[name] = value;
    }
  }

  return params;
}

/**
 * Prompt for a single parameter
 */
async function promptForParameter(
  name: string,
  schema: PropertySchema,
  required: boolean,
  naturalLanguageHint?: string
): Promise<any> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    // Build prompt
    let prompt = `  ${name}`;
    if (schema.type) {
      prompt += ` (${schema.type})`;
    }
    if (required) {
      prompt += ' *required*';
    }
    if (schema.default !== undefined) {
      prompt += ` [default: ${JSON.stringify(schema.default)}]`;
    }
    prompt += '\n';

    if (schema.description) {
      prompt += `    ${schema.description}\n`;
    }

    if (schema.enum) {
      prompt += `    Options: ${schema.enum.join(', ')}\n`;
    }

    prompt += '    > ';

    // Get user input
    const answer = await question(prompt);

    // Parse answer based on type
    if (!answer || answer.trim() === '') {
      if (schema.default !== undefined) {
        return schema.default;
      }
      if (required) {
        console.log(`    ⚠️ Required parameter cannot be empty. Using empty value.\n`);
        return '';
      }
      return undefined;
    }

    const trimmed = answer.trim();

    // Type conversion
    if (schema.type === 'number' || schema.type === 'integer') {
      const num = Number(trimmed);
      if (isNaN(num)) {
        console.log(`    ⚠️ Invalid number, using as string\n`);
        return trimmed;
      }
      return num;
    }

    if (schema.type === 'boolean') {
      const lower = trimmed.toLowerCase();
      if (lower === 'true' || lower === 'yes' || lower === '1') {
        return true;
      }
      if (lower === 'false' || lower === 'no' || lower === '0') {
        return false;
      }
      console.log(`    ⚠️ Invalid boolean, using false\n`);
      return false;
    }

    if (schema.type === 'array') {
      try {
        // Try JSON parse first
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Fall back to comma-separated
        return trimmed.split(',').map((s) => s.trim());
      }
    }

    if (schema.type === 'object') {
      try {
        return JSON.parse(trimmed);
      } catch {
        console.log(`    ⚠️ Invalid JSON object, using as string\n`);
        return trimmed;
      }
    }

    // Default: return as string
    return trimmed;
  } finally {
    rl.close();
  }
}

/**
 * Fuzzy match action names for suggestions
 */
export function fuzzyMatchActions(query: string, actions: Action[]): Action[] {
  const lower = query.toLowerCase();
  return actions.filter((action) => {
    const name = action.action_name.toLowerCase();
    const desc = (action.description || '').toLowerCase();
    return name.includes(lower) || desc.includes(lower);
  });
}

/**
 * Format error message with troubleshooting tips
 */
export function formatError(error: Error): string {
  const lines: string[] = [];
  lines.push(`❌ Error: ${error.message}`);
  lines.push('');

  // Add troubleshooting tips based on error type
  if (error.message.includes('server') || error.message.includes('connection')) {
    lines.push('**Troubleshooting**:');
    lines.push('1. Ensure VibeSurf is running: `vibesurf`');
    lines.push('2. Check if port 9335 is available');
    lines.push('3. Try restarting VibeSurf');
  } else if (error.message.includes('not found')) {
    lines.push('**Troubleshooting**:');
    lines.push('1. Run `/surf` to see all available actions');
    lines.push('2. Check action name spelling');
  } else if (error.message.includes('parameter') || error.message.includes('validation')) {
    lines.push('**Troubleshooting**:');
    lines.push('1. Check parameter types match schema');
    lines.push('2. Ensure all required parameters are provided');
    lines.push('3. Validate JSON format for object/array parameters');
  }

  return lines.join('\n');
}
