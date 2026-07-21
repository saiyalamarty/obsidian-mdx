import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
	assertNoImports,
	MdxCompileError,
	MdxCompiler,
} from '../src/mdx/compiler';

describe('MDX compiler', () => {
	it('scopes registered and locally declared components', () => {
		const compiler = new MdxCompiler();
		const registry = {
			Badge: ({ children }: { children?: unknown }) =>
				createElement('mark', null, children as string),
		};
		const component = compiler.compile(
			'export function Local() { return <Badge>Local</Badge> }\n\n<Local />',
			'Scope.md',
			registry,
			1,
		);
		const html = renderToStaticMarkup(createElement(component, { components: registry }));
		expect(html).toBe('<mark>Local</mark>');
	});

	it('caches by path, source hash, and registry version', () => {
		const compiler = new MdxCompiler();
		compiler.compile('<span>One</span>', 'Cache.md', {}, 1);
		compiler.compile('<span>One</span>', 'Cache.md', {}, 1);
		expect(compiler.size).toBe(1);
		compiler.compile('<span>Two</span>', 'Cache.md', {}, 1);
		expect(compiler.size).toBe(2);
		compiler.invalidate('Cache.md');
		expect(compiler.size).toBe(0);
	});

	it('rejects static and dynamic imports', () => {
		expect(() => assertNoImports("import Thing from './thing.js'\n\n<Thing />")).toThrow(
			MdxCompileError,
		);
		expect(() => assertNoImports('{await import("https://example.com/x.js")}')).toThrow(
			MdxCompileError,
		);
	});

	it('reports useful source positions', () => {
		const compiler = new MdxCompiler();
		try {
			compiler.compile('<Card>\n  <Broken>\n</Card>', 'Broken.md', {}, 1, 10);
			throw new Error('Expected compilation to fail.');
		} catch (error) {
			expect(error).toBeInstanceOf(MdxCompileError);
			const compileError = error as MdxCompileError;
			expect(compileError.details.line).toBeGreaterThanOrEqual(11);
			expect(compileError.details.column).toBeGreaterThan(0);
		}
	});
});
