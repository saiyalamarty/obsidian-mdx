import type { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import type { MdxPluginSettings } from '../settings';
import { isFrontmatterRecordEnabled } from '../utils/frontmatter';
import type { NoteRuntime } from '../runtime/note-runtime';
import { ReactRenderChild } from '../runtime/react-render-child';

function showSource(el: HTMLElement, source: string): void {
	el.replaceChildren();
	const pre = el.ownerDocument.createElement('pre');
	const code = el.ownerDocument.createElement('code');
	code.className = 'language-mdx';
	code.textContent = source;
	pre.append(code);
	el.append(pre);
}

function canExecute(ctx: MarkdownPostProcessorContext, settings: MdxPluginSettings): boolean {
	return isFrontmatterRecordEnabled(
		ctx.frontmatter as unknown,
		settings.frontmatterProperty,
	);
}

function mountPlaceholder(
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
	runtime: NoteRuntime,
): void {
	if (el.dataset.obsidianMdxMounted === 'true') {
		return;
	}
	const id = el.dataset.obsidianMdxId;
	if (!id) {
		return;
	}
	const request = runtime.getPreparedRegion(ctx.sourcePath, id);
	if (!request) {
		el.classList.add('obsidian-mdx-error');
		el.textContent = 'MDX region expired. Switch notes or reload Reading view.';
		return;
	}

	el.dataset.obsidianMdxMounted = 'true';
	ctx.addChild(new ReactRenderChild(el, runtime, request));
}

export function registerReadingProcessors(
	plugin: Plugin,
	runtime: NoteRuntime,
	getSettings: () => MdxPluginSettings,
): void {
	plugin.registerMarkdownPostProcessor((sectionEl, ctx) => {
		const settings = getSettings();
		if (!settings.enableInlineMdx || !canExecute(ctx, settings)) {
			return;
		}

		if (sectionEl.matches('[data-obsidian-mdx-id]')) {
			mountPlaceholder(sectionEl, ctx, runtime);
		}
		for (const placeholder of Array.from(
			sectionEl.querySelectorAll<HTMLElement>('[data-obsidian-mdx-id]'),
		)) {
			mountPlaceholder(placeholder, ctx, runtime);
		}
	});

	plugin.registerMarkdownCodeBlockProcessor('mdx', (source, el, ctx) => {
		const settings = getSettings();
		if (!settings.enableFencedMdx || !canExecute(ctx, settings)) {
			showSource(el, source);
			return;
		}

		ctx.addChild(
			new ReactRenderChild(el, runtime, {
				path: `${ctx.sourcePath}#mdx-block`,
				source,
			}),
		);
	});
}
