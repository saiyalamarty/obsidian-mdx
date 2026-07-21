import { describe, expect, it } from 'vitest';
import { getFrontmatterRange, isMdxEnabled } from '../src/utils/frontmatter';

describe('frontmatter MDX opt-in', () => {
	it('requires an explicit boolean true property', () => {
		expect(isMdxEnabled('---\nmdx: true\n---\n# Note', 'mdx')).toBe(true);
		expect(isMdxEnabled('---\nmdx: false\n---\n# Note', 'mdx')).toBe(false);
		expect(isMdxEnabled('---\nmdx: "true"\n---\n# Note', 'mdx')).toBe(false);
		expect(isMdxEnabled('# mdx: true', 'mdx')).toBe(false);
	});

	it('supports a configurable property and trailing comments', () => {
		const source = '---\ntrusted-mdx: true # private vault\n---\nBody';
		expect(isMdxEnabled(source, 'trusted-mdx')).toBe(true);
		expect(isMdxEnabled(source, 'mdx')).toBe(false);
	});

	it('returns the untouched body boundary', () => {
		const source = '---\ntitle: Test\nmdx: true\n---\n# Heading';
		const range = getFrontmatterRange(source);
		expect(source.slice(range?.bodyStart)).toBe('# Heading');
	});
});
