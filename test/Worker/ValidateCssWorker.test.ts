import DoneCallback = jest.DoneCallback;
import {ValidateCssWorker} from "../../src/Worker/ValidateCssWorker";

describe("ValidateCssWorker", () => {
    it("should validate valid CSS", (done: DoneCallback) => {
        const worker = new ValidateCssWorker();
        worker.setCss(`body{color:red;}`);
        worker.work()
            .then(() => done())
            .catch((e) => done.fail("Validation failed: " + e));
    });
    it("should fail on invalid CSS", (done: DoneCallback) => {
        const worker = new ValidateCssWorker();
        worker.setCss(`body{color:red !important;}`);
        worker.work()
            .then(() => done.fail('Validation succeeded even though it should not!'))
            .catch(() => done());
    });
    it("should fail on too large CSS", (done: DoneCallback) => {
        const byteCss = `body {font-family: Arial, sans-serif; color: red, border: 1px solid black;}`; // this CSS is 75 byte
        let overMaxBytesCss = '';
        for (let i = 0; i < 1001; i++) {
            overMaxBytesCss = overMaxBytesCss.concat(byteCss);
        }

        const worker = new ValidateCssWorker();
        worker.setCss(overMaxBytesCss);
        worker.work()
            .then(() => done.fail('Validation succeeded even though it should not!'))
            .catch(() => done());
    });
    it("should succeed on CSS being exactly 75kb", (done: DoneCallback) => {
        const byteCss = `body {font-family: Arial, sans-serif; color: red, border: 1px solid black;}`; // this CSS is 75 byte
        let exactlyMaxBytesCss = '';
        for (let i = 0; i < 1000; i++) {
            exactlyMaxBytesCss = exactlyMaxBytesCss.concat(byteCss);
        }

        const worker = new ValidateCssWorker();
        worker.setCss(exactlyMaxBytesCss);
        worker.work()
            .then(() => done())
            .catch(() => done.fail("Validation failed."));
    });
});
