import {CliInterface} from "./CliInterface";
import {EventEmitter} from "events";
import * as path from "path";
import {ProcessCommand} from "./Commands/ProcessCommand";
import {AssignCommand} from "./Commands/AssignCommand";
import {CommandOptions} from "./CommandOptions";
import meow = require("meow");

export class Cli implements CliInterface {
    protected cli: meow.Result;
    protected emitter: EventEmitter;
    protected options: CommandOptions;
    protected helpText: string;

    constructor() {
        this.helpText = [
            'Usage:',
            'amp-scss process [options] <input.scss>',
            '',
            'Example: Compile foobar.scss to foobar.css',
            'amp-scss process foobar.scss > foobar.css',
            '',
            'Example: Insert CSS of foobar.css into AMP custom CSS area in index.html',
            'amp-scss assign foobar.css index.html',
            '',
            'Options',
            '  -o, --output-dir               Output directory',
            '  -s, --sanitize             Remove !important',
            '  -m, --minify             Minifies CSS',
            '  -q, --quiet                Suppress log output except on error',
            '  -v, --version              Prints version info',
            '  --include-path             Path to look for imported files',
            '  --help                     Print usage info'
        ].join('\n');
    }

    public init() {
        this.initMeow();
        this.assignCommandOptions();
        this.initEmitter();
    }

    protected initMeow() {
        this.cli = meow(this.helpText, {
            flags: {
                quiet: {
                    type: 'boolean',
                    alias: 'q',
                    default: false
                },
                sanitize: {
                    type: 'boolean',
                    alias: 's',
                    default: false
                },
                minify: {
                    type: 'boolean',
                    alias: 'm',
                    default: true
                },
                'output-dir': {
                    type: 'string',
                    alias: 'o'
                },
                'include-path': {
                    type: 'string',
                    default: process.cwd()
                },
            }
        });
    }

    protected initEmitter() {
        this.emitter = new EventEmitter();
        this.emitter.on('error', (err: any) => {
            console.error(err);
            process.exit(1);
        });
        this.emitter.on('warn', (data: any) => {
            if (!this.getCommandOptions().quiet) {
                console.warn(data);
            }
        });
        this.emitter.on('info', (data: any) => {
            if (!this.getCommandOptions().quiet) {
                console.info(data);
            }
        });
        this.emitter.on('log', process.stdout.write.bind(process.stdout));
    }

    protected assignCommandOptions() {
        const args = this.cli.input;
        const options = this.cli.flags;
        options.action = args[0];
        options.src = args[1];

        if (args[2]) {
            options.dest = path.resolve(args[2]);
        } else if (options.outputDir) {
            options.dest = path.join(
                path.resolve(options.outputDir),
                [path.basename(options.src, path.extname(options.src)), '.css'].join(''));  // replace ext.
        }
        this.options = options as CommandOptions;
    }

    public getEmitter(): EventEmitter {
        return this.emitter;
    }

    /**
     * Construct options
     */
    public getCommandOptions(): CommandOptions {
        return this.options;
    }

    public async run() {
        switch (this.getCommandOptions().action) {
            case 'process':
                const process = new ProcessCommand(this);
                process.run()
                    .catch((error) => this.emitter.emit('error', error));
                break;
            case 'assign':
                const assign = new AssignCommand(this);
                assign.run();
                break;
            default:
                // Help
                console.info(this.helpText);
                break;
        }
    }
}