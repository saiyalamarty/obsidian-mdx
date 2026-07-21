import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			obsidian: fileURLToPath(new URL('./tests/obsidian-mock.ts', import.meta.url)),
		},
	},
});
