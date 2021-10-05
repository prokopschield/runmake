import { ChildProcess, exec } from 'child_process';
import fs from 'fs';
import { watch } from 'ts-hound';

export class Maker {
	protected _command: string;
	protected _process: ChildProcess;
	constructor(command = 'make') {
		this._command = command;
		this._process = this.start();
		process.stdin.on('data', (c) => this._process.stdin?.write(c));
	}
	refresh(): ChildProcess {
		this.kill();
		return this.start();
	}
	kill(): boolean {
		return this._process.kill();
	}
	start(): ChildProcess {
		this._process = exec(this._command);
		this._process.stdout?.on('data', (c) => process.stdout.write(c));
		this._process.stderr?.on('data', (c) => process.stderr.write(c));
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
	const modmap = new Map<string, Date>();
	let last_refresh = new Date();
	hound.on('change', async (file: string) => {
		try {
			if (Date.now() - +last_refresh < 1400) return;
			const stat = await fs.promises.stat(file);
			const lastmod = modmap.get(file);
			const nowmod = stat.mtime;
			if (!lastmod || nowmod > lastmod) {
				modmap.set(file, nowmod);
				last_refresh = new Date();
				maker.kill();
				console.clear();
				maker.start();
			}
		} catch (error) {}
	});
}
