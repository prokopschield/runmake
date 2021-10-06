import { ChildProcess, exec, spawn } from 'child_process';

export default class Runner {
	protected _process: ChildProcess;
	get process() {
		return this._process;
	}
	protected _done: boolean = false;
	get done() {
		return this._done;
	}
	protected _killcb: undefined | ((value: unknown) => void);
	protected _killp = new Promise((resolve) => (this._killcb = resolve));
	kill() {
		this.process.kill();
		return this._killp;
	}
	constructor(cmd: string) {
		this._process = exec(cmd, (error, stdout, stderr) => {
			this._done = true;
			this._killcb?.(this._process.killed);
			this._process.unref();
		});
		this._process.stdout?.pipe(process.stdout);
		this._process.stderr?.pipe(process.stderr);
	}
}
