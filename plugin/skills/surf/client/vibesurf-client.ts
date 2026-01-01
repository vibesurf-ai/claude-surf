/**
 * VibeSurf HTTP Client
 *
 * Client for communicating with VibeSurf API at http://127.0.0.1:9335
 *
 * API Endpoints:
 * - GET  /api/tool/search?keyword={keyword}  - Search for available actions
 * - GET  /api/tool/{action_name}/params      - Get action parameter schema
 * - POST /api/tool/execute                   - Execute an action
 */

import fetch from 'node-fetch';
import {
  ActionCategory,
  ServerNotRunningError,
  ActionNotFoundError,
  ExecutionError,
} from './types.js';
import type {
  Action,
  ActionSchema,
  ExecuteActionRequest,
  ExecuteActionResponse,
  ServerStatus,
  VibeSurfClientOptions,
  CategorizedActions,
} from './types.js';

const DEFAULT_BASE_URL = 'http://127.0.0.1:9335';
const DEFAULT_TIMEOUT = 120000; // 120 seconds
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

export class VibeSurfClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(options: VibeSurfClientOptions = {}) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
    this.retries = options.retries || DEFAULT_RETRIES;
    this.retryDelay = options.retryDelay || DEFAULT_RETRY_DELAY;
  }

  /**
   * Check if VibeSurf server is running
   * Uses /health endpoint for health check
   */
  async isServerRunning(): Promise<ServerStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check

      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        running: response.ok,
        url: this.baseUrl,
      };
    } catch (error) {
      return {
        running: false,
        url: this.baseUrl,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Search for actions by keyword
   * GET /api/tool/search?keyword={keyword}
   *
   * @param keyword - Optional keyword to filter actions
   * @returns Array of actions matching the keyword
   */
  async searchActions(keyword?: string): Promise<Action[]> {
    const url = keyword
      ? `${this.baseUrl}/api/tool/search?keyword=${encodeURIComponent(keyword)}`
      : `${this.baseUrl}/api/tool/search`;

    const response = await this.fetchWithRetry(url);

    if (!response.ok) {
      if (response.status === 503 || response.status === 0) {
        throw new ServerNotRunningError();
      }
      throw new Error(`Failed to search actions: ${response.statusText}`);
    }

    const data = await response.json() as any;

    // Handle both direct array and object with actions property
    const actions = Array.isArray(data) ? data : (data.actions || []);

    return actions.map((action: any) => ({
      action_name: action.action_name || action.name || '',
      description: action.description || '',
      category: this.categorizeAction(action.action_name || action.name || ''),
    }));
  }

  /**
   * Get categorized actions grouped by category
   */
  async getCategorizedActions(keyword?: string): Promise<CategorizedActions> {
    const actions = await this.searchActions(keyword);

    const categorized: CategorizedActions = {
      [ActionCategory.BROWSER]: [],
      [ActionCategory.SKILL]: [],
      [ActionCategory.WORKFLOW]: [],
      [ActionCategory.EXTRA_TOOL]: [],
      [ActionCategory.OTHER]: [],
    };

    for (const action of actions) {
      const category = (action.category || ActionCategory.OTHER) as ActionCategory;
      categorized[category].push(action);
    }

    return categorized;
  }

  /**
   * Get parameter schema for an action
   * GET /api/tool/{action_name}/params
   *
   * @param actionName - Name of the action
   * @returns JSON schema for the action parameters
   */
  async getActionParams(actionName: string): Promise<ActionSchema> {
    const url = `${this.baseUrl}/api/tool/${encodeURIComponent(actionName)}/params`;

    const response = await this.fetchWithRetry(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ActionNotFoundError(actionName);
      }
      if (response.status === 503 || response.status === 0) {
        throw new ServerNotRunningError();
      }
      throw new Error(`Failed to get action params: ${response.statusText}`);
    }

    return await response.json() as ActionSchema;
  }

  /**
   * Execute an action with parameters
   * POST /api/tool/execute
   *
   * @param actionName - Name of the action to execute
   * @param params - Parameters for the action
   * @returns Execution result
   */
  async executeAction(
    actionName: string,
    params: Record<string, any> = {}
  ): Promise<ExecuteActionResponse> {
    const url = `${this.baseUrl}/api/tool/execute`;

    const request: ExecuteActionRequest = {
      action_name: actionName,
      action_params: params,
    };

    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 503 || response.status === 0) {
        throw new ServerNotRunningError();
      }
      const errorData = await response.json().catch(() => ({ error: response.statusText })) as any;
      throw new ExecutionError(
        errorData.error || `Action execution failed: ${response.statusText}`,
        errorData
      );
    }

    const result = await response.json() as ExecuteActionResponse;

    // Check if result contains an error
    if (result.error) {
      throw new ExecutionError(result.error, result);
    }

    return result;
  }

  /**
   * Categorize action based on its name
   */
  private categorizeAction(actionName: string): ActionCategory {
    const name = actionName.toLowerCase();

    // Browser control actions
    if (
      name.includes('browser') ||
      name.includes('navigate') ||
      name.includes('click') ||
      name.includes('input') ||
      name.includes('scroll') ||
      name.includes('screenshot') ||
      name.includes('get_browser_state') ||
      name.includes('go_to_url') ||
      name.includes('switch_tab') ||
      name.includes('close_tab')
    ) {
      return ActionCategory.BROWSER;
    }

    // AI Skills
    if (name.startsWith('skill_')) {
      return ActionCategory.SKILL;
    }

    // Workflows
    if (name.includes('workflow')) {
      return ActionCategory.WORKFLOW;
    }

    // Extra tools (Composio & MCP)
    if (
      name.startsWith('cpo.') ||
      name.startsWith('mcp.') ||
      name.includes('toolkit') ||
      name.includes('extra_tool')
    ) {
      return ActionCategory.EXTRA_TOOL;
    }

    return ActionCategory.OTHER;
  }

  /**
   * Fetch with retry logic and exponential backoff
   */
  private async fetchWithRetry(
    url: string,
    options: any = {},
    attempt: number = 1
  ): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response;
    } catch (error) {
      // Don't retry if it's the last attempt or if it's an abort error
      if (attempt >= this.retries || (error as any).name === 'AbortError') {
        throw error;
      }

      // Exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.fetchWithRetry(url, options, attempt + 1);
    }
  }

  /**
   * Format action result for display
   */
  formatActionResult(result: ExecuteActionResponse): string {
    const lines: string[] = [];

    if (result.success !== undefined) {
      lines.push(`**Status**: ${result.success ? '✅ Success' : '❌ Failed'}`);
    }

    if (result.extracted_content) {
      lines.push('');
      lines.push('**Result**:');
      lines.push(result.extracted_content);
    }

    if (result.long_term_memory) {
      lines.push('');
      lines.push('**Summary**: ' + result.long_term_memory);
    }

    if (result.attachments && result.attachments.length > 0) {
      lines.push('');
      lines.push('**Attachments**:');
      result.attachments.forEach((file) => {
        lines.push(`- ${file}`);
      });
    }

    if (result.is_done) {
      lines.push('');
      lines.push('✅ **Task completed**');
    }

    return lines.join('\n');
  }
}

// Export singleton instance
export const vibeSurfClient = new VibeSurfClient();
