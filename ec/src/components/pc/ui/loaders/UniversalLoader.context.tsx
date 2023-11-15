import { createContext, useContext } from 'react';
import { UniversalLoader } from './UniversalLoader';

/**
 * Universal Loader Context
 */
export const UniversalLoaderContext = createContext({
	loading: false,
	showLoading: () => {
		// noop
	},
	hideLoading: () => {
		// noop
	},
});

/**
 * Universal Loader Controller
 */
export const UniversalLoaderController: React.VFC = () => {
	const { loading } = useContext(UniversalLoaderContext);

	if (!loading) {
		return null;
	}

	return loading && <UniversalLoader />;
};
UniversalLoaderController.displayName = 'UniversalLoaderController';

/**
 * Universal Loader Hook
 */
export const useUniversalLoader = () => useContext(UniversalLoaderContext);
