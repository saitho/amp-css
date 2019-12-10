import * as assert from "assert";
import DoneCallback = jest.DoneCallback;
import {CompileCssWorker} from "../../src/Worker/CompileCssWorker";
import * as path from "path";
import {AssignCssWorker} from "../../src/Worker/AssignCssWorker";

describe("AssignCssWorker", () => {
    it("should assign CSS into an empty amp-custom styling tag", (done: DoneCallback) => {
        const worker = new AssignCssWorker();
        worker.setHtml('<style amp-custom></style>');
        worker.setCss('MY-COOL-CSS');
        worker.work()
            .then((modifiedHTML: string) => {
                assert.equal(modifiedHTML, '<style amp-custom>MY-COOL-CSS</style>');
                done();
            })
            .catch(() => done.fail("Worker failed."));
    });

    it("should replace CSS in an existing amp-custom styling tag", (done: DoneCallback) => {
        const worker = new AssignCssWorker();
        worker.setHtml('<style amp-custom>MY-OLD-CSS</style>');
        worker.setCss('MY-COOL-CSS');
        worker.work()
            .then((modifiedHTML: string) => {
                assert.equal(modifiedHTML, '<style amp-custom>MY-COOL-CSS</style>');
                done();
            })
            .catch(() => done.fail("Worker failed."));
    });

    it("should assign CSS in multiline amp-custom tag", (done: DoneCallback) => {
        const worker = new AssignCssWorker();
        worker.setHtml(`<style amp-custom>


</style>`);
        worker.setCss('MY-COOL-CSS');
        worker.work()
            .then((modifiedHTML: string) => {
                assert.equal(modifiedHTML, '<style amp-custom>MY-COOL-CSS</style>');
                done();
            })
            .catch(() => done.fail("Worker failed."));
    });
});