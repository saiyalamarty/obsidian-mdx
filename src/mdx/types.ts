export type MdxRegionKind = 'declaration' | 'flow' | 'inline';

export interface MdxSourceRegion {
	id: string;
	kind: MdxRegionKind;
	source: string;
	from: number;
	to: number;
	line: number;
	column: number;
	block: boolean;
}

export interface ParsedMdxDocument {
	path: string;
	source: string;
	declarations: MdxSourceRegion[];
	regions: MdxSourceRegion[];
}

export interface PreparedMdxNote extends ParsedMdxDocument {
	transformed: string;
}

export interface MdxRenderRequest {
	path: string;
	source: string;
	declarations?: readonly MdxSourceRegion[];
	lineOffset?: number;
	cacheKey?: string;
}

export interface MdxErrorDetails {
	message: string;
	line?: number;
	column?: number;
}
