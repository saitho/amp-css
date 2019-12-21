export type CommandOptions = {
    action?: string;             // Action of the performed command (e.g. compile, assign)
    src?: string;                // Source file
    dest?: string;               // Target file
    outputDir?: string;          // Output CSS file in directory
    quiet?: boolean;             // do not output validation report
    sanitize?: boolean;          // sanitize css
    minify?: boolean;            // minify css
    includePath?: string;        // include paths for SCSS compiler
}