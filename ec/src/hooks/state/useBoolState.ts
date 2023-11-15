import { useCallback, useState } from 'react';

/**
 * bool state hook.
 * @param initial
 */
export function useBoolState(initial = false) {
	const [bool, setBool] = useState(initial);
	const setTrue = useCallback(() => setBool(true), []);
	const setFalse = useCallback(() => setBool(false), []);
	const toggle = useCallback(() => setBool(p => !p), []);

	return Object.assign(
		[bool, setTrue, setFalse, toggle] as const,
		{ bool, setTrue, setFalse, toggle } as const
	);
}
