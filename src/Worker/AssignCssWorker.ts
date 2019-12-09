import {AbstractCssWorker} from "./AbstractCssWorker";
import {WorkerInterface} from "./WorkerInterface";

export class AssignCssWorker extends AbstractCssWorker implements WorkerInterface {
    protected html: string;
    protected css: string;

    public setHtml(html: string) {
        this.html = html;
    }
    public setCss(css: string) {
        this.css = css;
    }

    public async work() {
        return new Promise<string>((resolve) => {
            const result = this.html.replace(
                RegExp(
                    this.AMP_CUSTOM_CSS_OPENING.replace('/', '\\/') +
                    '[\\s\\S]*' +
                    this.AMP_CUSTOM_CSS_CLOSING.replace('/', '\\/')
                ),
                this.AMP_CUSTOM_CSS_OPENING + this.css.trim() + this.AMP_CUSTOM_CSS_CLOSING
            );
            resolve(result);
        });
    }
}