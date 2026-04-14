/** Definition of a command exposed by the extension */
export interface CommandDefinition {
    /** VS Code command ID */
    id: string;
    /** Human-readable title shown in command palette */
    title: string;
    /** Elisp function to call */
    elispFunction: string;
    /** Whether the command modifies the file (true) or is read-only (false) */
    mutating: boolean;
}

/**
 * All commands exposed by the extension.
 */
export const commands: CommandDefinition[] = [
    // ── Mutating commands (apply via WorkspaceEdit) ────────────────
    {
        id: 'emacs-verilog-mode.auto',
        title: 'Verilog: Expand AUTOs',
        elispFunction: 'verilog-auto',
        mutating: true,
    },
    {
        id: 'emacs-verilog-mode.deleteAuto',
        title: 'Verilog: Delete AUTOs',
        elispFunction: 'verilog-delete-auto',
        mutating: true,
    },
    {
        id: 'emacs-verilog-mode.injectAuto',
        title: 'Verilog: Inject AUTOs',
        elispFunction: 'verilog-inject-auto',
        mutating: true,
    },
    {
        id: 'emacs-verilog-mode.indentBuffer',
        title: 'Verilog: Indent Buffer',
        elispFunction: 'verilog-indent-buffer',
        mutating: true,
    },
    {
        id: 'emacs-verilog-mode.prettyDeclarations',
        title: 'Verilog: Align Declarations',
        elispFunction: 'verilog-pretty-declarations',
        mutating: true,
    },
    {
        id: 'emacs-verilog-mode.prettyExpr',
        title: 'Verilog: Align Expressions',
        elispFunction: 'verilog-pretty-expr',
        mutating: true,
    },
    {
        id: 'emacs-verilog-mode.deleteTrailingWhitespace',
        title: 'Verilog: Delete Trailing Whitespace',
        elispFunction: 'verilog-delete-trailing-whitespace',
        mutating: true,
    },

    // ── Read-only command (diff viewer) ────────────────────────────
    {
        id: 'emacs-verilog-mode.diffAuto',
        title: 'Verilog: Diff AUTOs',
        elispFunction: 'verilog-auto',
        mutating: false,
    },
];
