import fs from 'fs';
import { watch } from 'ts-hound';
import Maker from './maker';

export default function runmake(directory: string = '.', ...argv: string[]) {
	const maker = new Maker(['make', ...argv].join(' '));
	const hound = watch(directory);
	const modmap = new Map<string, Date>();
	let last_refresh = new Date();
	hound.on('change', async (file: string) => {
		try {
			if (Date.now() - +last_refresh < 140) return;
			const stat = await fs.promises.stat(file);
			const lastmod = modmap.get(file);
			const nowmod = stat.mtime;
			if (!lastmod || nowmod > lastmod) {
				modmap.set(file, nowmod);
				last_refresh = new Date();
				maker.kill();
				await new Promise((resolve) => setTimeout(resolve, 40));
				console.clear();
				maker.start();
			}
		} catch (error) {}
	});
}
