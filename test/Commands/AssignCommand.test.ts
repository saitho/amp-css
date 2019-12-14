import DoneCallback = jest.DoneCallback;
import {anyString, spy, verify, when} from "ts-mockito";
import {AssignCommand} from "../../src/Commands/AssignCommand";
import * as fs from "fs";
import * as mockfs from "mock-fs";
import {Cli} from "../../src/Cli";
import * as assert from "assert";

describe("AssignCommand", () => {
    let cli: Cli = null;
    let cliSpy: Cli = null;
    let command: AssignCommand = null;
    let commandSpy: AssignCommand = null;

    beforeEach(() => {
        cli = new Cli();
        command = new AssignCommand(cli);
        cliSpy = spy(cli);
        commandSpy = spy(command);
        mockfs({
            'some-file.css': 'my-css',
            'some-file.html': 'my-html'
        });
    });

    afterEach(() => {
        mockfs.restore();
    });

    it("Worker succeeds", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            src: 'some-file.css',
            dest: 'some-file.html',
        });

        when(commandSpy.doWork(anyString(), anyString())).thenResolve('html');

        command.run()
            .then(() => {
                verify(commandSpy.doWork('my-css', 'my-html')).once();
                assert.equal(fs.readFileSync('some-file.html'), 'html');
                done();
            })
            .catch((error) => done(error));
    });

    it("Worker fails", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            src: 'some-file.css',
            dest: 'some-file.html',
        });

        when(commandSpy.doWork(anyString(), anyString())).thenReject();

        command.run()
            .then(() => done('Expected to fail.'))
            .catch(() => {
                verify(commandSpy.doWork('my-css', 'my-html')).once();
                assert.equal(fs.readFileSync('some-file.html'), 'my-html');
                done();
            });

    });

    it("missing option src should fail", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            dest: 'some-file.html',
        });
        command.run()
            .then(() => done('Expected to fail.'))
            .catch(() => done());
    });

    it("missing option dest should fail", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            src: 'some-file.css',
        });
        command.run()
            .then(() => done('Expected to fail.'))
            .catch(() => done());
    });

});