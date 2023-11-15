import { useCallback, useState } from 'react';
import { Cookie, setCookie } from '@/utils/cookie';
import { getSeriesListPageSize } from '@/utils/domain/spec';

export const usePageSize = <T extends number = number>() => {
	const pageSize = getSeriesListPageSize();

	const [value, setValue] = useState<number>(pageSize);

	const set = useCallback((value: T) => {
		setValue(value);
		setCookie(Cookie.VONA_ITEM_SEARCH_PER_PAGE, value);
	}, []);

	return [value, set] as const;
};
