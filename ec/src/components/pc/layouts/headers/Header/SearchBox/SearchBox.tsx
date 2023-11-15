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
		<form
			className={styles.searchBoxForm}
			onSubmit={handleSubmit}
			ref={rootRef}
		>
			<input
				value={cursored.keyword}
				className={styles.searchBox}
				onChange={handleChange}
				onFocus={handleFocus}
				onKeyDown={handleKeydown}
				autoComplete="off"
				maxLength={config.form.length.max.keyword}
				placeholder={t(
					'components.ui.layouts.headers.header.searchBox.placeholder'
				)}
			/>
			{active && (
				<div className={styles.suggestionsWrapper}>
					<Suggestions
						key="keyword"
						title={t(
							'components.ui.layouts.headers.header.searchBox.keywordSectionTitle'
						)}
						cursor={cursor - 1}
						suggestionList={keywordList}
					/>
					<Suggestions
						key="part-number"
						loading={loading}
						title={t(
							'components.ui.layouts.headers.header.searchBox.partNumberSectionTitle'
						)}
						cursor={cursor - keywordList.length - 1}
						suggestionList={partNumberList}
					/>
					<Suggestions
						key="discontinued"
						title={t(
							'components.ui.layouts.headers.header.searchBox.discontinuedSectionTitle'
						)}
						cursor={cursor - keywordList.length - partNumberList.length - 1}
						suggestionList={discontinuedList}
					/>
				</div>
			)}
			<div className={styles.buttonContainer}>
				<NagiButton type="submit" className={styles.removeBorder}>
					{t('components.ui.layouts.headers.header.searchBox.submitButton')}
				</NagiButton>
			</div>
		</form>
	);
};
SearchBox.displayName = 'SearchBox';
