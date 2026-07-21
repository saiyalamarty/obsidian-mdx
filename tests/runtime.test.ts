// @vitest-environment jsdom

import { fireEvent, waitFor } from '@testing-library/dom';
import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { NoteRuntime } from '../src/runtime/note-runtime';

afterEach(() => {
	document.body.replaceChildren();
});

describe('React root lifecycle', () => {
	it('unmounts the root and clears its isolated portal container', async () => {
		const runtime = new NoteRuntime(() => false);
		const container = document.createElement('div');
		document.body.append(container);
		const handle = runtime.createMount(container, {
			path: 'Lifecycle.md',
			source: '<span>Mounted</span>',
		});

		await waitFor(
			() =>
				expect(
					container.shadowRoot?.querySelector('.obsidian-mdx-react-root')
						?.textContent,
				).toBe('Mounted'),
			{ timeout: 5_000 },
		);
		const propertyStyles = document.head.querySelectorAll(
			'style[data-obsidian-mdx-properties="true"]',
		);
		expect(propertyStyles).toHaveLength(1);
		expect(propertyStyles[0]?.textContent).toContain(
			'@property --tw-border-style',
		);
		expect(propertyStyles[0]?.textContent).toContain(
			'@property --tw-translate-y',
		);
		expect(propertyStyles[0]?.textContent).toContain(
			'@property --tw-ring-shadow',
		);
		expect(container.shadowRoot).not.toBeNull();
		expect(
			container.shadowRoot?.querySelector('.obsidian-mdx-portal-root'),
		).not.toBeNull();
		expect(document.querySelector('.obsidian-mdx-portal-root')).toBeNull();

		handle.dispose();
		expect(container.shadowRoot?.childElementCount).toBe(0);
		expect(
			document.head.querySelector('style[data-obsidian-mdx-properties="true"]'),
		).toBeNull();
		runtime.dispose();
	});

	it('shares document-level Tailwind registrations until the last mount unloads', async () => {
		const runtime = new NoteRuntime(() => false);
		const first = document.createElement('div');
		const second = document.createElement('div');
		document.body.append(first, second);
		const firstHandle = runtime.createMount(first, {
			path: 'First.md',
			source: '<span>First</span>',
		});
		const secondHandle = runtime.createMount(second, {
			path: 'Second.md',
			source: '<span>Second</span>',
		});

		await waitFor(() =>
			expect(
				second.shadowRoot?.querySelector('.obsidian-mdx-react-root')?.textContent,
			).toBe('Second'),
		);
		expect(
			document.head.querySelectorAll(
				'style[data-obsidian-mdx-properties="true"]',
			),
		).toHaveLength(1);
		firstHandle.dispose();
		expect(
			document.head.querySelector('style[data-obsidian-mdx-properties="true"]'),
		).not.toBeNull();
		secondHandle.dispose();
		expect(
			document.head.querySelector('style[data-obsidian-mdx-properties="true"]'),
		).toBeNull();
		runtime.dispose();
	});

	it('does not mount after a widget is destroyed during lazy initialization', async () => {
		const runtime = new NoteRuntime(() => false);
		const container = document.createElement('div');
		document.body.append(container);
		const handle = runtime.createMount(container, {
			path: 'Race.md',
			source: '<span>Too late</span>',
		});

		handle.dispose();
		await new Promise((resolve) => window.setTimeout(resolve, 25));
		expect(container.shadowRoot?.childElementCount ?? 0).toBe(0);
		expect(document.querySelector('.obsidian-mdx-portal-root')).toBeNull();
		runtime.dispose();
	});

	it('renders and interacts with the MDX preview fixture', async () => {
		const runtime = new NoteRuntime(() => false);
		const source = readFileSync('examples/mdx-preview.md', 'utf8');
		const prepared = runtime.prepareNote('MDX Preview.md', source);
		const request = runtime.getPreparedRegion(
			'MDX Preview.md',
			prepared.regions[0]?.id ?? '',
		);
		expect(request).not.toBeNull();

		const container = document.createElement('div');
		document.body.append(container);
		const handle = runtime.createMount(container, request!);

		await waitFor(
			() => expect(container.shadowRoot?.textContent).toContain('Savings targets'),
			{ timeout: 10_000 },
		);
		expect(container.shadowRoot?.textContent).toContain('Recent transactions');
		expect(container.shadowRoot?.textContent).not.toContain('MDX compile error');

		const secondTab = Array.from(
			container.shadowRoot?.querySelectorAll('[data-slot="tabs-trigger"]') ?? [],
		).find((element) => element.textContent === '02');
		expect(secondTab).not.toBeNull();
		fireEvent.click(secondTab!);
		await waitFor(() =>
			expect(container.shadowRoot?.textContent).toContain('UI elements'),
		);
		expect(container.shadowRoot?.textContent).toContain('Share feedback');
		expect(
			container.shadowRoot?.querySelectorAll('[data-slot="chart"]'),
		).toHaveLength(4);
		expect(
			container.shadowRoot?.querySelectorAll('.recharts-wrapper').length,
		).toBeGreaterThanOrEqual(4);

		const selectTrigger = Array.from(
			container.shadowRoot?.querySelectorAll('[data-slot="select-trigger"]') ?? [],
		).find((element) => element.textContent?.includes('Editor'));
		expect(selectTrigger).not.toBeNull();
		fireEvent.click(selectTrigger!);
		await waitFor(() =>
			expect(
				container.shadowRoot?.querySelector('[data-slot="select-content"]'),
			).not.toBeNull(),
		);
		const selectContent = container.shadowRoot?.querySelector<HTMLElement>(
			'[data-slot="select-content"]',
		);
		expect(selectContent?.dataset.alignTrigger).toBe('false');
		expect(selectContent?.dataset.side).toBe('bottom');
		fireEvent.keyDown(selectTrigger!, { key: 'Escape' });
		await waitFor(() =>
			expect(
				container.shadowRoot?.querySelector('[data-slot="select-content"]'),
			).toBeNull(),
		);

		const menuTrigger = container.shadowRoot?.querySelector(
			'[data-slot="dropdown-menu-trigger"]',
		);
		fireEvent.click(menuTrigger!);
		await waitFor(
			() => expect(container.shadowRoot?.textContent).toContain('Mark as read'),
			{ timeout: 5_000 },
		);
		expect(container.shadowRoot?.textContent).not.toContain(
			'base-ui.com/production-error',
		);

		handle.dispose();
		runtime.dispose();
	}, 15_000);
});
