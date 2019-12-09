export type CommandOptions = {
    action: string;
    src: string;
    data: string;
    dest: string;
    directory: string;
    outputDir: string;
    //'output-dir': string;
    quiet: boolean;
    sanitize: boolean;
    minify: boolean;
    includePath: string[];
}