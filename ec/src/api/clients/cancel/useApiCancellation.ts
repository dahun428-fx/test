import axios, { Canceler } from 'axios';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Get api cancel token source hook.
 * - Issue cancel token source.
 * - Auto cancel pending api in page on unmount.
 * @example
 * const FooPage = () => {
 *   const { token } = useApiCancellation();
 *   ...
 *
 *   return (
 *     <CancelTokenProvider token={token}>
 *       <Foo />
 *     </CancelTokenProvider>
 *   )
 * }
 *
 * - Or cancel the pending api individually.
 * @example
 * const useLoadFoo = () => {
 *   const { generateToken } = useApiCancellation();
 *   const cancelerRef = useRef<Canceler>();
 *   // if use "useState", then "const [{ canceler }, setCanceler] = useState<{ canceler: Canceler }>()"
 *
 *   const fetch = (params) => {
 *   	 // cancel called api previously
 *     cancelerRef.current?.();
 *     try {
 *       await fetchFoo(params, { cancelToken: generateToken(c => cancelerRef.current = c) });
 *     } catch (e) {
 *       if (e instanceof ApiCancelError) {
 *       	 return;
 *       }
 *       ...
 *     }
 *   }
 * }
 */
export const useApiCancellation = () => {
	const sourceRef = useRef(axios.CancelToken.source());

	const generateToken = useCallback(
		(saveCanceler: ($cancel: Canceler) => void) => {
			sourceRef.current = axios.CancelToken.source();
			const { token, cancel } = sourceRef.current;
			saveCanceler(cancel);
			return token;
		},
		[]
	);

	useEffect(() => {
		return sourceRef.current.cancel;
	}, []);

	return { ...sourceRef.current, generateToken };
};
