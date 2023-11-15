import { RefObject, useCallback, useRef } from 'react';

export function useScrollTo(targetRef: RefObject<HTMLElement>) {
	const scrollingRef = useRef<boolean>(false);

	const scrollTo = useCallback(
		(
			offset: number,
			options?: { behavior?: 'smooth' | 'auto'; callback?: () => void }
		) => {
			const target = targetRef.current;
			if (target) {
				let timerId: number | null = null;

				/** scrolling の状態更新と、scroll 完了後の callback 実行を行う */
				const onScroll = () => {
					scrollingRef.current = true;

					if (timerId != null) {
						window.clearTimeout(timerId);
					}

					timerId = window.setTimeout(() => {
						scrollingRef.current = false;
						target.removeEventListener('scroll', onScroll);
						options?.callback?.();
					}, 100);
				};

				target.addEventListener('scroll', onScroll);
				onScroll();
				target.scrollTo({ top: offset, ...options });
			}
		},
		[targetRef]
	);

	return { scrollingRef, scrollTo };
}
