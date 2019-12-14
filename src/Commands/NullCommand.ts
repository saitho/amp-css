import {AbstractCommand} from "./AbstractCommand";
import {CommandInterface} from "./CommandInterface";

/**
 * NullCommand
 * Does not do anything! Use only for tests - implement run method via spy
 */
export class NullCommand extends AbstractCommand implements CommandInterface  {
    public run(): Promise<void> {
        return new Promise<void>(() => {});
    }
}