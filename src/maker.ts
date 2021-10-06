import { ChildProcess } from 'child_process';
import Runner from './runner';

export default class Maker {
	protected _command: string;
	protected _runner: Runner;
	constructor(command = 'make') {
		this._command = command;
		this._runner = this._start();
		process.stdin.on('data', (c) => this.process.stdin?.write(c));
	}
	async refresh(): Promise<ChildProcess> {
		await this.kill();
		return this.start();
	}
	kill() {
		return this._runner.kill();
	}
	protected _start(): Runner {
		return (this._runner = new Runner(this._command));
	}
	start(): ChildProcess {
		return this._start().process;
	}
	get command() {
		return this._command;
	}
	set command(command: string) {
		this._command = command;
	}
	get process() {
		return this._runner.process;
	}
}
