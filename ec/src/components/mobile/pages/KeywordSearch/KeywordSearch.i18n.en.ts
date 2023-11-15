import { categoryList } from './CategoryList/CategoryList.i18n.en';
import { comboList } from './ComboList/ComboList.i18n.en';
import { fullTextSearch } from './FullTextSearch/FullTextSearch.i18n.en';
import { keywordSearchMeta } from './KeywordSearchMeta/KeywordSearchMeta.i18n.en';
import { noResult } from './NoResult/NoResult.i18n.en';
import { partNumberTypeList } from './PartNumberTypeList/PartNumberTypeList.i18n.en';
import { seriesListControl } from './SeriesListControl/SeriesListControl.i18n.en';
import { technicalInformation } from './TechnicalInformation/TechnicalInformation.i18n.en';
import { unitLibrary } from './UnitLibrary/UnitLibrary.i18n.en';
import { Translation } from '@/i18n/types';

export const keywordSearch: Translation = {
	fullTextSearch,
	pageHeading: 'Search Results "{{keyword}}"',
	breadcrumbText: 'Search Results',
	categoryList,
	noResult,
	comboList,
	seriesListControl,
	keywordSearchMeta,
	technicalInformation,
	partNumberTypeList,
	unitLibrary,
};
