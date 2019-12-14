import {EventEmitter} from "events";
import {CommandOptions} from "./CommandOptions";
import {CommandListType} from "./Commands/CommandListType";

export interface CliInterface {
    getEmitter(): EventEmitter
    getOptions(): CommandOptions
    getCommands(): CommandListType
}