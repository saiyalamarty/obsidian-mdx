import { readFile, writeFile } from 'node:fs/promises';

const componentStylesPath = new URL(
	'../.build/mdx-components.css',
	import.meta.url,
);
const propertyStylesPath = new URL(
	'../.build/mdx-properties.css',
	import.meta.url,
);
const modulePath = new URL('../.build/mdx-styles.ts', import.meta.url);
const componentStyles = await readFile(componentStylesPath, 'utf8');
const propertyRegistrations = (
	componentStyles.match(/@property\s+--[\w-]+\{[^{}]*\}/gu) ?? []
).join('\n');

if (!propertyRegistrations.includes('@property --tw-border-style')) {
	throw new Error('Tailwind border property registration was not generated.');
}
if (!propertyRegistrations.includes('@property --tw-ring-shadow')) {
	throw new Error('Tailwind ring property registration was not generated.');
}
if (!propertyRegistrations.includes('@property --tw-translate-y')) {
	throw new Error('Tailwind translate property registration was not generated.');
}

await writeFile(propertyStylesPath, propertyRegistrations);
await writeFile(
	modulePath,
	`export const componentStyles = ${JSON.stringify(componentStyles)};\n` +
		`export const propertyRegistrations = ${JSON.stringify(propertyRegistrations)};\n`,
);
