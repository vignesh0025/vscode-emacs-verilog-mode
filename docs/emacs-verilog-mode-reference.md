# Emacs Verilog-Mode Reference

> Extracted from [verilog-mode help](https://www.veripool.org/verilog-mode/help/), revision 2026-01-18-54a0c9b-vpo.

---

## Table of Contents

- [Commands (Functions)](#commands-functions)
  - [Core Commands](#core-commands)
  - [AUTO Expansion Commands](#auto-expansion-commands)
  - [Batch Commands](#batch-commands)
  - [Editing & Navigation Commands](#editing--navigation-commands)
  - [Utility Functions](#utility-functions)
- [Customizable Variables](#customizable-variables)
  - [AUTO Behavior](#auto-behavior)
  - [AUTO Ignore/Filter Regexps](#auto-ignorefilter-regexps)
  - [Indentation](#indentation)
  - [Alignment](#alignment)
  - [Highlighting & Font Lock](#highlighting--font-lock)
  - [Library & File Resolution](#library--file-resolution)
  - [Compilation & Tooling](#compilation--tooling)
  - [Hooks](#hooks)
  - [Miscellaneous](#miscellaneous)
- [Variables (Non-Customizable)](#variables-non-customizable)
- [CLI Usage (Emacs Batch Mode)](#cli-usage-emacs-batch-mode)

---

## Commands (Functions)

### Core Commands

| Command | Description |
|---------|-------------|
| `verilog-mode` | Major mode for editing Verilog/SystemVerilog source code. |
| `verilog-auto` | Expand all `/*AUTO...*/` statements in the buffer. Updates signals for instantiations, argument headers, etc. Use `M-x verilog-auto` to invoke. |
| `verilog-delete-auto` | Delete all automatic outputs, regs, and wires created by `verilog-auto`. |
| `verilog-inject-auto` | Examine legacy non-AUTO code and insert `/*AUTO...*/` comments in appropriate places (e.g., `/*AUTOINST*/`, `/*AS*/`, `/*AUTOARG*/`). |
| `verilog-diff-auto` | Expand AUTOs in a temporary buffer and report any differences from the current buffer. Whitespace is ignored when detecting differences. |

### AUTO Expansion Commands

Each of these is called as part of `M-x verilog-auto` and corresponds to a specific `/*AUTO...*/` comment directive.

| Command | AUTO Directive | Description |
|---------|---------------|-------------|
| `verilog-auto-arg` | `/*AUTOARG*/` | Replace module argument declarations with ones derived from input/output statements. |
| `verilog-auto-ascii-enum` | `/*AUTOASCIIENUM*/` | Create a register containing the ASCII decode of an enumerated signal type for waveform viewers. |
| `verilog-auto-assign-modport` | `/*AUTOASSIGNMODPORT*/` | Build assignments into modports from interface input/output/inout statements (for UVM verification modules). |
| `verilog-auto-inout` | `/*AUTOINOUT*/` | Make inout statements for any inout signal in an `/*AUTOINST*/` not declared elsewhere. |
| `verilog-auto-inout-comp` | `/*AUTOINOUTCOMP*/` | Insert complemented I/O from a specified module (inputs become outputs and vice-versa). |
| `verilog-auto-inout-in` | `/*AUTOINOUTIN*/` | Insert all I/O from a specified module as inputs (useful for monitor modules). |
| `verilog-auto-inout-modport` | `/*AUTOINOUTMODPORT*/` | Insert I/O from an interface modport into the current module. |
| `verilog-auto-inout-module` | `/*AUTOINOUTMODULE*/` | Copy I/O from a specified module into the current module (for shell/null templates). |
| `verilog-auto-inout-param` | `/*AUTOINOUTPARAM*/` | Copy parameters from a specified module. |
| `verilog-auto-input` | `/*AUTOINPUT*/` | Make input statements for any input signal into an `/*AUTOINST*/` not declared elsewhere. |
| `verilog-auto-insert-lisp` | `/*AUTOINSERTLISP*/` | Call Lisp code *before* other AUTOs are expanded; generally uses `insert` to add text. |
| `verilog-auto-insert-last` | `/*AUTOINSERTLAST*/` | Call Lisp code *after* all other AUTOs are expanded. |
| `verilog-auto-inst` | `/*AUTOINST*/` | Replace pin connections of an instantiation with ones derived from the submodule header. Supports AUTO_TEMPLATE, `@` substitution, regexp templates, and Lisp templates. |
| `verilog-auto-star` | `.*` (SystemVerilog) | Expand SystemVerilog `.*` implicit port connections (when `verilog-auto-star-expand` is set). |
| `verilog-auto-inst-param` | `/*AUTOINSTPARAM*/` | Replace parameter connections of an instantiation with ones from the submodule header. |
| `verilog-auto-logic` | `/*AUTOLOGIC*/` | Declare wires using the SystemVerilog `logic` keyword (equivalent to `/*AUTOWIRE*/` with `verilog-auto-wire-type` set to `"logic"`). |
| `verilog-auto-output` | `/*AUTOOUTPUT*/` | Make output statements for output signals from `/*AUTOINST*/` that aren't inputs to another AUTOINST. |
| `verilog-auto-output-every` | `/*AUTOOUTPUTEVERY*/` | Make every signal in the design an output (useful for preserving signals during synthesis). |
| `verilog-auto-reg` | `/*AUTOREG*/` | Make reg statements for any output that isn't already declared and isn't a wire from a block. |
| `verilog-auto-reg-input` | `/*AUTOREGINPUT*/` | Make reg statements for instantiation inputs that aren't already declared or assigned. |
| `verilog-auto-reset` | `/*AUTORESET*/` | Replace with code to initialize all registers set elsewhere in the always block. |
| `verilog-auto-sense` | `/*AUTOSENSE*/` or `/*AS*/` | Replace sensitivity list with one derived from all inputs in the always statement. |
| `verilog-auto-tieoff` | `/*AUTOTIEOFF*/` | Wire-tie all unused output signals to deasserted (for stub modules). |
| `verilog-auto-undef` | `/*AUTOUNDEF*/` | Create `` `undef `` for all `` `define ``s since the last AUTOUNDEF (prevents namespace pollution). |
| `verilog-auto-unused` | `/*AUTOUNUSED*/` | Insert a comma-separated list of all unused input/inout signals (for `_unused_ok` wires). |
| `verilog-auto-wire` | `/*AUTOWIRE*/` | Make wire statements for instantiation outputs that aren't already declared. |

### Batch Commands

These are used for command-line (non-interactive) operation with `emacs --batch`:

| Command | Usage |
|---------|-------|
| `verilog-batch-auto` | `emacs --batch <files.v> -f verilog-batch-auto` — Expand AUTOs. |
| `verilog-batch-indent` | `emacs --batch <files.v> -f verilog-batch-indent` — Fix indentation. |
| `verilog-batch-delete-auto` | `emacs --batch <files.v> -f verilog-batch-delete-auto` — Delete AUTOs. |
| `verilog-batch-inject-auto` | `emacs --batch <files.v> -f verilog-batch-inject-auto` — Inject AUTOs. |
| `verilog-batch-diff-auto` | `emacs --batch <files.v> -f verilog-batch-diff-auto` — Check if AUTOs are up to date (useful for CI/regressions). |

### Editing & Navigation Commands

| Command | Description |
|---------|-------------|
| `verilog-pretty-declarations` | Line up declarations around point. |
| `verilog-pretty-expr` | Line up expressions around point. |
| `verilog-goto-defun` | Jump to the definition of a Verilog module/interface/task/function. |
| `verilog-load-file-at-point` | Load the file under point (e.g., an include file). |
| `verilog-delete-auto-star-implicit` | Delete all `.*` implicit connections created by `verilog-auto-star`. |
| `verilog-preprocess` | Preprocess the buffer (similar to `compile`) using `verilog-preprocessor`. |
| `verilog-auto-save-compile` | Update AUTOs, save the buffer, and compile. |
| `verilog-set-compile-command` | Compute the shell command to compile Verilog based on `verilog-tool`. |

### Utility Functions

| Function | Description |
|----------|-------------|
| `verilog-read-defines` | Read `` `define ``s and parameters for the current file. Defines are stored as `vh-{definename}` Emacs variables. |
| `verilog-read-includes` | Read `` `include ``s for the current file and call `verilog-read-defines` on each. |
| `verilog-read-sub-decls` | Parse signals going to submodules. Returns arrays of outputs, inouts, and inputs for instantiated modules. |
| `verilog-current-flags` | Convert `verilog-library-flags` and similar variables to a command-line string. |
| `verilog-expand-command` | Replace `__FLAGS__` and `__FILE__` meta-information in a command string. |
| `verilog-getopt-flags` | Convert `verilog-library-flags` into standard library variables. |
| `verilog-faq` | Display version info and where to get the FAQ. |
| `verilog-diff-report` | Report differences detected by `verilog-diff-auto`. |
| `verilog-warn` | Print a warning with `format`. |
| `verilog-warn-error` | Call `error` (or `verilog-warn` if `verilog-warn-fatal` is nil). |
| `verilog-save-buffer-state` | Execute body forms, saving state around insignificant changes (e.g., text properties). |
| `verilog-save-font-no-change-functions` | Execute body forms with all change hooks disabled, temporarily disabling `font-lock`. |

---

## Customizable Variables

### AUTO Behavior

| Variable | Description |
|----------|-------------|
| `verilog-auto-arg-format` | Formatting for AUTOARG signals. `packed` = multiple per line (up to `fill-column`), `single` = one per line. |
| `verilog-auto-arg-sort` | Non-nil means AUTOARG signals are sorted alphabetically instead of declaration order. |
| `verilog-auto-declare-nettype` | Data type for `verilog-auto-input`, etc. Set to `"wire"` if using `` `default_nettype none ``. |
| `verilog-auto-delete-trailing-whitespace` | Non-nil means delete trailing whitespace during `verilog-auto`. |
| `verilog-auto-endcomments` | Non-nil means insert `/* ... */` comments after `end` statements. |
| `verilog-auto-ignore-concat` | Non-nil means ignore signals in `{...}` concatenations for AUTOWIRE, etc. |
| `verilog-auto-indent-on-newline` | Non-nil means automatically indent after newline. |
| `verilog-auto-inst-column` | Column number for net name part of AUTOINST-created pins. |
| `verilog-auto-inst-dot-name` | Non-nil means use `.name` syntax (SystemVerilog) instead of `.port(port)`. |
| `verilog-auto-inst-interfaced-ports` | Non-nil means include interfaced ports in AUTOINST expansions. |
| `verilog-auto-inst-param-value` | Non-nil means AUTOINST replaces parameters with their actual values instead of symbolic names. |
| `verilog-auto-inst-param-value-type` | Non-nil means expand parameter types in instantiations. |
| `verilog-auto-inst-sort` | Non-nil means AUTOINST/AUTOINSTPARAM signals are sorted instead of in declaration order. |
| `verilog-auto-inst-template-numbers` | If `t`, add line number comments to templated ports. If `lhs`, show the LHS of the matched template rule. |
| `verilog-auto-inst-template-required` | Non-nil means only templated ports are included in AUTOINST (un-templated ports are omitted). |
| `verilog-auto-inst-vector` | Non-nil means use bus subscripts in default AUTOINST ports. If `unsigned`, use vectors only for unsigned types. |
| `verilog-auto-lineup` | Controls statement lineup. `all`, `declarations`, or `assignment`. |
| `verilog-auto-newline` | Non-nil means automatically insert newline after semicolons. |
| `verilog-auto-read-includes` | Non-nil means automatically run `verilog-read-defines` and `verilog-read-includes` before each AUTO expansion. |
| `verilog-auto-reset-blocking-in-non` | Non-nil means AUTORESET also resets blocking (`=`) assignments in non-blocking (`<=`) blocks. |
| `verilog-auto-reset-widths` | Controls width in AUTORESET zeros. `nil` = `0`, `unbased` = `'0` (recommended for SystemVerilog), non-nil = sized literal (e.g., `32'h0`). |
| `verilog-auto-save-policy` | Action on save: `force` (always auto), `detect` (auto when needed), `ask` (prompt user). |
| `verilog-auto-sense-defines-constant` | Non-nil means AUTOSENSE assumes all `` `define ``s are constants. |
| `verilog-auto-sense-include-inputs` | Non-nil means AUTOSENSE includes all inputs (not just those that aren't outputs in the same block). |
| `verilog-auto-simplify-expressions` | Non-nil means AUTOs simplify expressions when calculating bit ranges. |
| `verilog-auto-star-expand` | Non-nil means expand SystemVerilog `.*` ports like AUTOINST. |
| `verilog-auto-star-save` | Non-nil means save expanded `.*` connections to disk. |
| `verilog-auto-template-warn-unused` | Non-nil means warn if an AUTO_TEMPLATE line is not used. |
| `verilog-auto-tieoff-declaration` | Data type for AUTOTIEOFF declarations (`"wire"`, `"assign"`, or other). |
| `verilog-auto-wire-comment` | Non-nil means insert `// To/From` comments with `verilog-auto-wire`, etc. |
| `verilog-auto-wire-type` | Data type for AUTOWIRE declarations. Set to `"logic"` for SystemVerilog. |

### AUTO Ignore/Filter Regexps

| Variable | Description |
|----------|-------------|
| `verilog-active-low-regexp` | Signals matching this regexp are treated as active-low (tied to 1 in AUTORESET/AUTOTIEOFF). |
| `verilog-auto-inout-ignore-regexp` | Signals matching this regexp are excluded from AUTOINOUT. |
| `verilog-auto-input-ignore-regexp` | Signals matching this regexp are excluded from AUTOINPUT. |
| `verilog-auto-output-ignore-regexp` | Signals matching this regexp are excluded from AUTOOUTPUT. |
| `verilog-auto-tieoff-ignore-regexp` | Signals matching this regexp are excluded from AUTOTIEOFF. |
| `verilog-auto-unused-ignore-regexp` | Signals matching this regexp are excluded from AUTOUNUSED. |
| `verilog-auto-reg-input-assigned-ignore-regexp` | Signals matching this regexp are excluded from AUTOREGINPUT. |
| `verilog-typedef-regexp` | Regexp matching Verilog-2001 typedef names (e.g., `"_t$"`). Disabled by default. |

### Indentation

| Variable | Description |
|----------|-------------|
| `verilog-indent-level` | Indentation of Verilog statements relative to containing block. |
| `verilog-indent-level-behavioral` | Absolute indentation of first `begin` in a task/function block. |
| `verilog-indent-level-declaration` | Indentation of declarations relative to containing block. |
| `verilog-indent-level-directive` | Indentation added per `` `ifdef `` nesting level. |
| `verilog-indent-level-module` | Indentation of module-level statements (`always`, `initial`, etc.). |
| `verilog-indent-begin-after-if` | Non-nil means indent `begin` after `if`/`else`/`while`, otherwise line them up. |
| `verilog-indent-class-inside-pkg` | Non-nil means indent classes inside packages. |
| `verilog-indent-declaration-macros` | Controls alignment of macro expansions in declarations. |
| `verilog-indent-ignore-multiline-defines` | Non-nil means ignore indentation on multiline `` `define `` continuation lines. |
| `verilog-indent-ignore-regexp` | Regexp matching lines that should be ignored for indentation. |
| `verilog-indent-lists` | Controls indentation of items in lists (sensitivity lists, etc.). |
| `verilog-case-indent` | Indentation for case statements. |
| `verilog-cexp-indent` | Indentation of statements split across lines. |
| `verilog-tab-always-indent` | Non-nil means TAB always re-indents the current line. |
| `verilog-tab-to-comment` | Non-nil means TAB moves to the right-hand column for a comment. |

### Alignment

| Variable | Description |
|----------|-------------|
| `verilog-align-assign-expr` | Non-nil means align expressions of continuous assignments. |
| `verilog-align-comment-distance` | Distance (spaces) between longest declaration/expression and comments. |
| `verilog-align-decl-expr-comments` | Non-nil means align declaration and expression comments. |
| `verilog-align-ifelse` | Non-nil means align `else` under matching `if`. |
| `verilog-align-typedef-regexp` | Regexp matching user typedefs for declaration alignment. |
| `verilog-align-typedef-words` | List of words matching user typedefs for declaration alignment. |
| `verilog-assignment-delay` | Text used for delays in delayed assignments (add trailing space if set). |

### Highlighting & Font Lock

| Variable | Description |
|----------|-------------|
| `verilog-fontify-variables` | Non-nil means fontify declaration variables. |
| `verilog-highlight-grouping-keywords` | Non-nil means highlight grouping keywords (begin/end) more dramatically. |
| `verilog-highlight-includes` | Non-nil means highlight include file names for `verilog-load-file-at-point`. |
| `verilog-highlight-max-lookahead` | Maximum characters in a declaration to highlight. 0 = no limit. |
| `verilog-highlight-modules` | Non-nil means highlight module names for `verilog-load-file-at-point` (experimental). |
| `verilog-highlight-p1800-keywords` | Obsolete. All code now highlighted as SystemVerilog IEEE-1800. |
| `verilog-highlight-translate-off` | Non-nil means background-highlight code between `// synopsys translate_off` and `translate_on`. |

### Library & File Resolution

| Variable | Description |
|----------|-------------|
| `verilog-library-directories` | List of directories to search for files for `/*AUTOINST*/`. May be relative or absolute. Supports env vars. |
| `verilog-library-extensions` | List of file extensions to try when resolving modules (e.g., `(".v" ".sv")`). |
| `verilog-library-files` | List of complete file paths to search for module definitions. |
| `verilog-library-flags` | Standard Verilog command-line arguments for file resolution: `-f`, `-F`, `+incdir+`, `-I`, `-y`, `+libext+`, `-v`. |

### Compilation & Tooling

| Variable | Description |
|----------|-------------|
| `verilog-compiler` | Program and arguments to compile Verilog source. |
| `verilog-coverage` | Program and arguments for coverage annotation. |
| `verilog-linter` | Program and arguments to run a lint checker. |
| `verilog-preprocessor` | Program and arguments to preprocess Verilog source. |
| `verilog-simulator` | Program and arguments to interpret Verilog source. |

### Hooks

| Variable | Description |
|----------|-------------|
| `verilog-mode-hook` | Hook run after Verilog mode is loaded. |
| `verilog-auto-hook` | Hook run after `verilog-auto` updates AUTOs. |
| `verilog-before-auto-hook` | Hook run before `verilog-auto` updates AUTOs. |
| `verilog-delete-auto-hook` | Hook run after `verilog-delete-auto` deletes AUTOs. |
| `verilog-before-delete-auto-hook` | Hook run before `verilog-delete-auto` deletes AUTOs. |
| `verilog-getopt-flags-hook` | Hook run after `verilog-getopt-flags` determines option lists. |
| `verilog-before-getopt-flags-hook` | Hook run before `verilog-getopt-flags` determines option lists. |
| `verilog-before-save-font-hook` | Hook run before `verilog-save-font-no-change-functions` removes highlighting. |
| `verilog-after-save-font-hook` | Hook run after `verilog-save-font-no-change-functions` restores highlighting. |

### Miscellaneous

| Variable | Description |
|----------|-------------|
| `verilog-case-fold` | Non-nil means regexps should ignore case. `nil` is recommended. |
| `verilog-minimum-comment-distance` | Minimum lines between `begin` and `end` before a comment is added. |
| `verilog-warn-fatal` | Non-nil means `verilog-warn-error` warnings are fatal errors. |

---

## Variables (Non-Customizable)

| Variable | Description |
|----------|-------------|
| `verilog-tool` | Which tool to use for `compile-command`. One of: `nil`, `verilog-linter`, `verilog-compiler`, `verilog-coverage`, `verilog-preprocessor`, or `verilog-simulator`. |
| `verilog-diff-function` | Function called when `verilog-diff-auto` detects differences. Default is `verilog-diff-report`. |
| `verilog-font-lock-grouping-keywords-face` | Face used for Verilog grouping keywords (begin, end, etc.). |
| `verilog-font-lock-translate-off-face` | Face used for translated-off regions. |

---

## AUTO_TEMPLATE Quick Reference

Templates customize how `/*AUTOINST*/` and `/*AUTOINSTPARAM*/` connect ports.

```verilog
/* InstModule AUTO_TEMPLATE (
       .port_name    (connection_name[]),
       );
*/
InstModule instName (/*AUTOINST*/);
```

### Template Features

| Feature | Syntax | Description |
|---------|--------|-------------|
| Bus subscript copy | `[]` | Replaced with the same bus subscript as the connected port. |
| Multi-dimensional | `[][]` | Handles scalar and multi-dimensional connections. |
| Instance number | `@` | Replaced with the first digits in the instance name. |
| Regexp instance | `AUTO_TEMPLATE "REGEXP"` | `@` is replaced by the first `()` group matching the cell name. |
| Regexp port | `.pci_req\([0-9]+\)_l (net[\1])` | Emacs-style regexp matching on port names. |
| Lisp expression | `@"(lisp-expr)"` | Evaluated with `@` as the instance number. |
| Multiple modules | List module names before `AUTO_TEMPLATE (` | Apply one template to multiple modules. |
| No hookup | `//AUTONOHOOKUP` | Prevents a template line from being parsed for AUTOWIRE, etc. |

### Lisp Template Variables

Available inside `@"(...)"` expressions:

| Variable | Description |
|----------|-------------|
| `vl-name` | Name portion of the port. |
| `vl-bits` | Bus bits portion (e.g., `[2:0]`). |
| `vl-mbits` | Multidimensional array bits (e.g., `[2:0][3:0]`). |
| `vl-width` | Width of the port (e.g., `3` for `[2:0]`). |
| `vl-dir` | Direction: `input`, `output`, `inout`, or `interface`. |
| `vl-memory` | Unpacked array part of the port (e.g., `[5:0]`). |
| `vl-modport` | Modport name (if an interface with modport). |
| `vl-cell-type` | Module name/type of the cell. |
| `vl-cell-name` | Instance name of the cell. |

---

## Special Comments

| Comment | Description |
|---------|-------------|
| `/*AUTO_CONSTANT(signal)*/` | Declare a signal as constant so AUTOSENSE excludes it. |
| `/*AUTO_LISP(expr)*/` | Evaluate a Lisp expression during `verilog-auto-inst` (does not insert text). |
| `/*AUTONOHOOKUP*/` | Prevent a template connection from being parsed for AUTOWIRE, etc. |

---

## CLI Usage (Emacs Batch Mode)

All verilog-mode functions can be invoked from the command line using Emacs `--batch` mode. There are two approaches:

### Dedicated Batch Commands

These wrappers handle file loading, saving, and return non-zero exit codes on failure — ideal for **CI/scripts**:

```bash
# Expand AUTOs
emacs --batch <files.v> -f verilog-batch-auto

# Fix indentation
emacs --batch <files.v> -f verilog-batch-indent

# Delete AUTOs
emacs --batch <files.v> -f verilog-batch-delete-auto

# Inject AUTOs into legacy code
emacs --batch <files.v> -f verilog-batch-inject-auto

# Check if AUTOs are up to date (for regressions)
emacs --batch <files.v> -f verilog-batch-diff-auto
```

### Calling Any Function via `--eval` or `-f`

Any verilog-mode function (not just the `batch-*` variants) can be called in batch mode. Use this when there is no dedicated batch wrapper:

```bash
# Using -f (calls function with no arguments)
emacs --batch file.v -f verilog-auto

# Using --eval for more control
emacs --batch file.v --eval '(verilog-auto)'

# Call a function and save the result
emacs --batch file.v --eval '(verilog-auto)' --eval '(save-buffer)'

# Inject AUTOs and save
emacs --batch file.v --eval '(verilog-inject-auto)' --eval '(save-buffer)'

# Pretty-print declarations and save
emacs --batch file.v --eval '(verilog-pretty-declarations)' --eval '(save-buffer)'

# Set variables before running
emacs --batch file.v \
  --eval '(setq verilog-auto-arg-sort t)' \
  --eval '(setq verilog-case-fold nil)' \
  --eval '(verilog-auto)' \
  --eval '(save-buffer)'

# Process multiple files
emacs --batch file1.v file2.v file3.v -f verilog-batch-auto
```

### Key Differences

| Approach | Saves automatically | Exit code on error | Best for |
|----------|--------------------|--------------------|----------|
| `verilog-batch-*` | Yes | Yes (non-zero) | CI, Makefiles, scripts |
| `-f` / `--eval` | No (add `save-buffer`) | No | Ad-hoc use, functions without batch wrappers |

> **Tip:** When using `--eval`, always add `--eval '(save-buffer)'` at the end if you want changes written to disk.

---

## Local Variables for Per-File Configuration

Place at the end of your Verilog file:

```verilog
// Local Variables:
// verilog-library-directories:("." "subdir" "subdir2")
// verilog-library-files:("/path/technology.v")
// verilog-library-flags:("-y dir -y otherdir")
// verilog-auto-read-includes:t
// verilog-auto-wire-type:"logic"
// verilog-typedef-regexp:"_t$"
// verilog-case-fold:nil
// verilog-auto-arg-sort:t
// verilog-auto-reset-widths:unbased
// vh-macro:"macro_definition"
// End:
```

---

*Source: [https://www.veripool.org/verilog-mode/help/](https://www.veripool.org/verilog-mode/help/)*
