import Router from 'next/router';
import React, {
	FormEvent,
	FocusEvent,
	useState,
	useEffect,
	useMemo,
	useCallback,
	KeyboardEvent,
	ChangeEvent,
	useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
	useSuggestKeyword,
	useSuggestPartNumber,
	useAuth,
} from './SearchBox.hooks';
import styles from './SearchBox.module.scss';
import { Suggestions } from './Suggestions';
import { Suggestion } from './types';
import { NagiButton } from '@/components/pc/ui/buttons';
import { config } from '@/config';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { Flag } from '@/models/api/Flag';
import { pagesPath } from '@/utils/$path';
import { assertNotNull } from '@/utils/assertions';
import { notEmpty } from '@/utils/predicate';

type Props = {
	/**
	 * keyword
	 *
	 * If you reload the keyword search screen, the input values will disappear,
	 * so get them from the router and set them.
	 */
	keyword?: string;

	isReSearch?: boolean;
	setIsOverlay: (isOverLay: boolean) => void;
};

/** normalize keyword */
function normalize(keyword: string) {
	return keyword.trimStart().replace(/\s+/g, ' ');
}

/**
 * Search box.
 */
export const SearchBox: React.VFC<Props> = ({
	keyword: initialKeyword = '',
	isReSearch = false,
	setIsOverlay,
}) => {
	const { t } = useTranslation();

	const { authenticated } = useAuth();

	// search keyword
	const [rawValue, setRawValue] = useState(initialKeyword);
	const value = normalize(rawValue);

	// cursor position
	const [cursor, setCursor] = useState(0);
	const [active, setActive] = useState(false);

	// suggestions
	const { loadingKeyword, keywordList } = useSuggestKeyword({
		keyword: value,
		active,
		isReSearch,
	});
	const { loadingPartNumber, partNumberList, discontinuedList } =
		useSuggestPartNumber({
			keyword: value,
			active,
			isReSearch,
		});
	const suggestions = useMemo<Suggestion[]>(() => {
		return [
			{
				keyword: rawValue,
				href: pagesPath.vona2.result.$url({
					query: {
						Keyword: value,
						isReSearch: Flag.toFlag(isReSearch),
					},
				}),
			},
			...keywordList,
			...partNumberList,
			...discontinuedList,
		];
	}, [
		discontinuedList,
		isReSearch,
		keywordList,
		partNumberList,
		rawValue,
		value,
	]);

	// cursored suggestion / bound value
	const cursored = suggestions[cursor];
	assertNotNull(cursored);

	// loading
	const loading = loadingKeyword || loadingPartNumber;

	/**
	 * Handles Submit.
	 * - on press 'Enter' key
	 * - on click 'Search' button
	 */
	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		// has input value
		if (cursored.keyword.trim() !== '') {
			const { href, onClick, sendClickLog } = cursored;
			// NOTE: I dare not send a GA click log.(as detected)
			sendClickLog?.();
			if (href) {
				Router.push(href).then();
			} else if (onClick) {
				onClick();
			}
		}
	};

	/**
	 * Handles change
	 * - return cursor to initial position.
	 * - open menu.(activate)
	 */
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCursor(0);
		setActive(true);
		const { value } = event.currentTarget;
		setRawValue(value);
	};

	/**
	 * Handles key down
	 * Change the cursor position when the directional key is pressed.
	 */
	const handleKeydown = useCallback(
		(event: KeyboardEvent) => {
			const size = suggestions.length;
			switch (event.key) {
				case 'Down':
				case 'ArrowDown':
					setActive(true);
					setCursor(p => (p < size - 1 ? p + 1 : 0));
					break;
				case 'Up':
				case 'ArrowUp':
					// NOTE: suppress move caret to lead.
					event.preventDefault();
					setActive(true);
					setCursor(p => (p > 0 ? p - 1 : size - 1));
					break;
			}
		},
		[suggestions.length]
	);

	/** Select input text on focus */
	const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
		event.currentTarget.select();
		setActive(true);
	};

	const rootRef = useRef(null);
	useOuterClick(
		rootRef,
		useCallback(() => {
			setActive(false);
		}, [])
	);

	// If there is a change in URL parameters,
	// the cursor is returned to its initial state
	// while reflecting the change in the input value.
	useEffect(() => {
		setCursor(0);
		setRawValue(initialKeyword);
		setActive(false);
	}, [initialKeyword, setIsOverlay]);

	useEffect(() => {
		const hasResult =
			notEmpty(keywordList) ||
			notEmpty(partNumberList) ||
			notEmpty(discontinuedList);
		setIsOverlay((hasResult || loading) && active);
	}, [
		active,
		authenticated,
		discontinuedList,
		keywordList,
		loading,
		partNumberList,
		setIsOverlay,
	]);

	return (
		<div className={styles.headerSearchWrap}>
			<div className={styles.headerSearch}>
				<div className={styles.headerSearchForm}>
					<input
						className={styles.input}
						name="keyword_placehold"
						type="text"
						placeholder=""
						maxLength={200}
						autoComplete="off"
					/>
					<div className={styles.btnSubmitWrap}>
						<div id="keyword_btn">
							<input
								type="submit"
								className={styles.searchBtn}
								value="검색"
								id="keyword_go"
							/>
							<input
								type="submit"
								className={styles.searchBtnTypeCode}
								value="Type Code Search"
								id="typecode_go"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
SearchBox.displayName = 'SearchBox';
