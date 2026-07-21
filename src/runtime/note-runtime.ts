import type { Root } from 'react-dom/client';
import type { ComponentType, ReactNode } from 'react';
import type { MdxCompiler } from '../mdx/compiler';
import { transformMdxDocument } from '../mdx/parser';
import type {
	MdxRenderRequest,
	MdxSourceRegion,
	PreparedMdxNote,
} from '../mdx/types';
import type { MdxShadowSurface } from './shadow-surface';

export interface MdxMountHandle {
	dispose(): void;
}

export class NoteRuntime {
	private readonly activeMounts = new Set<() => void>();
	private readonly preparedNotes = new Map<string, PreparedMdxNote>();
	private compiler: MdxCompiler | null = null;
	private disposed = false;

	constructor(private readonly debugEnabled: () => boolean) {}

	prepareNote(path: string, source: string): PreparedMdxNote {
		const prepared = transformMdxDocument(source, path);
		this.preparedNotes.set(path, prepared);
		return prepared;
	}

	getPreparedRegion(path: string, id: string): MdxRenderRequest | null {
		const prepared = this.preparedNotes.get(path);
		const region = prepared?.regions.find((candidate) => candidate.id === id);
		return region
			? {
					path,
					source: region.source,
					declarations: prepared?.declarations,
					lineOffset: region.line - 1,
					cacheKey: id,
				}
			: null;
	}

	createMount(container: HTMLElement, request: MdxRenderRequest): MdxMountHandle {
		let root: Root | null = null;
		let surface: MdxShadowSurface | null = null;
		let mountDisposed = false;

		const dispose = (): void => {
			if (mountDisposed) {
				return;
			}
			mountDisposed = true;
			this.activeMounts.delete(dispose);
			root?.unmount();
			root = null;
			surface?.dispose();
			surface = null;
			container.replaceChildren();
		};
		this.activeMounts.add(dispose);

		void this.mount(container, request, () => mountDisposed)
			.then((mounted) => {
				if (mountDisposed) {
					mounted.root.unmount();
					mounted.surface.dispose();
					return;
				}
				root = mounted.root;
				surface = mounted.surface;
			})
			.catch((error: unknown) => {
				if (!mountDisposed) {
					void import('./shadow-surface').then((shadowModule) => {
						if (mountDisposed) {
							return;
						}
						surface = shadowModule.createMdxShadowSurface(container);
						this.renderError(surface.reactContainer, error);
					});
					this.debug('Compile or mount error', error);
				}
			});

		return { dispose };
	}

	private async mount(
		container: HTMLElement,
		request: MdxRenderRequest,
		isDisposed: () => boolean,
	): Promise<{ root: Root; surface: MdxShadowSurface }> {
		const [react, reactDom, registryModule, compilerModule, boundaryModule, portalModule, shadowModule] =
			await Promise.all([
				import('react'),
				import('react-dom/client'),
				import('../components/registry'),
				import('../mdx/compiler'),
				import('./error-boundary'),
				import('../components/portal-context'),
				import('./shadow-surface'),
			]);
		if (this.disposed || isDisposed()) {
			throw new Error('MDX runtime was disposed before mounting.');
		}

		this.compiler ??= new compilerModule.MdxCompiler();
		const registry = registryModule.getComponentRegistry();
		const declarations = request.declarations ?? [];
		const declarationSource = declarations
			.map((region: MdxSourceRegion) => region.source)
			.join('\n\n');
		const source = declarationSource
			? `${declarationSource}\n\n${request.source}`
			: request.source;
		const declarationLines = declarationSource
			? declarationSource.split('\n').length + 1
			: 0;
		const component = this.compiler.compile(
			source,
			request.path,
			registry,
			registryModule.COMPONENT_REGISTRY_VERSION,
			(request.lineOffset ?? 0) - declarationLines,
		);

		const surface = shadowModule.createMdxShadowSurface(container);
		const root = reactDom.createRoot(surface.reactContainer);
		const tooltipProvider = registry.TooltipProvider;
		let content = react.createElement(component, { components: registry });
		if (tooltipProvider !== null && tooltipProvider !== undefined) {
			content = react.createElement(
				tooltipProvider as ComponentType<{ children: ReactNode }>,
				null,
				content,
			);
		}
		root.render(
			react.createElement(
				portalModule.MdxPortalProvider,
				{ container: surface.portalContainer },
				react.createElement(
					boundaryModule.MdxErrorBoundary,
					{
						onError: (error: Error) => this.debug('Runtime error', error),
					},
					content,
				),
			),
		);
		return { root, surface };
	}

	invalidate(path: string): void {
		this.preparedNotes.delete(path);
		this.compiler?.invalidate(path);
	}

	dispose(): void {
		this.disposed = true;
		for (const disposeMount of [...this.activeMounts]) {
			disposeMount();
		}
		this.preparedNotes.clear();
		this.compiler?.clear();
		this.compiler = null;
	}

	private debug(message: string, detail?: unknown): void {
		if (this.debugEnabled()) {
			console.debug(`[obsidian-mdx] ${message}`, detail);
		}
	}

	private renderError(container: HTMLElement, error: unknown): void {
		container.replaceChildren();
		const panel = container.ownerDocument.createElement('div');
		panel.className = 'obsidian-mdx-error';
		panel.setAttribute('role', 'alert');
		const title = container.ownerDocument.createElement('strong');
		title.textContent = 'MDX compile error';
		const message = container.ownerDocument.createElement('span');
		const record =
			error !== null && typeof error === 'object'
				? (error as Record<string, unknown>)
				: null;
		const details =
			record?.details !== null && typeof record?.details === 'object'
				? (record.details as Record<string, unknown>)
				: null;
		const location =
			typeof details?.line === 'number'
				? ` (line ${details.line}${
						typeof details.column === 'number' ? `, column ${details.column}` : ''
					})`
				: '';
		message.textContent = `${
			error instanceof Error ? error.message : 'Unable to render MDX.'
		}${location}`;
		panel.append(title, message);
		container.append(panel);
	}
}
