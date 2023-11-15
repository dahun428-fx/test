import { useCallback, useMemo, useRef } from 'react';
import { createPromise } from './timer';
import { TimerProps } from './types';
import { TimerCancelError } from '@/errors/timer/TimerCancelError';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { remove } from '@/utils/object';

const DEFAULT_NAME = '*';

/**
 * timer hook.
 *
 * @example
 * const timer = useTimer();
 *
 * const handleKeydown = useCallback(async (event) => {
 *   if (event.key === 'Esc') {
 *     // Cancelable at any time.
 *     return timer.cancel();
 *   }
 *
 *   try {
 *     // If there is a timer with the same name during sleep, it will be canceled.
 *     await timer.sleep(500);
 *     setSearchResult(await searchKeyword({ keyword }));
 *   } catch (error) {
 *     // handle timer cancel error
 *   }
 *
 *   // do something...
 * }, [timer.sleep]);
 *
 */
export function useTimer<T extends string = string>() {
	const timersRef = useRef<Record<string, TimerProps>>({});

	/**
	 * Interrupts timer processing for the specified name.
	 * @param [name=*] - timer identifier
	 */
	const cancel = useCallback((name: T | typeof DEFAULT_NAME = DEFAULT_NAME) => {
		const timer = timersRef.current[name];
		if (timer) {
			window.clearTimeout(timer.timeoutId);
			timer.reject(new TimerCancelError(name));
			timersRef.current = remove(timersRef.current, name);
		}
	}, []);

	/**
	 * Sleeps for specified milliseconds to stop processing.
	 * If canceled, sleep is interrupted and an error is thrown.
	 * @param delay - sleep milliseconds
	 * @param [name=*] - timer identifier
	 * @returns promise
	 */
	const sleep = useCallback(
		async (delay: number, name: T | typeof DEFAULT_NAME = DEFAULT_NAME) => {
			await createPromise(delay, props => {
				timersRef.current = { ...timersRef.current, [name]: props };
			});
			// remove not pending timer
			timersRef.current = remove(timersRef.current, name);
		},
		[]
	);

	/**
	 * Interrupts all timer processing.
	 */
	const cancelAll = useCallback(() => {
		for (const name of Object.keys(timersRef.current)) {
			cancel(name as T | typeof DEFAULT_NAME);
		}
	}, [cancel]);

	const isSleeping = useCallback(
		(name: T | typeof DEFAULT_NAME = DEFAULT_NAME) => {
			return !!timersRef.current[name];
		},
		[]
	);

	const debounce = useCallback(
		(callback: () => void, throttle: number) => {
			cancel();
			sleep(throttle)
				.then(() => callback())
				.catch(() => {
					// noop
				});
		},
		[cancel, sleep]
	);

	// Cancels all timers when the component is unmounted.
	useOnMounted(() => cancelAll);

	return useMemo(
		() => ({ sleep, cancel, cancelAll, isSleeping, debounce }),
		[cancel, cancelAll, debounce, isSleeping, sleep]
	);
}

/**
 * Reserves send log after 3000ms.
 * @param logger
 * @param delay
 */
export function useReserve<P>(logger: (payload: P) => void, delay: number) {
	const { debounce } = useTimer();

	return useCallback(
		(payload: P) => {
			debounce(() => logger(payload), delay);
		},
		[debounce, delay, logger]
	);
}
