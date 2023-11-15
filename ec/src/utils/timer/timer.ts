import { TimerProps } from './types';

const onBrowser = typeof window !== 'undefined';

/**
 * Sleeps for specified milliseconds to stop processing.
 * @param delay - sleep milliseconds
 * @returns promise
 */
export async function sleep(delay: number) {
	if (onBrowser) {
		return createPromise(delay);
	} else {
		return new Promise(resolve => setTimeout(resolve, delay));
	}
}

/**
 * Create a Promise for the timer.
 * @param delay - sleep seconds
 * @param effect - side effects process with timer props (timeoutId, resolve, reject)
 * @return promise
 */
export function createPromise(
	delay: number,
	effect?: (props: TimerProps) => void
) {
	return new Promise<void>((resolve, reject) => {
		const timeoutId = window.setTimeout(resolve, delay);
		effect?.({ timeoutId, resolve, reject });
	});
}
