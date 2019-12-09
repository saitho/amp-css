import * as ampHtmlValidator from 'amphtml-validator';
import {AbstractCssWorker} from "./AbstractCssWorker";
import {AssignCssWorker} from "./AssignCssWorker";
import {WorkerInterface} from "./WorkerInterface";

export class ValidateCssWorker extends AbstractCssWorker implements WorkerInterface {
    readonly ampBoilerplate = '<!DOCTYPE html>' +
        '<html amp>' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">' +
        '<link rel="canonical" href="index.html">' +
        '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>' +
        '<script async src="https://cdn.ampproject.org/v0.js"></script>' +
        this.AMP_CUSTOM_CSS_OPENING + this.AMP_CUSTOM_CSS_CLOSING +
        '</head>' +
        '<body></body>' +
        '</html>';

    public async work() {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.checkFileSize()) {
                reject('[AMP] CSS file size extends 50kb!');
                return;
            }

            this.validateHTML()
                .then(() => {
                    resolve();
                })
                .catch((validatorResult) => {
                    let msg = '';
                    for (let i = 0; i < validatorResult.errors.length; i++) {
                        const error = validatorResult.errors[i];
                        msg += 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
                        if (error.specUrl !== null) {
                            msg += ' (see ' + error.specUrl + ')\n';
                        }
                    }
                    reject(msg);
                });
        });
    }

    protected async validateHTML(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            // Assign CSS to HTML boiler plate
            const assignCssWorker = new AssignCssWorker();
            assignCssWorker.setHtml(this.ampBoilerplate);
            assignCssWorker.setCss(this.css);
            const result = await assignCssWorker.work();

            // Validate result
            const validator = await ampHtmlValidator.getInstance();
            const validatorResult = validator.validateString(result);
            console.debug('AMP CSS validation status: ' + validatorResult.status);
            if (validatorResult.status === 'PASS') {
                resolve();
            } else {
                reject(validatorResult);
            }
        });
    }

    protected checkFileSize(): boolean {
        const byteSize = Buffer.from(this.css).byteLength;
        console.debug('CSS byte size is: ' + byteSize);
        return byteSize <= 50000;
    }
}