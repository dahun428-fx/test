import { useRouter } from 'next/router';
import { useState, useEffect, RefObject, useCallback } from 'react';
import { pagesPath } from '@/utils/$path';

/** Sticky header hook */
export const useStickyHeader = (
	headerRef: RefObject<HTMLElement>,
	headerPlaceholderRef: RefObject<HTMLElement>
) => {
	const [isSticky, setIsSticky] = useState(false);
	const router = useRouter();

	const handleScroll = useCallback(() => {
		if (!headerRef.current || !headerPlaceholderRef.current) {
			return;
		}

		const scrollTop = window.scrollY;
		const headerHeight = headerRef.current.clientHeight;
		setIsSticky(scrollTop >= headerHeight);

		if (scrollTop >= headerHeight) {
			/** Set height for header layer to avoid screen recoil effect when user is scrolling down */
			headerPlaceholderRef.current.style.height = `${headerHeight}px`;
		} else {
			headerPlaceholderRef.current.style.height = '0px';
		}
	}, [headerPlaceholderRef, headerRef]);

	useEffect(() => {
		/** Handle fixed header for only home page */
		if (router.pathname !== pagesPath.$url().pathname) {
			return;
		}

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll, isSticky, router.pathname]);

	return isSticky;
};
