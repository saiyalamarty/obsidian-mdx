import { compileSync, createProcessor, runSync } from '@mdx-js/mdx';
import type { ComponentType } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { stableHash } from '../utils/hashing';
import type { MdxErrorDetails } from './types';

export type ComponentRegistry = Readonly<Record<string, unknown>>;

export class MdxCompileError extends Error {
	readonly details: MdxErrorDetails;

	constructor(details: MdxErrorDetails) {
		super(details.message);
		this.name = 'MdxCompileError';
		this.details = details;
	}
}

interface UnknownNode {
	type?: unknown;
	children?: unknown;
	data?: unknown;
}

function containsImport(value: unknown, seen = new Set<object>()): boolean {
	if (value === null || typeof value !== 'object') {
		return false;
	}
	if (seen.has(value)) {
		return false;
	}
	seen.add(value);

	const node = value as UnknownNode;
	if (node.type === 'ImportDeclaration' || node.type === 'ImportExpression') {
		return true;
	}

	return Object.values(value).some((child) => containsImport(child, seen));
}

export function assertNoImports(source: string): void {
	const tree: unknown = createProcessor({ format: 'mdx' }).parse(source);
	if (containsImport(tree)) {
		throw new MdxCompileError({
			message:
				'Imports are not supported. Register components with the plugin and use them directly.',
		});
	}
}

function normalizeError(error: unknown, lineOffset: number): MdxCompileError {
	if (error instanceof MdxCompileError) {
		return error;
	}

	const record =
		error !== null && typeof error === 'object'
			? (error as Record<string, unknown>)
			: null;
	const place = record?.place;
	const placeRecord =
		place !== null && typeof place === 'object'
			? (place as Record<string, unknown>)
			: null;
	const start = placeRecord?.start;
	const point =
		start !== null && typeof start === 'object'
			? (start as Record<string, unknown>)
			: placeRecord;
	const line = typeof point?.line === 'number' ? point.line + lineOffset : undefined;
	const column = typeof point?.column === 'number' ? point.column : undefined;
	const message =
		error instanceof Error ? error.message : 'Unable to compile this MDX region.';
	return new MdxCompileError({ message, line, column });
}

function scopeDeclaration(registry: ComponentRegistry): string {
	const identifiers = Object.keys(registry).filter((key) =>
		/^[$A-Z_a-z][$\w]*$/u.test(key),
	);
	return identifiers.length === 0
		? ''
		: `const {${identifiers.join(',')}} = arguments[0];\n`;
}

function injectScope(code: string, registry: ComponentRegistry): string {
	const declaration = scopeDeclaration(registry);
	const marker = '"use strict";';
	return code.startsWith(marker)
		? `${marker}\n${declaration}${code.slice(marker.length)}`
		: `${declaration}${code}`;
}

export class MdxCompiler {
	private readonly cache = new Map<string, ComponentType<Record<string, unknown>>>();

	compile(
		source: string,
		path: string,
		registry: ComponentRegistry,
		registryVersion: number,
		lineOffset = 0,
	): ComponentType<Record<string, unknown>> {
		const key = `${path}:${registryVersion}:${stableHash(source)}`;
		const cached = this.cache.get(key);
		if (cached) {
			return cached;
		}

		try {
			assertNoImports(source);
			const compiled = String(
				compileSync(
					{ value: source, path },
					{
						development: false,
						format: 'mdx',
						outputFormat: 'function-body',
					},
				),
			);
			const module = runSync(injectScope(compiled, registry), {
				...jsxRuntime,
				...registry,
				baseUrl: `obsidian-mdx:///${encodeURIComponent(path)}`,
			});
			const component = module.default as ComponentType<Record<string, unknown>>;
			this.cache.set(key, component);
			return component;
		} catch (error) {
			throw normalizeError(error, lineOffset);
		}
	}

	invalidate(path: string): void {
		for (const key of this.cache.keys()) {
			if (key.startsWith(`${path}:`)) {
				this.cache.delete(key);
			}
		}
	}

	clear(): void {
		this.cache.clear();
	}

	get size(): number {
		return this.cache.size;
	}
}
