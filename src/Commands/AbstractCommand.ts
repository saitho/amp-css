import {CliInterface} from "../CliInterface";
import * as path from "path";
import * as fs from "fs";

export abstract class AbstractCommand {
    protected caller: CliInterface;

    constructor(caller: CliInterface) {
        this.caller = caller;
    }

    protected enableQuietMode() {
        console.log = function() {};
        console.debug = function() {};
    }

    /**
     * Is a Directory
     *
     * @param {String} filePath
     * @returns {Boolean}
     */
    protected isDirectory(filePath: string): boolean {
        try {
            const absolutePath = path.resolve(filePath);
            return fs.statSync(absolutePath).isDirectory();
        } catch (e) {
            return e.code === 'ENOENT';
        }
    }
}