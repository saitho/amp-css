import {AbstractCommand} from "./AbstractCommand";
import {AssignCssWorker} from "../Worker/AssignCssWorker";
import * as fs from "fs";

export class AssignCommand extends AbstractCommand {
    public run() {
        const commandOptions = this.caller.getCommandOptions();
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
        }).catch(() => {
            // Error occurred
        });
    }
}