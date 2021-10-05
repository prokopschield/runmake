import { ChildProcess, exec } from 'child_process';
import { watch } from 'ts-hound';

export class Maker {
	protected _command: string;
	protected _process: ChildProcess;
	constructor(command = 'make') {
		this._command = command;
		this._process = this.start();
	}
	refresh(): ChildProcess {
		this._process.kill();
		return this.start();
	}
	kill(): boolean {
		this._process.stdout?.unpipe(process.stdout);
		this._process.stderr?.unpipe(process.stderr);
		this._process.stdin && process.stdin.unpipe(this._process.stdin);
		return this._process.kill();
	}
	start(): ChildProcess {
		this._process = exec(this._command);
		this._process.stdout?.pipe(process.stdout);
		this._process.stderr?.pipe(process.stderr);
		process.stdin.pipe(process.stdin);
		return this._process;
	}
	get command() {
		return this._command;
	}
	set command(command: string) {
		this._command = command;
	}
	get process() {
		return this._process;
	}
}

export default function runmake(directory: string = '.', ...argv: string[]) {
	const maker = new Maker(['make', ...argv].join(' '));
	const hound = watch(directory);
	hound.on('change', () => maker.refresh());
}
