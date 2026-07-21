import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

export interface MdxPluginSettings {
	enableInlineMdx: boolean;
	enableFencedMdx: boolean;
	frontmatterProperty: string;
	debugLogging: boolean;
}

export const DEFAULT_SETTINGS: MdxPluginSettings = {
	enableInlineMdx: true,
	enableFencedMdx: true,
	frontmatterProperty: 'mdx',
	debugLogging: false,
};

export interface MdxSettingsHost extends Plugin {
	settings: MdxPluginSettings;
	saveSettings(): Promise<void>;
	getReadingBridgeStatus(): string;
	refreshMdxViews(): void;
}

export class MdxSettingTab extends PluginSettingTab {
	constructor(
		app: App,
		private readonly host: MdxSettingsHost,
	) {
		super(app, host);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Enable inline MDX')
			.setDesc('Render inline JSX regions in opted-in Markdown notes.')
			.addToggle((toggle) =>
				toggle.setValue(this.host.settings.enableInlineMdx).onChange(async (value) => {
					this.host.settings.enableInlineMdx = value;
					await this.host.saveSettings();
					this.host.refreshMdxViews();
				}),
			);

		new Setting(containerEl)
			.setName('Enable fenced MDX blocks')
			.setDesc('Render independent ```mdx code blocks in opted-in notes.')
			.addToggle((toggle) =>
				toggle.setValue(this.host.settings.enableFencedMdx).onChange(async (value) => {
					this.host.settings.enableFencedMdx = value;
					await this.host.saveSettings();
					this.host.refreshMdxViews();
				}),
			);

		new Setting(containerEl)
			.setName('Frontmatter property')
			.setDesc('Only notes with this property set to true execute MDX.')
			.addText((text) =>
				text
					.setPlaceholder('mdx')
					.setValue(this.host.settings.frontmatterProperty)
					.onChange(async (value) => {
						this.host.settings.frontmatterProperty = value.trim() || 'mdx';
						await this.host.saveSettings();
						this.host.refreshMdxViews();
					}),
			);

		new Setting(containerEl)
			.setName('Debug logging')
			.setDesc('Write MDX bridge and runtime diagnostics to the developer console.')
			.addToggle((toggle) =>
				toggle.setValue(this.host.settings.debugLogging).onChange(async (value) => {
					this.host.settings.debugLogging = value;
					await this.host.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName('Reading view bridge')
			.setDesc(this.host.getReadingBridgeStatus());
	}
}
