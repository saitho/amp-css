import {AbstractCssWorker} from "./AbstractCssWorker";
import {WorkerInterface} from "./WorkerInterface";
import {CommandOptions} from "../CommandOptions";
import * as path from "path";
import * as fs from "fs";
import * as nodeSass from 'node-sass';
import {Result, SassError} from "node-sass";

export class CompileCssWorker extends AbstractCssWorker implements WorkerInterface {
    protected options: CommandOptions;

    setOptions(options: CommandOptions) {
        this.options = options;
    }

    work(): Promise<string> {
        const that = this;
        const fileType = path.extname(that.options.src).replace('.', '');
        return new Promise<string>(function (resolve, reject) {
            switch (fileType) {
                case 'scss':
                    that.compileSassToCss(that.options)
                        .then((css: string) => {
                            resolve(css);
                        })
                        .catch(reject);
                    break;
                case 'css':
                    if (that.options.hasOwnProperty('data')) {
                        resolve(that.options.data);
                    } else {
                        resolve(fs.readFileSync(that.options.src).toString());
                    }
                    break;
                default:
                    reject('Unsupported file type ' + fileType);
            }
        });
    }

    protected compileSassToCss(options: CommandOptions): Promise<string> {
        var includePaths: string[] = [];
        if (options.hasOwnProperty('includePath')) {
            includePaths = options.includePath;
        }
        // Add folder of processed file to include paths
        if (options.hasOwnProperty('src')) {
            includePaths.push(path.dirname(options.src));
        }

        return new Promise<string>(function(resolve, reject) {
            var sassOptions: nodeSass.Options = {
                includePaths: includePaths,
                importer: require('node-sass-tilde-importer'),
                outputStyle: options.hasOwnProperty('minify') && options.minify ? 'compressed' : 'nested'
            };

            if (options.hasOwnProperty('src')) {
                sassOptions.file = options.src;
            }
            if (options.hasOwnProperty('data')) {
                sassOptions.data = options.data;
            }

            nodeSass.render(sassOptions, function(err: SassError, result: Result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.css.toString());
            });
        });
    }
}