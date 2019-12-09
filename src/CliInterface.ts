import {EventEmitter} from "events";
import {CommandOptions} from "./CommandOptions";

export interface CliInterface {
    getEmitter(): EventEmitter
    getCommandOptions(): CommandOptions
}