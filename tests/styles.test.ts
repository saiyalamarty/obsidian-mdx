import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('bundled component styles', () => {
	it('embeds standard Tailwind and shadcn styles only inside shadow roots', () => {
		const source = readFileSync('src/styles/tailwind.css', 'utf8');
		const componentStyles = readFileSync('.build/mdx-components.css', 'utf8');
		const propertyStyles = readFileSync('.build/mdx-properties.css', 'utf8');
		const globalStyles = readFileSync('styles.css', 'utf8');
		expect(source).toMatch(
			/^@import "tailwindcss";\n@import "tw-animate-css";\n@import "shadcn\/tailwind.css";/u,
		);
		expect(source).not.toContain('.obsidian-mdx-root :where(button');
		expect(source).not.toContain('.obsidian-mdx-root *::before');
		expect(componentStyles).toContain(
			'.rounded-lg{border-radius:var(--radius)}',
		);
		expect(componentStyles).toContain(
			'border-radius:min(var(--radius-md), 12px)',
		);
		expect(componentStyles).not.toContain(
			'.obsidian-mdx-root.obsidian-mdx-root',
		);
		expect(componentStyles).toMatch(
			/\.obsidian-mdx-root\{[^}]*--radius-md:calc\(var\(--radius\) \* \.8\)/u,
		);
		expect(globalStyles).toContain('.obsidian-mdx-shadow-host');
		expect(globalStyles).not.toContain('tailwindcss');
		expect(globalStyles).not.toContain('.rounded-lg');
		expect(propertyStyles).toContain('@property --tw-border-style');
		expect(propertyStyles).toContain('@property --tw-ring-shadow');
		expect(propertyStyles).toContain('@property --tw-translate-y');
		expect(propertyStyles).not.toContain('.border{');
	});
});
