import { StateField } from '@codemirror/state';

export interface MockMarkdownFileInfo {
	file: { extension: string; path: string } | null;
}

export const editorInfoField = StateField.define<MockMarkdownFileInfo>({
	create: () => ({ file: null }),
	update: (value) => value,
});

export const editorLivePreviewField = StateField.define<boolean>({
	create: () => false,
	update: (value) => value,
});
