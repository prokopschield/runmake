/// <reference types="node" />
import { ChildProcess } from 'child_process';
export declare class Maker {
	protected _command: string;
	protected _process: ChildProcess;
	constructor(command?: string);
	refresh(): ChildProcess;
	kill(): boolean;
	start(): ChildProcess;
	get command(): string;
	set command(command: string);
	get process(): ChildProcess;
}
export default function runmake(directory?: string, ...argv: string[]): void;
