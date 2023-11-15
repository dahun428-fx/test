import { useTranslation } from 'react-i18next';
import styles from './Suggestions.module.scss';
import { SuggestionGroup } from '@/components/mobile/layouts/headers/SearchBox/SuggestionGroup';
import { Suggestion } from '@/components/mobile/layouts/headers/SearchBox/type';

type Props = {
	isOpen: boolean;
	keywordSuggestions: Suggestion[];
	partNumberSuggestions: Suggestion[];
	discontinuedSuggestions: Suggestion[];
	loadingPartNumber: boolean;
	loadingKeyword: boolean;
	loadingCombo: boolean;
};

/** Suggestions component */
export const Suggestions: React.VFC<Props> = ({
	isOpen,
	keywordSuggestions,
	partNumberSuggestions,
	discontinuedSuggestions,
	loadingPartNumber,
	loadingKeyword,
	loadingCombo,
}) => {
	/** translator */
	const { t } = useTranslation();
	const showsKeywordSuggestion =
		keywordSuggestions.length > 0 && !loadingKeyword;

	const showsPartNumberSuggestion =
		partNumberSuggestions.length > 0 ||
		loadingPartNumber ||
		loadingKeyword ||
		loadingCombo;

	const showsDiscontinuedSuggestion =
		discontinuedSuggestions.length > 0 && !loadingPartNumber && !loadingKeyword;

	if (
		!isOpen ||
		(!keywordSuggestions.length &&
			!partNumberSuggestions.length &&
			!loadingKeyword &&
			!loadingPartNumber &&
			!loadingCombo)
	) {
		return null;
	}

	return (
		<div className={styles.suggestionWrapper}>
			{showsKeywordSuggestion && (
				<SuggestionGroup
					title={t(
						'mobile.components.layouts.headers.header.searchBox.keywordSuggestions'
					)}
					suggestions={keywordSuggestions}
					showsLoading={loadingKeyword}
				/>
			)}

			{showsPartNumberSuggestion && (
				<SuggestionGroup
					title={t(
						'mobile.components.layouts.headers.header.searchBox.partNumberSuggestions'
					)}
					suggestions={partNumberSuggestions}
					showsLoading={loadingPartNumber || loadingCombo || loadingKeyword}
				/>
			)}

			{showsDiscontinuedSuggestion && (
				<SuggestionGroup
					title={t(
						'mobile.components.layouts.headers.header.searchBox.discontinuedProducts'
					)}
					suggestions={discontinuedSuggestions}
				/>
			)}
		</div>
	);
};

Suggestions.displayName = 'Suggestions';
