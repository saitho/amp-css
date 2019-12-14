import DoneCallback = jest.DoneCallback;
import {anyOfClass, spy, verify, when} from "ts-mockito";
import {Cli} from "../src/Cli";
import {EventEmitter} from "events";
import {NullCommand} from "../src/Commands/NullCommand";
import * as assert from "assert";

describe("CLI", () => {
    let cli: Cli = null;
    let cliSpy: Cli = null;
    let command: NullCommand = null;
    let commandSpy: NullCommand = null;

    beforeEach((done: DoneCallback) => {
        cli = new Cli();
        command = new NullCommand(cli);
        cliSpy = spy(cli);
        commandSpy = spy(command);
        done();
    });

    function doTest() {
        cli.init();
        cli.run();
    }

    it("provides commands 'process' and 'assign'", () => {
        const commands = cli.getCommands();
        assert.strictEqual(commands.hasOwnProperty('process'), true);
        assert.strictEqual(commands.hasOwnProperty('assign'), true)
    });

    it("execute command and succeed", () => {
        // Execute command "test"
        when(cliSpy.getOptions()).thenReturn({action: 'test'});
        when(cliSpy.getCommands()).thenReturn({test: command});

        // Command succeeds
        when(commandSpy.run()).thenResolve();

        doTest();

        verify(commandSpy.run()).once();
    });

    it("on unknown command help is printed", (done: DoneCallback) => {
        // Execute command "test"
        when(cliSpy.getOptions()).thenReturn({action: 'unknown'});
        when(cliSpy.getCommands()).thenReturn({test: command});

        // Test succeeds if help event is triggered
        when(cliSpy.initEmitter(anyOfClass(EventEmitter))).thenCall((emitter) => {
            emitter.on('help', () => done());
        });

        doTest();
    });

    it("emits error when command fails", (done: DoneCallback) => {
        when(cliSpy.getOptions()).thenReturn({action: 'test'});
        when(cliSpy.getCommands()).thenReturn({test: command});

        // Command will fail
        when(commandSpy.run()).thenReject();

        // Test succeeds if error event is triggered
        when(cliSpy.initEmitter(anyOfClass(EventEmitter))).thenCall((emitter) => {
            emitter.on('error', () => done());
        });

        doTest();
    });
});