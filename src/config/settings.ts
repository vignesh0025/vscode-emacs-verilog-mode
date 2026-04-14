import * as vscode from 'vscode';

/** Mapping entry: VS Code setting key → elisp variable name and type */
export interface SettingMapping {
    /** VS Code setting key under `emacsVerilogMode.` */
    key: string;
    /** Emacs lisp variable name */
    elispVar: string;
    /** Type for serialization */
    type: 'boolean' | 'number' | 'string' | 'string-or-nil' | 'symbol-or-nil';
}

/**
 * Complete mapping of VS Code settings to emacs verilog-mode variables.
 * Grouped by category for readability.
 */
export const settingMappings: SettingMapping[] = [
    // ── AUTO Behavior ──────────────────────────────────────────────
    { key: 'autoArgFormat', elispVar: 'verilog-auto-arg-format', type: 'symbol-or-nil' },
    { key: 'autoArgSort', elispVar: 'verilog-auto-arg-sort', type: 'boolean' },
    { key: 'autoDeclareNettype', elispVar: 'verilog-auto-declare-nettype', type: 'string-or-nil' },
    { key: 'autoDeleteTrailingWhitespace', elispVar: 'verilog-auto-delete-trailing-whitespace', type: 'boolean' },
    { key: 'autoEndcomments', elispVar: 'verilog-auto-endcomments', type: 'boolean' },
    { key: 'autoIgnoreConcat', elispVar: 'verilog-auto-ignore-concat', type: 'boolean' },
    { key: 'autoIndentOnNewline', elispVar: 'verilog-auto-indent-on-newline', type: 'boolean' },
    { key: 'autoInstColumn', elispVar: 'verilog-auto-inst-column', type: 'number' },
    { key: 'autoInstDotName', elispVar: 'verilog-auto-inst-dot-name', type: 'boolean' },
    { key: 'autoInstInterfacedPorts', elispVar: 'verilog-auto-inst-interfaced-ports', type: 'boolean' },
    { key: 'autoInstParamValue', elispVar: 'verilog-auto-inst-param-value', type: 'boolean' },
    { key: 'autoInstParamValueType', elispVar: 'verilog-auto-inst-param-value-type', type: 'boolean' },
    { key: 'autoInstSort', elispVar: 'verilog-auto-inst-sort', type: 'boolean' },
    { key: 'autoInstTemplateNumbers', elispVar: 'verilog-auto-inst-template-numbers', type: 'symbol-or-nil' },
    { key: 'autoInstTemplateRequired', elispVar: 'verilog-auto-inst-template-required', type: 'boolean' },
    { key: 'autoInstVector', elispVar: 'verilog-auto-inst-vector', type: 'symbol-or-nil' },
    { key: 'autoLineup', elispVar: 'verilog-auto-lineup', type: 'symbol-or-nil' },
    { key: 'autoNewline', elispVar: 'verilog-auto-newline', type: 'boolean' },
    { key: 'autoReadIncludes', elispVar: 'verilog-auto-read-includes', type: 'boolean' },
    { key: 'autoResetBlockingInNon', elispVar: 'verilog-auto-reset-blocking-in-non', type: 'boolean' },
    { key: 'autoResetWidths', elispVar: 'verilog-auto-reset-widths', type: 'symbol-or-nil' },
    { key: 'autoSavePolicy', elispVar: 'verilog-auto-save-policy', type: 'symbol-or-nil' },
    { key: 'autoSenseDefinesConstant', elispVar: 'verilog-auto-sense-defines-constant', type: 'boolean' },
    { key: 'autoSenseIncludeInputs', elispVar: 'verilog-auto-sense-include-inputs', type: 'boolean' },
    { key: 'autoSimplifyExpressions', elispVar: 'verilog-auto-simplify-expressions', type: 'boolean' },
    { key: 'autoStarExpand', elispVar: 'verilog-auto-star-expand', type: 'boolean' },
    { key: 'autoStarSave', elispVar: 'verilog-auto-star-save', type: 'boolean' },
    { key: 'autoTemplateWarnUnused', elispVar: 'verilog-auto-template-warn-unused', type: 'boolean' },
    { key: 'autoTieoffDeclaration', elispVar: 'verilog-auto-tieoff-declaration', type: 'string' },
    { key: 'autoWireComment', elispVar: 'verilog-auto-wire-comment', type: 'boolean' },
    { key: 'autoWireType', elispVar: 'verilog-auto-wire-type', type: 'string-or-nil' },

    // ── AUTO Ignore/Filter Regexps ─────────────────────────────────
    { key: 'activeLowRegexp', elispVar: 'verilog-active-low-regexp', type: 'string-or-nil' },
    { key: 'autoInoutIgnoreRegexp', elispVar: 'verilog-auto-inout-ignore-regexp', type: 'string-or-nil' },
    { key: 'autoInputIgnoreRegexp', elispVar: 'verilog-auto-input-ignore-regexp', type: 'string-or-nil' },
    { key: 'autoOutputIgnoreRegexp', elispVar: 'verilog-auto-output-ignore-regexp', type: 'string-or-nil' },
    { key: 'autoTieoffIgnoreRegexp', elispVar: 'verilog-auto-tieoff-ignore-regexp', type: 'string-or-nil' },
    { key: 'autoUnusedIgnoreRegexp', elispVar: 'verilog-auto-unused-ignore-regexp', type: 'string-or-nil' },
    { key: 'autoRegInputAssignedIgnoreRegexp', elispVar: 'verilog-auto-reg-input-assigned-ignore-regexp', type: 'string-or-nil' },
    { key: 'typedefRegexp', elispVar: 'verilog-typedef-regexp', type: 'string-or-nil' },

    // ── Indentation ────────────────────────────────────────────────
    { key: 'indentLevel', elispVar: 'verilog-indent-level', type: 'number' },
    { key: 'indentLevelBehavioral', elispVar: 'verilog-indent-level-behavioral', type: 'number' },
    { key: 'indentLevelDeclaration', elispVar: 'verilog-indent-level-declaration', type: 'number' },
    { key: 'indentLevelDirective', elispVar: 'verilog-indent-level-directive', type: 'number' },
    { key: 'indentLevelModule', elispVar: 'verilog-indent-level-module', type: 'number' },
    { key: 'indentBeginAfterIf', elispVar: 'verilog-indent-begin-after-if', type: 'boolean' },
    { key: 'indentClassInsidePkg', elispVar: 'verilog-indent-class-inside-pkg', type: 'boolean' },
    { key: 'indentDeclarationMacros', elispVar: 'verilog-indent-declaration-macros', type: 'boolean' },
    { key: 'indentIgnoreMultilineDefines', elispVar: 'verilog-indent-ignore-multiline-defines', type: 'boolean' },
    { key: 'indentIgnoreRegexp', elispVar: 'verilog-indent-ignore-regexp', type: 'string-or-nil' },
    { key: 'indentLists', elispVar: 'verilog-indent-lists', type: 'boolean' },
    { key: 'caseIndent', elispVar: 'verilog-case-indent', type: 'number' },
    { key: 'cexpIndent', elispVar: 'verilog-cexp-indent', type: 'number' },
    { key: 'tabAlwaysIndent', elispVar: 'verilog-tab-always-indent', type: 'boolean' },
    { key: 'tabToComment', elispVar: 'verilog-tab-to-comment', type: 'boolean' },

    // ── Alignment ──────────────────────────────────────────────────
    { key: 'alignAssignExpr', elispVar: 'verilog-align-assign-expr', type: 'boolean' },
    { key: 'alignCommentDistance', elispVar: 'verilog-align-comment-distance', type: 'number' },
    { key: 'alignDeclExprComments', elispVar: 'verilog-align-decl-expr-comments', type: 'boolean' },
    { key: 'alignIfelse', elispVar: 'verilog-align-ifelse', type: 'boolean' },
    { key: 'alignTypedefRegexp', elispVar: 'verilog-align-typedef-regexp', type: 'string-or-nil' },
    { key: 'assignmentDelay', elispVar: 'verilog-assignment-delay', type: 'string' },

    // ── Highlighting ───────────────────────────────────────────────
    { key: 'highlightGroupingKeywords', elispVar: 'verilog-highlight-grouping-keywords', type: 'boolean' },
    { key: 'highlightIncludes', elispVar: 'verilog-highlight-includes', type: 'boolean' },
    { key: 'highlightModules', elispVar: 'verilog-highlight-modules', type: 'boolean' },
    { key: 'highlightTranslateOff', elispVar: 'verilog-highlight-translate-off', type: 'boolean' },

    // ── Library & File Resolution ──────────────────────────────────
    { key: 'libraryDirectories', elispVar: 'verilog-library-directories', type: 'string' },
    { key: 'libraryExtensions', elispVar: 'verilog-library-extensions', type: 'string' },
    { key: 'libraryFiles', elispVar: 'verilog-library-files', type: 'string' },
    { key: 'libraryFlags', elispVar: 'verilog-library-flags', type: 'string' },

    // ── Compilation & Tooling ──────────────────────────────────────
    { key: 'compiler', elispVar: 'verilog-compiler', type: 'string' },
    { key: 'coverage', elispVar: 'verilog-coverage', type: 'string' },
    { key: 'linter', elispVar: 'verilog-linter', type: 'string' },
    { key: 'preprocessor', elispVar: 'verilog-preprocessor', type: 'string' },
    { key: 'simulator', elispVar: 'verilog-simulator', type: 'string' },

    // ── Miscellaneous ──────────────────────────────────────────────
    { key: 'caseFold', elispVar: 'verilog-case-fold', type: 'boolean' },
    { key: 'minimumCommentDistance', elispVar: 'verilog-minimum-comment-distance', type: 'number' },
    { key: 'warnFatal', elispVar: 'verilog-warn-fatal', type: 'boolean' },
];

/**
 * Read all non-undefined verilog-mode settings from VS Code configuration.
 * Returns a map of elispVar → value (already typed).
 */
export function getConfiguredSettings(): Map<string, unknown> {
    const config = vscode.workspace.getConfiguration('emacsVerilogMode');
    const result = new Map<string, unknown>();

    for (const mapping of settingMappings) {
        const inspect = config.inspect(mapping.key);
        // Only include if user or workspace has explicitly set a value
        if (inspect && (inspect.globalValue !== undefined || inspect.workspaceValue !== undefined || inspect.workspaceFolderValue !== undefined)) {
            result.set(mapping.key, config.get(mapping.key));
        }
    }

    return result;
}

/**
 * Get the emacs executable path from settings.
 */
export function getEmacsPath(): string {
    const config = vscode.workspace.getConfiguration('emacsVerilogMode');
    return config.get<string>('emacsPath') || 'emacs';
}
