import {AbstractCommand} from "./AbstractCommand";
import {AssignCssWorker} from "../Worker/AssignCssWorker";
import * as fs from "fs";
import {CommandInterface} from "./CommandInterface";

export class AssignCommand extends AbstractCommand implements CommandInterface  {
    public run(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const commandOptions = this.caller.getOptions();
            if (commandOptions.quiet) {
                this.enableQuietMode();
            }

            if (!commandOptions.src) {
                this.caller.getEmitter().emit('error', [
                    'Provide a CSS file',
                    '',
                    'Example: Insert CSS of foobar.css into AMP custom CSS area in index.html',
                    'node-sass assign foobar.css index.html'
                ].join('\n'));
            }
            if (!commandOptions.dest) {
                this.caller.getEmitter().emit('error', [
                    'Provide a HTML file',
                    '',
                    'Example: Insert CSS of foobar.css into AMP custom CSS area in index.html',
                    'node-sass assign foobar.css index.html'
                ].join('\n'));
            }

            if (!commandOptions.hasOwnProperty('src')) {
                throw Error('Missing option "src".');
            } else if (!commandOptions.hasOwnProperty('dest')) {
                throw Error('Missing option "dest".');
            }
            const cssContent = fs.readFileSync(commandOptions.src).toString();
            const htmlContent = fs.readFileSync(commandOptions.dest).toString();

            const assignCssWorker = new AssignCssWorker();
            assignCssWorker.setCss(cssContent);
            assignCssWorker.setHtml(htmlContent);
            assignCssWorker.work().then((result) => {
                fs.writeFileSync(commandOptions.dest, result);
                resolve();
            }).catch((error) => reject(error));
        });
    }
}