import { editorInfoField, editorLivePreviewField } from 'obsidian';
import {
	type EditorState,
	type Extension,
	Prec,
	StateField,
} from '@codemirror/state';
import {
	Decoration,
	type DecorationSet,
	EditorView,
} from '@codemirror/view';
import { extractMdxDocument } from '../mdx/parser';
import type { MdxSourceRegion } from '../mdx/types';
import type { NoteRuntime } from '../runtime/note-runtime';
import type { MdxPluginSettings } from '../settings';
import { isMdxEnabled } from '../utils/frontmatter';
import { MdxDefinitionWidget, MdxWidget } from './mdx-widget';

function selectionOverlaps(state: EditorState, region: MdxSourceRegion): boolean {
	return state.selection.ranges.some(
		(selection) => selection.from <= region.to && selection.to >= region.from,
	);
}

function buildDecorations(
	state: EditorState,
	runtime: NoteRuntime,
	getSettings: () => MdxPluginSettings,
): DecorationSet {
	const settings = getSettings();
	const info = state.field(editorInfoField, false);
	const livePreview = state.field(editorLivePreviewField, false);
	const file = info?.file;
	const source = state.doc.toString();
	if (
		!livePreview ||
		!settings.enableInlineMdx ||
		file?.extension !== 'md' ||
		!isMdxEnabled(source, settings.frontmatterProperty)
	) {
		return Decoration.none;
	}

	try {
		const parsed = extractMdxDocument(source, file.path);
		const ranges = [];
		for (const declaration of parsed.declarations) {
			if (!selectionOverlaps(state, declaration)) {
				ranges.push(
					Decoration.replace({
						block: true,
						widget: new MdxDefinitionWidget(),
					}).range(declaration.from, declaration.to),
				);
			}
		}
		for (const region of parsed.regions) {
			if (selectionOverlaps(state, region)) {
				continue;
			}
			ranges.push(
				Decoration.replace({
					block: region.block,
					widget: new MdxWidget(
						runtime,
						{
							path: file.path,
							source: region.source,
							declarations: parsed.declarations,
							lineOffset: region.line - 1,
							cacheKey: region.id,
						},
						region.block,
					),
				}).range(region.from, region.to),
			);
		}
		return Decoration.set(ranges, true);
	} catch {
		return Decoration.none;
	}
}

function enterAdjacentBlock(
	view: EditorView,
	getSettings: () => MdxPluginSettings,
	direction: 'down' | 'up',
): boolean {
	const selection = view.state.selection.main;
	if (!selection.empty || view.state.selection.ranges.length !== 1) {
		return false;
	}

	const settings = getSettings();
	const info = view.state.field(editorInfoField, false);
	const livePreview = view.state.field(editorLivePreviewField, false);
	const file = info?.file;
	const source = view.state.doc.toString();
	if (
		!livePreview ||
		!settings.enableInlineMdx ||
		file?.extension !== 'md' ||
		!isMdxEnabled(source, settings.frontmatterProperty)
	) {
		return false;
	}

	try {
		const parsed = extractMdxDocument(source, file.path);
		const blocks = [...parsed.declarations, ...parsed.regions]
			.filter((region) => region.block)
			.sort((left, right) => left.from - right.from);
		const boundaryBlock = blocks.find(
			(region) => selection.head === region.from || selection.head === region.to,
		);
		if (
			boundaryBlock &&
			((direction === 'down' && selection.head === boundaryBlock.to) ||
				(direction === 'up' && selection.head === boundaryBlock.from))
		) {
			view.dispatch({
				selection: {
					anchor:
						direction === 'down'
							? boundaryBlock.from
							: Math.max(boundaryBlock.from, boundaryBlock.to - 1),
				},
				scrollIntoView: true,
			});
			return true;
		}

		const cursorLine = view.state.doc.lineAt(selection.head);
		const candidate =
			direction === 'down'
				? blocks.find((region) => region.from > selection.head)
				: [...blocks].reverse().find((region) => region.to < selection.head);
		if (!candidate) {
			return false;
		}

		const candidatePosition = direction === 'down' ? candidate.from : candidate.to;
		const candidateLine = view.state.doc.lineAt(candidatePosition);
		const lineDistance = Math.abs(candidateLine.number - cursorLine.number);
		if (lineDistance > 2) {
			return false;
		}

		const gap =
			direction === 'down'
				? view.state.doc.sliceString(cursorLine.to, candidate.from)
				: view.state.doc.sliceString(candidate.to, cursorLine.from);
		if (gap.trim().length > 0) {
			return false;
		}

		view.dispatch({
			selection: {
				anchor:
					direction === 'down'
						? candidate.from
						: Math.max(candidate.from, candidate.to - 1),
			},
			scrollIntoView: true,
		});
		return true;
	} catch {
		return false;
	}
}

export function createLivePreviewExtension(
	runtime: NoteRuntime,
	getSettings: () => MdxPluginSettings,
): Extension {
	const decorations = StateField.define<DecorationSet>({
		create: (state) => buildDecorations(state, runtime, getSettings),
		update: (value, transaction) => {
			const selectionChanged = !transaction.startState.selection.eq(
				transaction.state.selection,
			);
			const infoChanged =
				transaction.startState.field(editorInfoField, false) !==
				transaction.state.field(editorInfoField, false);
			const livePreviewChanged =
				transaction.startState.field(editorLivePreviewField, false) !==
				transaction.state.field(editorLivePreviewField, false);

			if (
				transaction.docChanged ||
				selectionChanged ||
				infoChanged ||
				livePreviewChanged
			) {
				return buildDecorations(transaction.state, runtime, getSettings);
			}

			return value;
		},
		provide: (field) => EditorView.decorations.from(field),
	});

	return [
		decorations,
		Prec.high(
			EditorView.domEventHandlers({
				keydown: (event, view) => {
					if (event.key === 'ArrowDown') {
						return enterAdjacentBlock(view, getSettings, 'down');
					}
					if (event.key === 'ArrowUp') {
						return enterAdjacentBlock(view, getSettings, 'up');
					}
					return false;
				},
			}),
		),
	];
}
