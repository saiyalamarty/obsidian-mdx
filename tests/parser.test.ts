import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { extractMdxDocument, transformMdxDocument } from '../src/mdx/parser';
import { MdxCompiler } from '../src/mdx/compiler';

const NOTE = `---
title: Proof
mdx: true
---

# Native heading

See [[Finance]].

export function Local({name}) { return <strong>Hello {name}</strong> }

<Card>
  <Local name="Sai" />
</Card>

Inline <Local name="Reader" /> content.

\`\`\`mdx
<Button>Fenced action</Button>
\`\`\`
`;

describe('MDX region extraction', () => {
	it('extracts declarations, flow JSX, and inline JSX but not fenced blocks', () => {
		const parsed = extractMdxDocument(NOTE, 'Proof.md');
		expect(parsed.declarations).toHaveLength(1);
		expect(parsed.regions.map((region) => region.kind)).toEqual(['flow', 'inline']);
		expect(parsed.regions.some((region) => region.source.includes('initial={10}'))).toBe(
			false,
		);
	});

	it('produces stable placeholders without changing native Markdown', () => {
		const first = transformMdxDocument(NOTE, 'Proof.md');
		const second = transformMdxDocument(NOTE, 'Proof.md');
		expect(first.transformed).toBe(second.transformed);
		expect(first.regions.map((region) => region.id)).toEqual(
			second.regions.map((region) => region.id),
		);
		expect(first.transformed).toContain('# Native heading');
		expect(first.transformed).toContain('[[Finance]]');
		expect(first.transformed).toContain('data-obsidian-mdx-id');
		expect(first.transformed).toContain('```mdx\n<Button>Fenced action</Button>');
	});
});

describe('component gallery fixture', () => {
	it('parses and compiles every gallery region', () => {
		const source = readFileSync('examples/component-gallery.md', 'utf8');
		const parsed = extractMdxDocument(source, 'component-gallery.md');
		const compiler = new MdxCompiler();
		expect(parsed.regions.length).toBeGreaterThan(20);
		for (const region of parsed.regions) {
			expect(() =>
				compiler.compile(region.source, 'component-gallery.md', {}, 1, region.line - 1),
			).not.toThrow();
		}
	});
});
