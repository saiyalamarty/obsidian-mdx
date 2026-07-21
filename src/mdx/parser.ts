import { createProcessor } from '@mdx-js/mdx';
import { getFrontmatterRange } from '../utils/frontmatter';
import { stableHash } from '../utils/hashing';
import type {
	MdxSourceRegion,
	ParsedMdxDocument,
	PreparedMdxNote,
} from './types';

interface PositionPoint {
	line: number;
	column: number;
	offset?: number;
}

interface PositionedNode {
	type?: unknown;
	children?: unknown;
	position?: {
		start?: PositionPoint;
		end?: PositionPoint;
	};
}

function asNode(value: unknown): PositionedNode | null {
	return value !== null && typeof value === 'object'
		? value
		: null;
}

function regionFromNode(
	node: PositionedNode,
	body: string,
	bodyStart: number,
	path: string,
	kind: MdxSourceRegion['kind'],
	block: boolean,
): MdxSourceRegion | null {
	const start = node.position?.start;
	const end = node.position?.end;
	if (start?.offset === undefined || end?.offset === undefined) {
		return null;
	}

	const from = bodyStart + start.offset;
	const to = bodyStart + end.offset;
	const source = body.slice(start.offset, end.offset);
	return {
		id: stableHash(`${path}:${from}:${to}:${source}`),
		kind,
		source,
		from,
		to,
		line: start.line,
		column: start.column,
		block,
	};
}

function sourceLineAtOffset(source: string, offset: number): number {
	let line = 1;
	for (let index = 0; index < offset; index += 1) {
		if (source.charCodeAt(index) === 10) {
			line += 1;
		}
	}
	return line;
}

function collectNodes(
	value: unknown,
	body: string,
	bodyStart: number,
	path: string,
	declarations: MdxSourceRegion[],
	regions: MdxSourceRegion[],
	insideExecutableRegion = false,
): void {
	const node = asNode(value);
	if (!node || typeof node.type !== 'string') {
		return;
	}

	if (node.type === 'mdxjsEsm') {
		const region = regionFromNode(
			node,
			body,
			bodyStart,
			path,
			'declaration',
			true,
		);
		if (region) {
			declarations.push(region);
		}
		return;
	}

	const isFlow = node.type === 'mdxJsxFlowElement' || node.type === 'mdxFlowExpression';
	const isInline = node.type === 'mdxJsxTextElement' || node.type === 'mdxTextExpression';
	if (!insideExecutableRegion && (isFlow || isInline)) {
		const region = regionFromNode(
			node,
			body,
			bodyStart,
			path,
			isFlow ? 'flow' : 'inline',
			isFlow,
		);
		if (region) {
			regions.push(region);
		}
		return;
	}

	if (Array.isArray(node.children)) {
		for (const child of node.children) {
			collectNodes(
				child,
				body,
				bodyStart,
				path,
				declarations,
				regions,
				insideExecutableRegion || isFlow || isInline,
			);
		}
	}
}

export function extractMdxDocument(
	source: string,
	path: string,
): ParsedMdxDocument {
	const frontmatter = getFrontmatterRange(source);
	const bodyStart = frontmatter?.bodyStart ?? 0;
	const body = source.slice(bodyStart);
	const tree: unknown = createProcessor({ format: 'mdx' }).parse(body);
	const declarations: MdxSourceRegion[] = [];
	const regions: MdxSourceRegion[] = [];
	collectNodes(tree, body, bodyStart, path, declarations, regions);

	const prefixLines = sourceLineAtOffset(source, bodyStart) - 1;
	for (const region of [...declarations, ...regions]) {
		region.line += prefixLines;
	}

	return { path, source, declarations, regions };
}

function placeholderFor(region: MdxSourceRegion): string {
	const attributes = `class="obsidian-mdx-placeholder" data-obsidian-mdx-id="${region.id}"`;
	return region.block
		? `\n<div ${attributes}></div>\n`
		: `<span ${attributes}></span>`;
}

export function transformMdxDocument(
	source: string,
	path: string,
): PreparedMdxNote {
	const parsed = extractMdxDocument(source, path);
	const replacements = [...parsed.declarations, ...parsed.regions].sort(
		(left, right) => right.from - left.from,
	);
	let transformed = source;

	for (const region of replacements) {
		const replacement =
			region.kind === 'declaration'
				? `\n<!-- obsidian-mdx-definition:${region.id} -->\n`
				: placeholderFor(region);
		transformed =
			transformed.slice(0, region.from) +
			replacement +
			transformed.slice(region.to);
	}

	return { ...parsed, transformed };
}
