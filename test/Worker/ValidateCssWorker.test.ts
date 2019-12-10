import {SanitizeCssWorker} from "../../src/Worker/SanitizeCssWorker";
import * as assert from "assert";
import DoneCallback = jest.DoneCallback;
import {ValidateCssWorker} from "../../src/Worker/ValidateCssWorker";

describe("ValidateCssWorker", () => {
    it("should validate valid CSS", (done: DoneCallback) => {
        const worker = new ValidateCssWorker();
        worker.setCss(`body{color:red;}`);
        worker.work()
            .then(() => done())
            .catch(() => done.fail("Validation failed."));
    });
    it("should fail on invalid CSS", (done: DoneCallback) => {
        const worker = new ValidateCssWorker();
        worker.setCss(`body{color:red !important;}`);
        worker.work()
            .then(() => done.fail('Validation succeeded even though it should not!'))
            .catch(() => done());
    });
    it("should fail on too large CSS", (done: DoneCallback) => {
        const fiftyByteCss = `body { font-size: 15px; border: 1px solid black; }`; // this CSS is 50 byte
        let overFiftykBytesCss = '';
        for (let i = 0; i < 1001; i++) {
            overFiftykBytesCss = overFiftykBytesCss.concat(fiftyByteCss);
        }

        const worker = new ValidateCssWorker();
        worker.setCss(overFiftykBytesCss);
        worker.work()
            .then(() => done.fail('Validation succeeded even though it should not!'))
            .catch(() => done());
    });
    it("should succeed on CSS being exactly 50kb", (done: DoneCallback) => {
        const fiftyByteCss = `body { font-size: 15px; border: 1px solid black; }`; // this CSS is 50 byte
        let exactlyFiftykBytesCss = '';
        for (let i = 0; i < 1000; i++) {
            exactlyFiftykBytesCss = exactlyFiftykBytesCss.concat(fiftyByteCss);
        }

        const worker = new ValidateCssWorker();
        worker.setCss(exactlyFiftykBytesCss);
        worker.work()
            .then(() => done())
            .catch(() => done.fail("Validation failed."));
    });
});