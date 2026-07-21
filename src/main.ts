import { MarkdownView, Plugin } from 'obsidian';
import { createLivePreviewExtension } from './editor/live-preview-extension';
import { ReadingViewBridge } from './reading/reading-view-bridge';
import { registerReadingProcessors } from './reading/processors';
import { NoteRuntime } from './runtime/note-runtime';
import {
	DEFAULT_SETTINGS,
	MdxSettingTab,
	type MdxPluginSettings,
} from './settings';

export default class MdxPlugin extends Plugin {
	settings!: MdxPluginSettings;
	private runtime!: NoteRuntime;
	private readingBridge!: ReadingViewBridge;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.runtime = new NoteRuntime(() => this.settings.debugLogging);
		this.readingBridge = new ReadingViewBridge(
			this.runtime,
			() => this.settings,
		);

		registerReadingProcessors(this, this.runtime, () => this.settings);
		this.registerEditorExtension(
			createLivePreviewExtension(this.runtime, () => this.settings),
		);
		this.addSettingTab(new MdxSettingTab(this.app, this));
		this.readingBridge.install();

		this.registerEvent(
			this.app.vault.on('modify', (file) => this.runtime.invalidate(file.path)),
		);
	}

	onunload(): void {
		this.readingBridge.uninstall();
		this.runtime.dispose();
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	getReadingBridgeStatus(): string {
		return this.readingBridge?.getStatus() ?? 'Not initialized.';
	}

	refreshMdxViews(): void {
		for (const leaf of this.app.workspace.getLeavesOfType('markdown')) {
			if (leaf.view instanceof MarkdownView) {
				leaf.view.previewMode.rerender(true);
			}
		}
		this.app.workspace.updateOptions();
	}

	private async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MdxPluginSettings>,
		);
	}
}
