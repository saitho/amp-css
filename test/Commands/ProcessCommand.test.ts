import DoneCallback = jest.DoneCallback;
import {anything, objectContaining, spy, verify, when} from "ts-mockito";
import {ProcessCommand} from "../../src/Commands/ProcessCommand";
import * as fs from "fs";
import * as mockfs from "mock-fs";
import {Cli} from "../../src/Cli";
import * as assert from "assert";

describe("ProcessCommand", () => {
    let cli: Cli = null;
    let cliSpy: Cli = null;
    let command: ProcessCommand = null;
    let commandSpy: ProcessCommand = null;

    beforeEach(() => {
        cli = new Cli();
        cli.init();
        command = new ProcessCommand(cli);
        cliSpy = spy(cli);
        commandSpy = spy(command);
        mockfs({
            'scss': {
                'some-file.scss': 'my-scss'
            }
        });
    });

    afterEach(() => {
        mockfs.restore();
    });

    it("Compile + Validate", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            src: 'scss/some-file.scss',
            dest: 'css/some-file.css',
            includePath: ['path1', 'path2']
        });

        when(commandSpy.doCompileWork(anything())).thenResolve('compiled-css');
        when(commandSpy.doValidateWork(anything())).thenResolve();

        command.run()
            .then(() => {
                verify(commandSpy.doCompileWork(objectContaining({ includePath: ['path1', 'path2'] }))).once();
                verify(commandSpy.doValidateWork('compiled-css')).once();
                assert.equal(fs.readFileSync('css/some-file.css'), 'compiled-css');
                done();
            })
            .catch((error) => done(error));
    });

    it("Compile + Sanitize + Validate", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            src: 'scss/some-file.scss',
            dest: 'css/some-file.css',
            sanitize: true,
        });

        when(commandSpy.doCompileWork(anything())).thenResolve('compiled-css');
        when(commandSpy.doSanitizeWork(anything())).thenResolve('sanitized-css');
        when(commandSpy.doValidateWork(anything())).thenResolve();

        command.run()
            .then(() => {
                verify(commandSpy.doCompileWork(anything())).once();
                verify(commandSpy.doSanitizeWork('compiled-css')).once();
                verify(commandSpy.doValidateWork('sanitized-css')).once();
                assert.equal(fs.readFileSync('css/some-file.css'), 'sanitized-css');
                done();
            })
            .catch((error) => done(error));
    });

    it("missing option src should fail", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            dest: 'scss/some-file.css',
        });
        command.run()
            .then(() => done('Expected to fail.'))
            .catch(() => done());
    });

    it("missing option dest should succeed", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({
            src: 'scss/some-file.scss',
        });
        when(commandSpy.doCompileWork(anything())).thenResolve('compiled-css');
        when(commandSpy.doValidateWork(anything())).thenResolve();

        command.run()
            .then(() => {
                verify(commandSpy.doCompileWork(anything())).once();
                verify(commandSpy.doValidateWork('compiled-css')).once();
                done();
            })
            .catch((error) => done(error));
    });

});