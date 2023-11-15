import { SearchIdeaNoteResponse } from '@/models/api/cms/SearchIdeaNoteResponse';
import { SeriesStatus } from '@/models/api/constants/SeriesStatus';
import {
	Brand,
	SearchBrandResponse,
} from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchComboResponse } from '@/models/api/msm/ect/combo/SearchComboResponse';
import { SearchFullTextResponse } from '@/models/api/msm/ect/fullText/SearchFullTextResponse';
import { SearchTechFullTextResponse } from '@/models/api/msm/ect/fullText/SearchTechFullTextResponse';
import { SearchKeywordResponse } from '@/models/api/msm/ect/keyword/SearchKeywordResponse';
import { GetKeywordBannerResponse } from '@/models/api/msm/ect/keywordBanner/GetKeywordBannerResponse';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { SearchTypeResponse } from '@/models/api/msm/ect/type/SearchTypeResponse';

type SeriesCode = string;
type PartNumber = string;

const Status = {
	INITIAL: 0,
	LOADING: 1,
	LOADED_MAIN: 2,
	READY: 3,
} as const;
type Status = typeof Status[keyof typeof Status];
export { Status };

export type KeywordSearchState = {
	status: Status;
	brandResponse?: SearchBrandResponse;
	keywordResponse?: SearchKeywordResponse;
	categoryResponse?: SearchCategoryResponse;
	seriesResponse?: SearchSeriesResponse$search;
	typeResponse?: SearchTypeResponse;
	keywordBannerResponse?: GetKeywordBannerResponse;
	comboResponse?: SearchComboResponse;
	fullTextResponse?: SearchTechFullTextResponse;
	techFullTextResponse?: SearchFullTextResponse;
	ideaNoteResponse?: SearchIdeaNoteResponse;
	brandIndexList?: Brand[];
	partNumberResponses?: Record<
		`${SeriesCode}\t${PartNumber}`,
		SearchPartNumberResponse$search | undefined
	>;
	/** should collapse some sections on load */
	shouldCollapse?: boolean;
	responseTime?: number;
} & MobileState;

export type TypeSpec = { specCode: string; specNameDisp: string };
export type SpecValueMap = Record<string, string | undefined>;
export type TypeSpecValue = {
	seriesStatus: SeriesStatus;
	valueMap: SpecValueMap | null;
};

export type PartNumberSpecTypes = {
	specList: TypeSpec[];
	typeSpecValueList: TypeSpecValue[];
};

type MobileState = {
	showsSpecPanel?: boolean;
};
