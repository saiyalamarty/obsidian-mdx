// @vitest-environment jsdom

import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { afterEach, describe, expect, it } from 'vitest';
import { editorInfoField, editorLivePreviewField } from 'obsidian';
import type { MarkdownFileInfo } from 'obsidian';
import { createLivePreviewExtension } from '../src/editor/live-preview-extension';
import { MdxDefinitionWidget, MdxWidget } from '../src/editor/mdx-widget';
import type { NoteRuntime } from '../src/runtime/note-runtime';
import type { MdxPluginSettings } from '../src/settings';

afterEach(() => {
	document.body.replaceChildren();
});

describe('Live Preview decorations', () => {
	it('provides block replacements through editor state', () => {
		const source = `---
mdx: true
---

# Native heading

<Card>
  <CardContent>Rendered</CardContent>
</Card>
`;
		const runtime = {
			createMount: () => ({ dispose: () => undefined }),
		} as unknown as NoteRuntime;
		const settings: MdxPluginSettings = {
			debugLogging: false,
			enableFencedMdx: true,
			enableInlineMdx: true,
			frontmatterProperty: 'mdx',
		};
		const state = EditorState.create({
			doc: source,
			extensions: [
				editorInfoField.init(
					() =>
						({
							file: { extension: 'md', path: 'Live preview.md' },
						}) as unknown as MarkdownFileInfo,
				),
				editorLivePreviewField.init(() => true),
				createLivePreviewExtension(runtime, () => settings),
			],
		});
		const parent = document.createElement('div');
		document.body.append(parent);

		const view = new EditorView({ parent, state });
		expect(view.state.doc.toString()).toBe(source);
		const componentStart = source.indexOf('<Card>');
		const componentLine = view.state.doc.lineAt(componentStart);
		const precedingLine = view.state.doc.line(componentLine.number - 2);
		view.dispatch({ selection: { anchor: precedingLine.to } });
		expect(parent.querySelector('.obsidian-mdx-editor-widget')).not.toBeNull();
		view.contentDOM.dispatchEvent(
			new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
		);
		expect(view.state.selection.main.head).toBe(componentStart);
		expect(parent.querySelector('.obsidian-mdx-editor-widget')).toBeNull();

		view.dispatch({ selection: { anchor: source.indexOf('</Card>') + 7 } });
		view.contentDOM.dispatchEvent(
			new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }),
		);
		expect(view.state.selection.main.head).toBe(componentStart);

		view.dispatch({
			selection: { anchor: componentStart + 1 },
		});
		expect(parent.querySelector('.obsidian-mdx-editor-widget')).toBeNull();
		view.destroy();
	});

	it('lets CodeMirror handle surface clicks while preserving React controls', () => {
		const runtime = {
			createMount: () => ({ dispose: () => undefined }),
		} as unknown as NoteRuntime;
		const widget = new MdxWidget(
			runtime,
			{ path: 'Events.md', source: '<Card />' },
			true,
		);
		const surface = document.createElement('div');
		const button = document.createElement('button');
		const buttonLabel = document.createElement('span');
		button.append(buttonLabel);

		expect(
			widget.ignoreEvent({ type: 'mousedown', target: surface } as unknown as Event),
		).toBe(false);
		expect(
			widget.ignoreEvent({ type: 'mousedown', target: buttonLabel } as unknown as Event),
		).toBe(true);
		expect(
			widget.ignoreEvent({
				altKey: true,
				type: 'mousedown',
				target: buttonLabel,
			} as unknown as Event),
		).toBe(false);
		expect(
			widget.ignoreEvent({ type: 'wheel', target: surface } as unknown as Event),
		).toBe(true);
		expect(
			widget.ignoreEvent({
				type: 'mousedown',
				target: surface,
				composedPath: () => [buttonLabel, button, surface],
			} as unknown as Event),
		).toBe(true);

		const definition = new MdxDefinitionWidget();
		expect(definition.ignoreEvent()).toBe(false);
	});
});
