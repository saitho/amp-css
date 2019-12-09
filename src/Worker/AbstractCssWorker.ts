export abstract class AbstractCssWorker {
    readonly AMP_CUSTOM_CSS_OPENING = '<style amp-custom>';
    readonly AMP_CUSTOM_CSS_CLOSING = '</style>';

    protected css: string;
    setCss(css: string) {
        this.css = css;
    }
}