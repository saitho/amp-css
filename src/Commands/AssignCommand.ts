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

            if (!commandOptions.hasOwnProperty('src') || !commandOptions.src.length) {
                throw Error('Missing option "src".');
            } else if (!commandOptions.hasOwnProperty('dest') || !commandOptions.dest.length) {
                throw Error('Missing option "dest".');
            }
            const cssContent = fs.readFileSync(commandOptions.src).toString();
            const htmlContent = fs.readFileSync(commandOptions.dest).toString();

            this.doWork(cssContent, htmlContent)
                .then((result: string) => {
                    fs.writeFileSync(commandOptions.dest, result);
                    resolve();
                }).catch((error) => reject(error));
        });
    }

    /**
     * @internal public only for unit tests
     */
    public doWork(cssContent: string, htmlContent: string) {
        const assignCssWorker = new AssignCssWorker();
        assignCssWorker.setCss(cssContent);
        assignCssWorker.setHtml(htmlContent);
        return assignCssWorker.work();
    }
}