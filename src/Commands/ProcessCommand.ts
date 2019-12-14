import {AbstractCommand} from "./AbstractCommand";
import * as fs from "fs";
import {CompileCssWorker} from "../Worker/CompileCssWorker";
import {ValidateCssWorker} from "../Worker/ValidateCssWorker";
import {SanitizeCssWorker} from "../Worker/SanitizeCssWorker";
import {CommandInterface} from "./CommandInterface";
import * as path from "path";
import {CommandOptions} from "../CommandOptions";

export class ProcessCommand extends AbstractCommand implements CommandInterface {
    public run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const commandOptions = this.caller.getOptions();
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
                reject('Input must not be a directory.');
                return;
            }

            // Compile file
            const that = this;
            this.doCompileWork(commandOptions)
                .then(async function(css: string) {
                    if (commandOptions.sanitize) {
                        css = await that.doSanitizeWork(css);
                    }

                    that.doValidateWork(css)
                        .then(() => {
                            if (commandOptions.hasOwnProperty('dest') && commandOptions.dest.length > 0) {
                                that.caller.getEmitter().emit('log', 'Writing CSS to file ' + commandOptions.dest);
                                const dirname = path.dirname(commandOptions.dest);
                                if (!fs.existsSync(dirname)) {
                                    fs.mkdirSync(dirname);
                                }
                                fs.writeFileSync(commandOptions.dest, css);
                            }
                            resolve();
                        })
                        .catch(reject);
                }).catch(reject);
        });
    }

    /**
     * @internal public only for unit tests
     */
    public doCompileWork(commandOptions: CommandOptions) {
        const compileWorker = new CompileCssWorker();
        compileWorker.setFile(commandOptions.src);
        compileWorker.setMinify(commandOptions.minify);
        compileWorker.setIncludePaths(commandOptions.includePath);
        return compileWorker.work()
    }

    /**
     * @internal public only for unit tests
     */
    public doSanitizeWork(css: string) {
        const sanitizeWorker = new SanitizeCssWorker();
        sanitizeWorker.setCss(css);
        return sanitizeWorker.work();
    }

    /**
     * @internal public only for unit tests
     */
    public doValidateWork(css: string) {
        const validateWorker = new ValidateCssWorker();
        validateWorker.setCss(css);
        return validateWorker.work();
    }
}