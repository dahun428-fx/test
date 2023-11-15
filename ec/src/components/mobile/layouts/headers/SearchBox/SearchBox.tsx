import { Router, useRouter } from 'next/router';
import React, {
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { KeywordForm } from './KeywordForm';
import { useSuggestion } from './SearchBox.hooks';
import { Suggestions } from './Suggestions';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { Flag } from '@/models/api/Flag';
import { pagesPath } from '@/utils/$path';

export type Props = {
	headerRef: RefObject<HTMLElement>;
};

/** SearchBox component */
export const SearchBox: React.VFC<Props> = ({ headerRef }) => {
	const router = useRouter();
	const [keyword, setKeyword] = useState('');
	const ref = useRef(null);

	const {
		initializedRef: keywordInitializedRef,
		keywords: keywordSuggestions,
		partNumbers: partNumberSuggestions,
		discontinuedPartNumbers: discontinuedSuggestions,
		loadingKeyword,
		loadingPartNumber,
		loadingCombo,
		showsSuggestion,
		setShowsSuggestion,
		loadKeyword,
		clearSuggestions,
	} = useSuggestion();

	const keywordFromUrl = useMemo(() => {
		const { Keyword, KWSearch } = router.query;
		const keywordFromUrl = Array.isArray(Keyword)
			? Keyword[Keyword.length - 1]
			: Keyword;
		const KWSearchFromUrl = Array.isArray(KWSearch)
			? KWSearch[KWSearch.length - 1]
			: KWSearch;

		return keywordFromUrl || KWSearchFromUrl || '';
	}, [router.query]);

	/** Handle change keyword */
	const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setKeyword(value);

		if (value && value.trim()) {
			loadKeyword(value);
			setShowsSuggestion(true);
		} else {
			setShowsSuggestion(false);
		}
	};

	/** Handle focus keyword */
	const handleFocusKeyword = () => {
		if (keyword && keyword.trim()) {
			setShowsSuggestion(true);
			if (!keywordInitializedRef.current) {
				loadKeyword(keyword);
			}
		}
	};

	/** Handle search */
	const handleSearch = (event: React.FormEvent) => {
		event.preventDefault();
		const isReSearch = /vona\/result/.test(router.pathname);

		if (keyword && keyword.trim()) {
			router
				.push(
					pagesPath.vona2.result.$url({
						query: { Keyword: keyword, isReSearch: Flag.toFlag(isReSearch) },
					})
				)
				.then();
		}
	};

	/** Handle click outside exclude header */
	useOuterClick(ref, event => {
		if (
			event.target instanceof Node &&
			// NOTE: suggestion list should not be closed when user clicking on Header
			!headerRef.current?.contains(event.target)
		) {
			setShowsSuggestion(false);
		}
	});

	/** Handle logic when route change */
	const onStartToChangeRoute = useCallback(() => {
		if (showsSuggestion) {
			setShowsSuggestion(false);
		}
		clearSuggestions();
	}, [clearSuggestions, setShowsSuggestion, showsSuggestion]);

	useEffect(() => {
		Router.events.on('routeChangeStart', onStartToChangeRoute);
		return () => {
			Router.events.off('routeChangeStart', onStartToChangeRoute);
		};
	}, [onStartToChangeRoute]);

	useEffect(() => {
		setKeyword(keywordFromUrl.trim());
	}, [keywordFromUrl]);

	return (
		<KeywordForm
			ref={ref}
			value={keyword ?? keywordFromUrl}
			onChange={handleChangeKeyword}
			onFocus={handleFocusKeyword}
			onSubmit={handleSearch}
			onClickClear={() => setKeyword('')}
		>
			<Suggestions
				isOpen={showsSuggestion}
				{...{
					keywordSuggestions,
					partNumberSuggestions,
					discontinuedSuggestions,
					loadingKeyword,
					loadingPartNumber,
					loadingCombo,
				}}
			/>
		</KeywordForm>
	);
};

SearchBox.displayName = 'SearchBox';
