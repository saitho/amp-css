import {CliInterface} from "../CliInterface";
import * as path from "path";
import * as fs from "fs";

export abstract class AbstractCommand {
    protected caller: CliInterface;
    protected result: any;

    constructor(caller: CliInterface) {
        this.caller = caller;
    }

    getResult(): any {
        return this.result;
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
     * @api private
     */
    protected isDirectory(filePath: string): boolean {
        var isDir;
        try {
            var absolutePath = path.resolve(filePath);
            isDir = fs.statSync(absolutePath).isDirectory();
        } catch (e) {
            isDir = e.code === 'ENOENT';
        }
        return isDir;
    }
}