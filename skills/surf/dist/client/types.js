/**
 * VibeSurf API Type Definitions
 *
 * Type definitions for VibeSurf HTTP API (http://127.0.0.1:9335)
 */
// Action categories for organization
export var ActionCategory;
(function (ActionCategory) {
    ActionCategory["BROWSER"] = "Browser Control";
    ActionCategory["SKILL"] = "AI Skills";
    ActionCategory["WORKFLOW"] = "Workflows";
    ActionCategory["EXTRA_TOOL"] = "Extra Tools";
    ActionCategory["OTHER"] = "Other";
})(ActionCategory || (ActionCategory = {}));
// Error types
export class VibeSurfError extends Error {
    code;
    details;
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'VibeSurfError';
    }
}
export class ServerNotRunningError extends VibeSurfError {
    constructor() {
        super('VibeSurf server is not running. Please start it with: vibesurf', 'SERVER_NOT_RUNNING');
    }
}
export class ActionNotFoundError extends VibeSurfError {
    constructor(actionName) {
        super(`Action '${actionName}' not found. Use /surf to see available actions.`, 'ACTION_NOT_FOUND', { actionName });
    }
}
export class ParameterValidationError extends VibeSurfError {
    constructor(message, details) {
        super(message, 'PARAMETER_VALIDATION', details);
    }
}
export class ExecutionError extends VibeSurfError {
    constructor(message, details) {
        super(message, 'EXECUTION_ERROR', details);
    }
}
//# sourceMappingURL=types.js.map