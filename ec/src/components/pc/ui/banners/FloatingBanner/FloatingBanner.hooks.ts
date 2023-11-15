import { useCallback, useEffect, useState } from 'react';
import { getFloatingBanner } from '@/api/services/legacy/htmlContents/home/getFloatingBanner';
import { useSelector } from '@/store/hooks';
import { selectAuthenticated } from '@/store/modules/auth';

export const useFloatingBanner = (shouldLoad: boolean) => {
	const [floatingBanner, setFloatingBanner] = useState<string>();
	const [error, setError] = useState<Error | null>(null);

	const load = useCallback(async () => {
		if (shouldLoad) {
			setFloatingBanner(await getFloatingBanner());
		}
	}, [shouldLoad]);

	useEffect(() => {
		(async () => {
			setError(null);
			try {
				await load();
			} catch (error) {
				if (error instanceof Error) {
					setError(error);
				} else {
					throw error;
				}
			}
		})();
	}, [load]);

	return { floatingBanner, error };
};

export const useAuth = () => {
	/** Authenticated */
	return useSelector(selectAuthenticated);
};
