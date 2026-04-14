import * as vscode from 'vscode';
import { commands } from './emacs/commands';
import { executeMutatingCommand, executeDiffCommand, checkEmacsAvailable } from './emacs/executor';

const SUPPORTED_LANGUAGES = ['verilog', 'systemverilog'];

function isVerilogDocument(document: vscode.TextDocument): boolean {
	return SUPPORTED_LANGUAGES.includes(document.languageId);
}

export async function activate(context: vscode.ExtensionContext) {
	// Check emacs availability on activation
	const emacsOk = await checkEmacsAvailable();
	if (!emacsOk) {
		vscode.window.showWarningMessage(
			'emacs-verilog-mode: Emacs not found. Install Emacs or set emacsVerilogMode.emacsPath.'
		);
	}

	// Register all commands
	for (const cmd of commands) {
		const disposable = vscode.commands.registerCommand(cmd.id, async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor.');
				return;
			}

			if (!isVerilogDocument(editor.document)) {
				vscode.window.showErrorMessage('This command only works on Verilog/SystemVerilog files.');
				return;
			}

			if (editor.document.isUntitled) {
				vscode.window.showErrorMessage('Please save the file first.');
				return;
			}

			try {
				if (cmd.mutating) {
					await executeMutatingCommand(editor.document, cmd);
				} else {
					await executeDiffCommand(editor.document, cmd);
				}
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : String(err);
				vscode.window.showErrorMessage(`emacs-verilog-mode: ${msg}`);
			}
		});
		context.subscriptions.push(disposable);
	}
}

export function deactivate() {}
