import * as assert from "assert";
import DoneCallback = jest.DoneCallback;
import {CompileCssWorker} from "../../src/Worker/CompileCssWorker";
import * as path from "path";

describe("CompileCssWorker", () => {
    it("should compile SCSS to CSS. minify = true", (done: DoneCallback) => {
        const worker = new CompileCssWorker();
        worker.setFile(path.join(__dirname, '..', 'files', 'simple-file.scss'));
        worker.work()
            .then((compiledCss: string) => {
                assert.equal(compiledCss, 'body{color:red}');
                done();
            })
            .catch(() => done.fail("Worker failed."));
    });
    it("should compile SCSS to CSS. minify = false", (done: DoneCallback) => {
        const worker = new CompileCssWorker();
        worker.setFile(path.join(__dirname, '..', 'files', 'simple-file.scss'));
        worker.setMinify(false);
        worker.work()
            .then((compiledCss: string) => {
                assert.equal(compiledCss, `body {
  color: red; }`);
                done();
            })
            .catch((err: string) => done.fail("Worker failed: " + err));
    });
    it("should compile SCSS with import to CSS", (done: DoneCallback) => {
        const worker = new CompileCssWorker();
        worker.setFile(path.join(__dirname, '..', 'files', 'advanced-file.scss'));
        worker.work()
            .then((compiledCss: string) => {
                assert.equal(compiledCss, 'body{color:red}');
                done();
            })
            .catch((error: string) => done.fail("Worker failed: " + error));
    });
    it("should return CSS file as is", (done: DoneCallback) => {
        const worker = new CompileCssWorker();
        worker.setFile(path.join(__dirname, '..', 'files', 'regular-css.css'));
        worker.work()
            .then((compiledCss: string) => {
                assert.equal(compiledCss, `body {
    color: blue;
}`);
                done();
            })
            .catch((err: string) => done.fail("Worker failed: " + err));
    });
    it("should not process non-CSS and SCSS files", (done: DoneCallback) => {
        const worker = new CompileCssWorker();
        worker.setFile(path.join(__dirname, '..', 'files', 'some-file.html'));
        worker.work()
            .then(() => done.fail('Validation succeeded even though it should not!'))
            .catch(() => done());
    });
});