export interface FrontmatterRange {
	raw: string;
	from: number;
	to: number;
	bodyStart: number;
}

export function getFrontmatterRange(source: string): FrontmatterRange | null {
	const start = source.charCodeAt(0) === 0xfeff ? 1 : 0;
	if (!source.startsWith('---', start)) {
		return null;
	}

	const openingEnd = source.indexOf('\n', start);
	if (openingEnd < 0 || source.slice(start, openingEnd).trim() !== '---') {
		return null;
	}

	let lineStart = openingEnd + 1;
	while (lineStart <= source.length) {
		const lineEnd = source.indexOf('\n', lineStart);
		const end = lineEnd < 0 ? source.length : lineEnd;
		if (source.slice(lineStart, end).trim() === '---') {
			const bodyStart = lineEnd < 0 ? end : lineEnd + 1;
			return {
				raw: source.slice(openingEnd + 1, lineStart),
				from: start,
				to: end,
				bodyStart,
			};
		}
		if (lineEnd < 0) {
			break;
		}
		lineStart = lineEnd + 1;
	}

	return null;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isMdxEnabled(
	source: string,
	propertyName: string,
): boolean {
	const frontmatter = getFrontmatterRange(source);
	if (!frontmatter || propertyName.trim().length === 0) {
		return false;
	}

	const property = escapeRegExp(propertyName.trim());
	const matcher = new RegExp(`^\\s*${property}\\s*:\\s*true(?:\\s*(?:#.*)?)?$`, 'i');
	return frontmatter.raw.split(/\r?\n/u).some((line) => matcher.test(line));
}

export function isFrontmatterRecordEnabled(
	frontmatter: unknown,
	propertyName: string,
): boolean {
	if (
		frontmatter === null ||
		typeof frontmatter !== 'object' ||
		propertyName.trim().length === 0
	) {
		return false;
	}

	return Reflect.get(frontmatter, propertyName.trim()) === true;
}
