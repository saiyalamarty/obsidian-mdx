import {
	CircleHelpIcon,
	type LucideProps,
} from 'lucide-react';
import {
	DynamicIcon,
	iconNames,
	type IconName,
} from 'lucide-react/dynamic';
import * as React from 'react';

export interface LucideIconProps extends LucideProps {
	name: string;
}

const ICON_NAMES = new Set<string>(iconNames);

export const lucideIconNames: readonly IconName[] = Object.freeze([...iconNames]);

export function normalizeLucideIconName(name: string): string {
	return name
		.trim()
		.replace(/Icon$/, '')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.replace(/([a-z\d])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}

export const LucideIcon = React.forwardRef<SVGSVGElement, LucideIconProps>(
	({ name, ...props }, ref) => {
		const normalizedName = normalizeLucideIconName(name);
		if (!ICON_NAMES.has(normalizedName)) {
			return (
				<CircleHelpIcon
					{...props}
					aria-label={`Unknown Lucide icon: ${name}`}
					data-lucide-missing={name}
					ref={ref}
				/>
			);
		}

		return (
			<DynamicIcon
				{...props}
				fallback={() => <CircleHelpIcon {...props} />}
				name={normalizedName as IconName}
				ref={ref}
			/>
		);
	},
);
LucideIcon.displayName = 'LucideIcon';
