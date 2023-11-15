import { Flag } from '@/models/api/Flag';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

type CameleerId = string;
type DispPage = string;
// position in list
type Position = number;
// seriesCode or categoryCode
type RecommendKey = string;

export type SharedQuery = {
	KWSearch?: string;
	searchFlow?: string;
	CategorySpec?: string;
	Tab?: string;
	FindSimilar?: Flag;
	rid?: `${CameleerId}_${DispPage}_${Position}_${RecommendKey}`;
};

export type Props = {
	categoryCode: string;
	topCategoryCode: string;
	isTopCategory: boolean;
	categoryResponse: SearchCategoryResponse;
	seriesResponse?: SearchSeriesResponse$search;
	brandResponse?: SearchBrandResponse;
	page: number;
	categorySpec?: string;
};
