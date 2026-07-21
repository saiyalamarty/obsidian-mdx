import {
	componentStyles,
	propertyRegistrations,
} from '../../.build/mdx-styles';

export interface MdxShadowSurface {
	portalContainer: HTMLElement;
	reactContainer: HTMLElement;
	shadowRoot: ShadowRoot;
	dispose(): void;
}

const constructedSheets = new WeakMap<Document, CSSStyleSheet>();
const documentPropertyStyles = new WeakMap<
	Document,
	{ mounts: number; style: HTMLStyleElement }
>();
function retainDocumentPropertyStyles(ownerDocument: Document): () => void {
	let state = documentPropertyStyles.get(ownerDocument);
	if (!state) {
		const style = ownerDocument.createElement('style');
		style.dataset.obsidianMdxProperties = 'true';
		style.textContent = propertyRegistrations;
		(ownerDocument.head ?? ownerDocument.documentElement).append(style);
		state = { mounts: 0, style };
		documentPropertyStyles.set(ownerDocument, state);
	}
	state.mounts += 1;

	let released = false;
	return () => {
		if (released) {
			return;
		}
		released = true;
		const current = documentPropertyStyles.get(ownerDocument);
		if (!current) {
			return;
		}
		current.mounts -= 1;
		if (current.mounts === 0) {
			current.style.remove();
			documentPropertyStyles.delete(ownerDocument);
		}
	};
}

function installStyles(shadowRoot: ShadowRoot, ownerDocument: Document): void {
	const StyleSheet = ownerDocument.defaultView?.CSSStyleSheet;
	if (typeof StyleSheet === 'function' && 'adoptedStyleSheets' in shadowRoot) {
		try {
			let sheet = constructedSheets.get(ownerDocument);
			if (!sheet) {
				sheet = new StyleSheet();
				sheet.replaceSync(componentStyles);
				constructedSheets.set(ownerDocument, sheet);
			}
			shadowRoot.adoptedStyleSheets = [sheet];
			return;
		} catch {
			// Older WebViews expose CSSStyleSheet without constructable stylesheet support.
		}
	}

	const style = ownerDocument.createElement('style');
	style.dataset.obsidianMdxStyles = 'true';
	style.textContent = componentStyles;
	shadowRoot.append(style);
}

function mirrorDocumentState(
	surface: HTMLElement,
	ownerDocument: Document,
): () => void {
	const sync = (): void => {
		const bodyClasses = ownerDocument.body.classList;
		const documentClasses = ownerDocument.documentElement.classList;
		for (const className of ['theme-dark', 'theme-light']) {
			surface.classList.toggle(
				className,
				bodyClasses.contains(className) || documentClasses.contains(className),
			);
		}
		surface.dir =
			ownerDocument.documentElement.dir || ownerDocument.body.dir || 'ltr';
	};

	sync();
	const Observer = ownerDocument.defaultView?.MutationObserver;
	if (!Observer) {
		return () => undefined;
	}

	const observer = new Observer(sync);
	observer.observe(ownerDocument.body, {
		attributes: true,
		attributeFilter: ['class', 'dir'],
	});
	observer.observe(ownerDocument.documentElement, {
		attributes: true,
		attributeFilter: ['class', 'dir'],
	});
	return () => observer.disconnect();
}

export function createMdxShadowSurface(host: HTMLElement): MdxShadowSurface {
	const ownerDocument = host.ownerDocument;
	const releaseDocumentPropertyStyles =
		retainDocumentPropertyStyles(ownerDocument);
	const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
	shadowRoot.replaceChildren();
	shadowRoot.adoptedStyleSheets = [];
	host.replaceChildren();
	host.classList.remove('obsidian-mdx-error');
	host.classList.add('obsidian-mdx-shadow-host');

	installStyles(shadowRoot, ownerDocument);

	const inline = host.tagName === 'SPAN';
	const surface = ownerDocument.createElement(inline ? 'span' : 'div');
	surface.className = 'obsidian-mdx-root obsidian-mdx-shadow-surface';
	const reactContainer = ownerDocument.createElement(inline ? 'span' : 'div');
	reactContainer.className = 'obsidian-mdx-react-root';
	const portalContainer = ownerDocument.createElement('div');
	portalContainer.className = 'obsidian-mdx-portal-root';
	surface.append(reactContainer, portalContainer);
	shadowRoot.append(surface);

	const stopMirroring = mirrorDocumentState(surface, ownerDocument);
	let disposed = false;

	return {
		portalContainer,
		reactContainer,
		shadowRoot,
		dispose: () => {
			if (disposed) {
				return;
			}
			disposed = true;
			stopMirroring();
			releaseDocumentPropertyStyles();
			shadowRoot.replaceChildren();
			shadowRoot.adoptedStyleSheets = [];
			host.classList.remove('obsidian-mdx-shadow-host');
		},
	};
}
