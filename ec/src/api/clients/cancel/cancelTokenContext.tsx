import { CancelToken } from 'axios';
import { createContext, FC, useContext } from 'react';

const Context = createContext<CancelToken | null>(null);

type Props = {
	token: CancelToken;
};

/**
 * api cancel provider
 */
export const CancelTokenProvider: FC<Props> = ({ token, children }) => {
	return <Context.Provider value={token}>{children}</Context.Provider>;
};

/**
 * api cancel context hook
 * @example
 * // Use for fetcher of components under "CancelTokenProvider".
 * const useFoo = () => {
 *   const token = useCancelTokenContext();
 *   const [data, setData] = useState();
 *
 *   async function loadFoo(request) {
 *     setData(await searchFoo(request, token));
 *   }
 *
 *   ...
 * }
 */
export const useCancelTokenContext = () => useContext(Context);
