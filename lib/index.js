'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Maker = void 0;
const child_process_1 = require('child_process');
const ts_hound_1 = require('ts-hound');
class Maker {
	constructor(command = 'make') {
		this._command = command;
		this._process = this.start();
	}
	refresh() {
		this._process.kill();
		return this.start();
	}
	kill() {
		var _a, _b;
		(_a = this._process.stdout) === null || _a === void 0
			? void 0
			: _a.unpipe(process.stdout);
		(_b = this._process.stderr) === null || _b === void 0
			? void 0
			: _b.unpipe(process.stderr);
		this._process.stdin && process.stdin.unpipe(this._process.stdin);
		return this._process.kill();
	}
	start() {
		var _a, _b;
		this._process = (0, child_process_1.exec)(this._command);
		(_a = this._process.stdout) === null || _a === void 0
			? void 0
			: _a.pipe(process.stdout);
		(_b = this._process.stderr) === null || _b === void 0
			? void 0
			: _b.pipe(process.stderr);
		process.stdin.pipe(process.stdin);
		return this._process;
	}
	get command() {
		return this._command;
	}
	set command(command) {
		this._command = command;
	}
	get process() {
		return this._process;
	}
}
exports.Maker = Maker;
function runmake(directory = '.', ...argv) {
	const maker = new Maker(['make', ...argv].join(' '));
	const hound = (0, ts_hound_1.watch)(directory);
	hound.on('change', () => maker.refresh());
}
exports.default = runmake;
