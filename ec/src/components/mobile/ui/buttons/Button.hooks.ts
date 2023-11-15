import React, { useCallback } from 'react';

/**
 * click ハンドラ
 * disabled の場合、click を preventDefault します。
 * @param handler
 * @param disabled
 */
export const useHandleClick = <T extends HTMLElement>(
	handler: React.MouseEventHandler<T> | undefined,
	disabled?: boolean
) =>
	useCallback<React.MouseEventHandler<T>>(
		event => {
			if (disabled) {
				event.preventDefault();
			}
			handler?.(event);
		},
		[disabled, handler]
	);
