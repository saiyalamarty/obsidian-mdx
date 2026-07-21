import { MarkdownPreviewView } from 'obsidian';
import type { MdxPluginSettings } from '../settings';
import { isMdxEnabled } from '../utils/frontmatter';
import type { NoteRuntime } from '../runtime/note-runtime';

type PreviewSet = (this: MarkdownPreviewView, data: string, clear: boolean) => void;
type PreviewGet = (this: MarkdownPreviewView) => string;

interface PreviewPrototype {
	set?: unknown;
	get?: unknown;
}

export class ReadingViewBridge {
	private readonly originalSource = new WeakMap<MarkdownPreviewView, string>();
	private originalSet: PreviewSet | null = null;
	private originalGet: PreviewGet | null = null;
	private patchedSet: PreviewSet | null = null;
	private patchedGet: PreviewGet | null = null;
	private status = 'Not initialized.';

	constructor(
		private readonly runtime: NoteRuntime,
		private readonly getSettings: () => MdxPluginSettings,
	) {}

	install(): boolean {
		const prototype = MarkdownPreviewView.prototype as unknown as PreviewPrototype;
		if (typeof prototype.set !== 'function' || typeof prototype.get !== 'function') {
			this.status =
				'Unavailable: this Obsidian version does not expose the expected Reading view methods. Raw MDX remains visible.';
			return false;
		}

		const originalSet = prototype.set as PreviewSet;
		const originalGet = prototype.get as PreviewGet;
		if (originalSet.length !== 2 || originalGet.length !== 0) {
			this.status =
				'Unavailable: the Reading view method shape is unsupported. Raw MDX remains visible.';
			return false;
		}

		const { originalSource, runtime } = this;
		const getSettings = this.getSettings;
		const debug = this.debug.bind(this);
		const patchedSet: PreviewSet = function (data, clear): void {
			const settings = getSettings();
			const file = this.file;
			if (
				!settings.enableInlineMdx ||
				file.extension !== 'md' ||
				!isMdxEnabled(data, settings.frontmatterProperty)
			) {
				originalSource.delete(this);
				originalSet.call(this, data, clear);
				return;
			}

			originalSource.set(this, data);
			try {
				const prepared = runtime.prepareNote(file.path, data);
				originalSet.call(this, prepared.transformed, clear);
			} catch (error) {
				debug('Inline transform failed; showing raw source.', error);
				originalSet.call(this, data, clear);
			}
		};
		const patchedGet: PreviewGet = function (): string {
			return originalSource.get(this) ?? originalGet.call(this);
		};

		this.originalSet = originalSet;
		this.originalGet = originalGet;
		this.patchedSet = patchedSet;
		this.patchedGet = patchedGet;
		prototype.set = patchedSet;
		prototype.get = patchedGet;
		this.status =
			'Active. MarkdownPreviewView.set/get are guarded and restored when the plugin unloads.';
		return true;
	}

	uninstall(): void {
		const prototype = MarkdownPreviewView.prototype as unknown as PreviewPrototype;
		if (this.originalSet && prototype.set === this.patchedSet) {
			prototype.set = this.originalSet;
		}
		if (this.originalGet && prototype.get === this.patchedGet) {
			prototype.get = this.originalGet;
		}
		this.originalSet = null;
		this.originalGet = null;
		this.patchedSet = null;
		this.patchedGet = null;
		this.status = 'Inactive because the plugin is unloaded.';
	}

	getStatus(): string {
		return this.status;
	}

	private debug(message: string, detail: unknown): void {
		if (this.getSettings().debugLogging) {
			console.debug(`[obsidian-mdx] ${message}`, detail);
		}
	}
}
