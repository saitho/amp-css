import {AbstractCssWorker} from "./AbstractCssWorker";
import {WorkerInterface} from "./WorkerInterface";

export class SanitizeCssWorker extends AbstractCssWorker implements WorkerInterface {

    work(): Promise<any> {
        return new Promise<string>((resolve) => {
            this.removeImportant();
            resolve(this.css);
        });
    }

    protected removeImportant() {
        this.css = this.css.replace(/!important/g, '');
    }
}