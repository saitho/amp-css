import {WorkerInterface} from "./WorkerInterface";
import * as path from "path";
import * as fs from "fs";
import * as nodeSass from 'node-sass';
import {Result, SassError} from "node-sass";
import {AbstractFileWorker} from "./AbstractFileWorker";

export class CompileCssWorker extends AbstractFileWorker implements WorkerInterface {
    protected includePaths: string[] = [];
    protected minify: boolean = true;

    setIncludePaths(includePaths: string[]) {
        this.includePaths = includePaths;
    }

    setMinify(minify: boolean) {
        this.minify = minify;
    }

    work(): Promise<string> {
        const that = this;
        const fileType = path.extname(this.file).replace('.', '');
        return new Promise<string>(function (resolve, reject) {
            switch (fileType) {
                case 'scss':
                    that.compileSassToCss()
                        .then((css: string) => resolve(css))
                        .catch(reject);
                    break;
                case 'css':
                    resolve(fs.readFileSync(that.file).toString());
                    break;
                default:
                    reject('Unsupported file type ' + fileType);
                    break;
            }
        });
    }

    protected getScssIncludePaths(): string[] {
        const includePaths = this.includePaths;
        // Add folder of processed file to include paths
        if (this.file !== undefined) {
            includePaths.push(path.dirname(this.file));
        }
        return includePaths;
    }

    protected compileSassToCss(): Promise<string> {
        var that = this;
        return new Promise<string>(function(resolve, reject) {
            const sassOptions: nodeSass.Options = {
                includePaths: that.getScssIncludePaths(),
                importer: require('node-sass-tilde-importer'),
                outputStyle: that.minify ? 'compressed' : 'nested',
                file: that.file,
            };

            nodeSass.render(sassOptions, function(err: SassError, result: Result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.css.toString().trim());
            });
        });
    }
}