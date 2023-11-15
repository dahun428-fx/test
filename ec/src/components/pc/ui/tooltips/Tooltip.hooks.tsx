import { useRef, ReactNode, useContext, MouseEvent } from 'react';
import { Direction, Theme } from './Tooltip';
import { TooltipContext } from './Tooltip.context';

type Options = {
	content: ReactNode;
	/** tooltip tail direction */
	direction?: Direction;
	/** close on click target? */
	closeOnClick?: boolean;
	/** distance from the target element */
	offset?: number;
	theme?: Theme;
};

/** Tooltip hook */
export function useTooltip<T extends HTMLDivElement>({
	content,
	direction = 'bottom',
	closeOnClick = false,
	offset = 0,
	theme = 'dark',
}: Options) {
	const { closeTooltip, openTooltip, tooltipRef } = useContext(TooltipContext);

	const targetRef = useRef<T | null>(null);

	const onMouseEnter = () => {
		if (!content) {
			return;
		}
		openTooltip(content, offset, direction, theme, targetRef);
	};

	const onMouseLeave = (event: MouseEvent) => {
		if (event.relatedTarget === tooltipRef.current) {
			return;
		}
		closeTooltip();
	};

	return {
		bind: {
			ref: targetRef,
			onMouseEnter,
			onMouseLeave,
			onFocus: onMouseEnter,
			onBlur: closeTooltip,
			onClick: closeOnClick ? onMouseEnter : undefined,
		},
	};
}
