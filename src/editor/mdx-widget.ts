import { WidgetType, type EditorView } from '@codemirror/view';
import type { MdxRenderRequest } from '../mdx/types';
import type { MdxMountHandle, NoteRuntime } from '../runtime/note-runtime';

export class MdxWidget extends WidgetType {
	private handle: MdxMountHandle | null = null;

	constructor(
		private readonly runtime: NoteRuntime,
		private readonly request: MdxRenderRequest,
		private readonly block: boolean,
	) {
		super();
	}

	eq(other: MdxWidget): boolean {
		return (
			other.request.path === this.request.path &&
			other.request.cacheKey === this.request.cacheKey &&
			other.request.source === this.request.source
		);
	}

	toDOM(view: EditorView): HTMLElement {
		const element = view.dom.ownerDocument.createElement(this.block ? 'div' : 'span');
		element.className = 'obsidian-mdx-editor-widget';
		this.handle = this.runtime.createMount(element, this.request);
		return element;
	}

	destroy(): void {
		this.handle?.dispose();
		this.handle = null;
	}

	ignoreEvent(event: Event): boolean {
		const pointerEvent = event as MouseEvent;
		if (pointerEvent.altKey === true) {
			return false;
		}

		if (
			event.type === 'wheel' ||
			event.type === 'touchstart' ||
			event.type === 'touchmove'
		) {
			return true;
		}

		const path =
			typeof event.composedPath === 'function'
				? event.composedPath()
				: [event.target];
		const target = path
			.find(
				(candidate): candidate is Element =>
					candidate !== null &&
					typeof candidate === 'object' &&
					'closest' in candidate &&
					typeof candidate.closest === 'function',
			);
		if (typeof target?.closest !== 'function') {
			return false;
		}

		return (
			target.closest(
				[
					'a[href]',
					'button',
					'input',
					'option',
					'select',
					'textarea',
					'[contenteditable="true"]',
					'[role="button"]',
					'[role="checkbox"]',
					'[role="combobox"]',
					'[role="link"]',
					'[role="menuitem"]',
					'[role="option"]',
					'[role="radio"]',
					'[role="scrollbar"]',
					'[role="slider"]',
					'[role="switch"]',
					'[role="tab"]',
				].join(','),
			) !== null
		);
	}
}

export class MdxDefinitionWidget extends WidgetType {
	toDOM(view: EditorView): HTMLElement {
		const element = view.dom.ownerDocument.createElement('div');
		element.className = 'obsidian-mdx-definition-widget';
		element.textContent = 'Local MDX component definition — select to edit';
		return element;
	}

	ignoreEvent(): boolean {
		return false;
	}
}
