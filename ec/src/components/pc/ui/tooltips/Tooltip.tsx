import classNames from 'classnames';
import { CSSProperties, forwardRef, ReactNode, RefObject } from 'react';
import styles from './Tooltip.module.scss';
import { usePortal } from '@/hooks/ui/usePortal';

// NOTE: light theme is for Mirai UI design. dark theme is for old UI design.
//     Consider removing dark theme when all pages are migrated to Mirai UI.
export const Themes = ['light', 'dark'] as const;

export type Theme = typeof Themes[number];

export type Direction = 'top' | 'right' | 'bottom' | 'left';

export type TooltipProps = {
	className?: string;
	describedby?: string;
	position: CSSProperties;
	direction: Direction;
	theme?: Theme;
	ref: RefObject<HTMLDivElement>;
	showsTooltip: boolean;
	children: ReactNode;
};

/**
 * Tooltip component.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
	(
		{
			children,
			className,
			describedby,
			position,
			direction = 'bottom',
			theme = 'dark',
			showsTooltip,
		},
		ref
	) => {
		const { Portal } = usePortal();

		if (!showsTooltip) {
			return null;
		}

		return (
			<Portal>
				<div
					data-direction={direction}
					data-theme={theme}
					className={classNames(styles.tooltip, className)}
					style={position}
					role="tooltip"
					aria-describedby={describedby}
					ref={ref}
				>
					{children}
				</div>
			</Portal>
		);
	}
);

Tooltip.displayName = 'Tooltip';
