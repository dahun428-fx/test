import React, { useCallback, useState } from 'react';
import { UniversalLoaderContext } from './UniversalLoader.context';

/**
 * Universal loader provider
 */
export const UniversalLoaderProvider: React.FC = ({ children }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const showLoading = useCallback(() => {
		setLoading(true);
	}, []);

	const hideLoading = useCallback(() => {
		setLoading(false);
	}, []);

	return (
		<UniversalLoaderContext.Provider
			value={{ loading, showLoading, hideLoading }}
		>
			{children}
		</UniversalLoaderContext.Provider>
	);
};
UniversalLoaderProvider.displayName = 'UniversalLoaderProvider';
