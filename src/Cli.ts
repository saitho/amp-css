import {CliInterface} from "./CliInterface";
import {EventEmitter} from "events";
import * as path from "path";
import {ProcessCommand} from "./Commands/ProcessCommand";
import {AssignCommand} from "./Commands/AssignCommand";
import {CommandOptions} from "./CommandOptions";
import meow = require("meow");
import {CommandListType} from "./Commands/CommandListType";

export class Cli implements CliInterface {
    protected cli: meow.Result<any>;
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

    public getCommands(): CommandListType {
        return {
            process: new ProcessCommand(this),
            assign: new AssignCommand(this),
        };
    }

    public init() {
        this.initMeow();
        this.assignCommandOptions();
        this.emitter = new EventEmitter();
        this.initEmitter(this.emitter);
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

    public initEmitter(emitter: EventEmitter) {
        emitter.on('log', (args: string) => {
            return process.stdout.write.bind(process.stdout)(args + "\n");
        });
        emitter.on('error', (args: string) => {
            process.stderr.write(args + "\n");
            process.exit(1);
        });
        emitter.on('help', (data: any) => emitter.emit('log', data));
    }

    protected assignCommandOptions() {
        const args = this.cli.input;
        const options = this.cli.flags;
        options.action = args[0];
        options.src = args[1];

        if (args[2]) {
            options.dest = path.resolve(args[2]);
        } else if (options.outputDir) {
            const src = options.src as string;
            options.dest = path.join(
                path.resolve(options.outputDir as string),
                [path.basename(src, path.extname(src)), '.css'].join(''));  // replace ext.
        }
        this.options = options as CommandOptions;
    }

    public getEmitter(): EventEmitter {
        return this.emitter;
    }

    /**
     * Construct options
     */
    public getOptions(): CommandOptions {
        return this.options;
    }

    public async run() {
        const requestedCommand = this.getOptions().action;
        const commands = this.getCommands();
        if (!commands.hasOwnProperty(requestedCommand)) {
            this.emitter.emit('help', this.helpText);
            return;
        }
        commands[requestedCommand].run()
            .catch((error) => this.emitter.emit('error', error.toString()));
    }
}