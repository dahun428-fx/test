import { useState, useEffect, useCallback, useRef } from 'react';

type InfiniteScroll<T> = {
	data: T[];
	size?: number;
	disabled?: boolean;
};

const DEFAULT_SIZE = 10;

/** Infinity scroll hook */
export const useInfiniteScroll = <T>({
	data,
	size = DEFAULT_SIZE,
	disabled = false,
}: InfiniteScroll<T>) => {
	const [page, setPage] = useState(1);
	const listRef = useRef<HTMLUListElement>(null);

	const handleScroll = useCallback(() => {
		const listNode = listRef.current;

		if (!listNode) {
			return;
		}
		const lastItemNode = listNode.lastElementChild as HTMLLIElement;

		if (!lastItemNode) {
			return;
		}

		const lastItemOffset = lastItemNode.offsetTop + lastItemNode.clientHeight;
		const pageOffset = window.pageYOffset + window.innerHeight;

		if (pageOffset >= lastItemOffset) {
			setPage(page + 1);
		}
	}, [page]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return {
		listItems: disabled ? data : data.slice(0, size * page),
		listRef,
	};
};
