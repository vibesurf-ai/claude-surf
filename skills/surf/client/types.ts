/**
 * VibeSurf API Type Definitions
 *
 * Type definitions for VibeSurf HTTP API (http://127.0.0.1:9335)
 */

// Action search response
export interface Action {
  action_name: string;
  description: string;
  category?: string;
}

// Action parameter schema (JSON Schema format)
export interface ActionSchema {
  type: string;
  properties: Record<string, PropertySchema>;
  required?: string[];
  description?: string;
  title?: string;
}

export interface PropertySchema {
  type: string;
  description?: string;
  default?: any;
  enum?: string[];
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  [key: string]: any;
}

// Action execution request
export interface ExecuteActionRequest {
  action_name: string;
  action_params: Record<string, any>;
}

// Action execution response
export interface ExecuteActionResponse {
  success: boolean;
  result?: any;
  error?: string;
  extracted_content?: string;
  long_term_memory?: string;
  is_done?: boolean;
  attachments?: string[];
}

// Action categories for organization
export enum ActionCategory {
  BROWSER = 'Browser Control',
  SKILL = 'AI Skills',
  WORKFLOW = 'Workflows',
  EXTRA_TOOL = 'Extra Tools',
  OTHER = 'Other'
}

// Categorized actions for display
export interface CategorizedActions {
  [ActionCategory.BROWSER]: Action[];
  [ActionCategory.SKILL]: Action[];
  [ActionCategory.WORKFLOW]: Action[];
  [ActionCategory.EXTRA_TOOL]: Action[];
  [ActionCategory.OTHER]: Action[];
}

// Server status
export interface ServerStatus {
  running: boolean;
  url: string;
  error?: string;
}

// Client options
export interface VibeSurfClientOptions {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Error types
export class VibeSurfError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'VibeSurfError';
  }
}

export class ServerNotRunningError extends VibeSurfError {
  constructor() {
    super(
      'VibeSurf server is not running. Please start it with: vibesurf',
      'SERVER_NOT_RUNNING'
    );
  }
}

export class ActionNotFoundError extends VibeSurfError {
  constructor(actionName: string) {
    super(
      `Action '${actionName}' not found. Use /surf to see available actions.`,
      'ACTION_NOT_FOUND',
      { actionName }
    );
  }
}

export class ParameterValidationError extends VibeSurfError {
  constructor(message: string, details?: any) {
    super(message, 'PARAMETER_VALIDATION', details);
  }
}

export class ExecutionError extends VibeSurfError {
  constructor(message: string, details?: any) {
    super(message, 'EXECUTION_ERROR', details);
  }
}
