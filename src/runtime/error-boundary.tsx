import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children?: ReactNode;
	onError: (error: Error) => void;
}

interface ErrorBoundaryState {
	error: Error | null;
}

export class MdxErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, _info: ErrorInfo): void {
		this.props.onError(error);
	}

	render(): ReactNode {
		if (this.state.error) {
			return (
				<div className="obsidian-mdx-error" role="alert">
					<strong>MDX runtime error</strong>
					<span>{this.state.error.message}</span>
				</div>
			);
		}
		return this.props.children;
	}
}
