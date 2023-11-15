import { useCallback, useMemo, useState } from 'react';

type PagePayload<T> = {
	initialPage?: number;
	initialPageSize: number;
	list: T[];
	totalCount?: number;
};
export function usePage<T>({
	initialPage = 1,
	initialPageSize,
	list,
	totalCount = list.length,
}: PagePayload<T>) {
	// page size
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	// index of first recommend item in current page
	const [cursor, setCursor] = useState<number>((initialPage - 1) * pageSize);

	// current page number (1 origin)
	const currentPage = Math.floor(cursor / pageSize);
	const pageCount = Math.ceil(totalCount / pageSize);

	const goToNext = useCallback(() => {
		const nextPage = (currentPage + 1 + pageCount) % pageCount;
		setCursor(pageSize * nextPage);
	}, [currentPage, pageSize, pageCount]);

	const backToPrev = useCallback(() => {
		const nextPage = (currentPage - 1 + pageCount) % pageCount;
		setCursor(pageSize * nextPage);
	}, [currentPage, pageSize, pageCount]);

	const listPerPage = useMemo<T[]>(() => {
		return list.slice(cursor, cursor + pageSize);
	}, [cursor, list, pageSize]);

	return {
		page: currentPage,
		pageSize,
		listPerPage,
		goToNext,
		backToPrev,
		setPageSize,
		pageCount,
	} as const;
}
