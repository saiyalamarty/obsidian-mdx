// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from '../src/components/ui/slider';
import {
	COMPONENT_REGISTRY_VERSION,
	getComponentRegistry,
} from '../src/components/registry';

declare global {
	interface ImportMeta {
		glob<T>(
			pattern: string,
			options: { eager: true },
		): Record<string, T>;
	}
}

const modules = import.meta.glob<Record<string, unknown>>(
	'../src/components/ui/*.tsx',
	{ eager: true },
);

describe('component registry', () => {
	it('exports every runtime value from every generated shadcn module', () => {
		const registry = getComponentRegistry();
		expect(Object.keys(modules)).toHaveLength(60);
		for (const module of Object.values(modules)) {
			for (const [name, value] of Object.entries(module)) {
				expect(registry[name], name).toBe(value);
			}
		}
	});

	it('includes reusable runtime utilities behind a versioned scope', () => {
		const registry = getComponentRegistry();
		expect(COMPONENT_REGISTRY_VERSION).toBeGreaterThan(1);
		for (const name of [
			'React',
			'Recharts',
			'useState',
			'Card',
			'Dialog',
			'Popover',
			'Tooltip',
			'Select',
			'Icon',
			'DynamicIcon',
			'lucideIconNames',
		]) {
			expect(registry).toHaveProperty(name);
		}
		expect(registry).not.toHaveProperty('Counter');
		expect(registry).not.toHaveProperty('MortgageCalculator');
		expect(registry.Recharts).toHaveProperty('BarChart');
		expect(registry.Recharts).toHaveProperty('PieChart');
	});

	it('renders any Lucide icon by kebab-case or shadcn-style name', async () => {
		const registry = getComponentRegistry();
		const Icon = registry.Icon as ComponentType<{
			name: string;
			'aria-label': string;
		}>;
		const rendered = render(
			<div>
				<Icon aria-label="Camera" name="camera" />
				<Icon aria-label="Circle plus" name="CirclePlusIcon" />
			</div>,
		);

		await waitFor(() =>
			expect(rendered.container.querySelectorAll('svg')).toHaveLength(2),
		);
		expect(registry.lucideIconNames).toContain('camera');
		expect(registry.lucideIconNames).toContain('circle-plus');
	});

	it('renders an accessible fallback for an unknown Lucide icon', () => {
		const registry = getComponentRegistry();
		const Icon = registry.Icon as ComponentType<{ name: string }>;
		const rendered = render(<Icon name="not-a-real-icon" />);
		expect(
			rendered.container.querySelector('[data-lucide-missing="not-a-real-icon"]'),
		).not.toBeNull();
	});

	it('emits a scalar when a one-thumb Slider changes', () => {
		const onValueChange = vi.fn();
		const rendered = render(
			<Slider
				aria-label="Rate"
				max={10}
				min={0}
				onValueChange={onValueChange}
				value={6.5}
			/>,
		);
		const input = rendered.container.querySelector<HTMLInputElement>(
			'input[type="range"]',
		);
		expect(input).not.toBeNull();
		fireEvent.change(input!, { target: { value: '7' } });
		expect(onValueChange).toHaveBeenCalled();
		expect(onValueChange.mock.calls.at(-1)?.[0]).toBe(7);
	});
});
