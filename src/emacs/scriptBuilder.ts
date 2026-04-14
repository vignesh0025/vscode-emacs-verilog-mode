import { getConfiguredSettings, settingMappings, type SettingMapping } from '../config/settings';

/**
 * Convert a VS Code setting value to an elisp expression string.
 */
function toElisp(value: unknown, mapping: SettingMapping): string {
    switch (mapping.type) {
        case 'boolean':
            return value ? 't' : 'nil';
        case 'number':
            return String(value);
        case 'string':
            // Escape backslashes and double-quotes for elisp string
            return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
        case 'string-or-nil':
            if (value === null || value === undefined || value === '') {
                return 'nil';
            }
            return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
        case 'symbol-or-nil':
            if (value === null || value === undefined || value === 'nil') {
                return 'nil';
            }
            if (value === true || value === 't') {
                return 't';
            }
            // Symbols like 'packed, 'declarations, 'unbased, 'lhs etc.
            return `'${String(value)}`;
        default:
            return String(value);
    }
}

/**
 * Build the (setq ...) lines for all user-configured settings.
 */
function buildSettingsSetq(): string {
    const configured = getConfiguredSettings();
    const lines: string[] = [];

    for (const [key, value] of configured) {
        const mapping = settingMappings.find(m => m.key === key);
        if (mapping) {
            lines.push(`  (setq ${mapping.elispVar} ${toElisp(value, mapping)})`);
        }
    }

    return lines.join('\n');
}

/**
 * Build the complete elisp script for a given verilog-mode function.
 *
 * @param elispFunction The verilog-mode function to call (e.g. "verilog-auto")
 * @param save Whether to save the buffer after running the function
 */
export function buildElispScript(elispFunction: string, save: boolean): string {
    const settingsBlock = buildSettingsSetq();

    const parts = [
        '(progn',
        '  ;; Batch environment setup (mirrors verilog-batch-execute-func)',
        '  (setq make-backup-files nil)',
        '  (setq-default make-backup-files nil)',
        '  (setq enable-local-variables t)',
        '  (setq enable-local-eval t)',
        '  (setq create-lockfiles nil)',
        '  (setq-default indent-tabs-mode nil)',
    ];

    if (settingsBlock) {
        parts.push('  ;; VS Code settings');
        parts.push(settingsBlock);
    }

    parts.push(
        '  ;; Activate verilog-mode and read file-local variables',
        '  (verilog-mode)',
        '  (verilog-auto-reeval-locals)',
        '  (verilog-getopt-flags)',
        `  ;; Execute command`,
        `  (${elispFunction})`,
        '  (verilog-star-cleanup)',
    );

    if (save) {
        parts.push('  (save-buffer)');
    }

    parts.push(')');
    return parts.join('\n');
}
