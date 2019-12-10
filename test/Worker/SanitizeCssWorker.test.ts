import {SanitizeCssWorker} from "../../src/Worker/SanitizeCssWorker";
import * as assert from "assert";
import DoneCallback = jest.DoneCallback;

describe("SanitizeCssWorker", () => {
    it("should remove !important from CSS", (done: DoneCallback) => {
        const worker = new SanitizeCssWorker();
        worker.setCss(`body{color:red !important;}`);
        worker.work()
            .then((cleanedCSS: string) => {
                assert.equal(cleanedCSS, 'body{color:red ;}');
                done();
        })
            .catch(() => done.fail("Worker failed."));
    });
});