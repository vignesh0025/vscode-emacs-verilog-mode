import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getEmacsPath } from '../config/settings';
import { buildElispScript } from './scriptBuilder';
import type { CommandDefinition } from './commands';

/** Result of an emacs batch execution */
interface EmacsResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

/**
 * Spawn emacs --batch and return the result.
 */
function spawnEmacs(args: string[], cwd: string): Promise<EmacsResult> {
    return new Promise((resolve, reject) => {
        const emacsPath = getEmacsPath();
        const proc = cp.spawn(emacsPath, args, { cwd });

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
        proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

        proc.on('error', (err: Error) => {
            reject(new Error(
                `Failed to start emacs. Is it installed and on your PATH?\n` +
                `Configured path: "${emacsPath}"\n` +
                `Error: ${err.message}`
            ));
        });

        proc.on('close', (code: number | null) => {
            resolve({ exitCode: code ?? 1, stdout, stderr });
        });
    });
}

/**
 * Create a temp copy of a file in the SAME directory (so relative library paths resolve).
 * Uses a dot-prefix to hide it and a timestamp to avoid collisions.
 * Returns the temp file path.
 */
function createTempCopy(filePath: string): string {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const tmpFile = path.join(dir, `.${base}_verilog_mode_${Date.now()}${ext}`);
    fs.copyFileSync(filePath, tmpFile);
    return tmpFile;
}

/**
 * Execute a mutating verilog-mode command.
 * Runs emacs on a temp copy, reads back the result, and applies as a WorkspaceEdit.
 */
export async function executeMutatingCommand(
    document: vscode.TextDocument,
    command: CommandDefinition
): Promise<void> {
    // Save the document first so emacs reads the latest content
    if (document.isDirty) {
        await document.save();
    }

    const filePath = document.uri.fsPath;
    const cwd = path.dirname(filePath);
    const tmpFile = createTempCopy(filePath);

    try {
        const script = buildElispScript(command.elispFunction, true);
        const args = ['--batch', tmpFile, '--eval', script];
        const result = await spawnEmacs(args, cwd);

        if (result.exitCode !== 0) {
            // Extract %%Error: messages if present
            const errorMatch = result.stderr.match(/%%Error:\s*(.*)/);
            const msg = errorMatch ? errorMatch[1] : result.stderr.trim();
            throw new Error(msg || `emacs exited with code ${result.exitCode}`);
        }

        // Read back the processed file
        const newContent = fs.readFileSync(tmpFile, 'utf-8');
        const originalContent = document.getText();

        // Only apply if content actually changed
        if (newContent !== originalContent) {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(originalContent.length)
            );
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, fullRange, newContent);
            await vscode.workspace.applyEdit(edit);
        } else {
            vscode.window.showInformationMessage(`${command.title}: No changes.`);
        }
    } finally {
        // Cleanup temp file
        try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
    }
}

/**
 * Execute the diff-auto command.
 * Runs emacs on a temp copy and opens vscode.diff to compare original vs expanded.
 */
export async function executeDiffCommand(
    document: vscode.TextDocument,
    command: CommandDefinition
): Promise<void> {
    // Save the document first so emacs reads the latest content
    if (document.isDirty) {
        await document.save();
    }

    const filePath = document.uri.fsPath;
    const cwd = path.dirname(filePath);
    const tmpFile = createTempCopy(filePath);

    const script = buildElispScript(command.elispFunction, true);
    const args = ['--batch', tmpFile, '--eval', script];
    const result = await spawnEmacs(args, cwd);

    if (result.exitCode !== 0) {
        // For diff, non-zero might just mean "differences found" — still show the diff
        // But if there's an actual error (%%Error), report it
        const errorMatch = result.stderr.match(/%%Error:\s*(.*)/);
        if (errorMatch) {
            try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
            throw new Error(errorMatch[1]);
        }
    }

    const originalUri = document.uri;
    const expandedUri = vscode.Uri.file(tmpFile);
    const baseName = path.basename(filePath);

    await vscode.commands.executeCommand(
        'vscode.diff',
        originalUri,
        expandedUri,
        `AUTO Diff: ${baseName}`
    );

    // Cleanup when the diff tab is closed
    const disposable = vscode.window.onDidChangeVisibleTextEditors(() => {
        const stillOpen = vscode.window.visibleTextEditors.some(
            e => e.document.uri.fsPath === tmpFile
        );
        if (!stillOpen) {
            try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
            disposable.dispose();
        }
    });
}

/**
 * Check if emacs is available on the system.
 */
export async function checkEmacsAvailable(): Promise<boolean> {
    try {
        const result = await spawnEmacs(['--batch', '--eval', '(kill-emacs 0)'], os.tmpdir());
        return result.exitCode === 0;
    } catch {
        return false;
    }
}
