import { createContext, useContext, type ReactNode } from 'react';

const PortalContainerContext = createContext<HTMLElement | null>(null);

export function MdxPortalProvider({
	children,
	container,
}: {
	children?: ReactNode;
	container: HTMLElement;
}) {
	return (
		<PortalContainerContext.Provider value={container}>
			{children}
		</PortalContainerContext.Provider>
	);
}

export function useMdxPortalContainer(): HTMLElement | undefined {
	return useContext(PortalContainerContext) ?? undefined;
}
