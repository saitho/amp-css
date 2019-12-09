import {AbstractCommand} from "./AbstractCommand";
import * as fs from "fs";
import {CompileCssWorker} from "../Worker/CompileCssWorker";
import {ValidateCssWorker} from "../Worker/ValidateCssWorker";
import {SanitizeCssWorker} from "../Worker/SanitizeCssWorker";
import {CommandInterface} from "./CommandInterface";
import * as path from "path";

export class ProcessCommand extends AbstractCommand implements CommandInterface {
    public run(): Promise<void> {
        var that = this;
        return new Promise<void>((resolve, reject) => {

            var commandOptions = this.caller.getCommandOptions();
            if (commandOptions.quiet) {
                this.enableQuietMode();
            }
            if (!commandOptions.hasOwnProperty('sanitize')) {
                commandOptions.sanitize = false;
            }

            if (!commandOptions.src) {
                this.caller.getEmitter().emit('error', [
                    'Provide a Sass file to render',
                    '',
                    'Example: Compile foobar.scss to foobar.css',
                    'node-sass foobar.scss > foobar.css'
                ].join('\n'));
            }

            if (this.isDirectory(commandOptions.src)) {
                this.caller.getEmitter().emit('error', 'Input must not be a directory.');
                return;
            }
            if (!Array.isArray(commandOptions.includePath)) {
                commandOptions.includePath = [commandOptions.includePath];
            }

            if (commandOptions.directory) {
                if (!commandOptions.outputDir || !this.isDirectory(commandOptions.outputDir)) {
                    this.caller.getEmitter().emit('error', 'An output directory must be specified when compiling a directory');
                }
            }
            console.log(commandOptions);

            // Compile file
            const compileWorker = new CompileCssWorker();
            compileWorker.setOptions(commandOptions);
            compileWorker.work().then(async function(css: string) {
                if (commandOptions.sanitize) {
                    const sanitizeWorker = new SanitizeCssWorker();
                    css = await sanitizeWorker.work();
                }

                const validateWorker = new ValidateCssWorker();
                validateWorker.setCss(css);
                validateWorker.work()
                    .then(() => {
                        if (commandOptions.dest.length > 0) {
                            console.debug('Writing CSS to file ' + commandOptions.dest);
                            const dirname = path.dirname(commandOptions.dest);
                            if (!fs.existsSync(dirname)) {
                                fs.mkdirSync(dirname);
                            }
                            fs.writeFileSync(commandOptions.dest, css);
                            return;
                        } else {
                            that.result = css;
                            resolve();
                        }
                    })
                    .catch(reject);
            }).catch(reject);
        });
    }
}