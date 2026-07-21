import { MarkdownRenderChild } from 'obsidian';
import type { MdxRenderRequest } from '../mdx/types';
import type { MdxMountHandle, NoteRuntime } from './note-runtime';

export class ReactRenderChild extends MarkdownRenderChild {
	private mountHandle: MdxMountHandle | null = null;

	constructor(
		containerEl: HTMLElement,
		private readonly runtime: NoteRuntime,
		private readonly request: MdxRenderRequest,
	) {
		super(containerEl);
	}

	onload(): void {
		this.mountHandle = this.runtime.createMount(this.containerEl, this.request);
	}

	onunload(): void {
		this.mountHandle?.dispose();
		this.mountHandle = null;
	}
}
