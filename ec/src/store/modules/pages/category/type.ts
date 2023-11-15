import {
	Brand,
	SearchBrandResponse,
} from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

export type CategoryState = {
	categoryResponse?: SearchCategoryResponse;
	seriesResponse?: SearchSeriesResponse$search;
	brandResponse?: SearchBrandResponse;
	brandIndexList?: Brand[];
};

export type SeriesAndBrandResponse = {
	seriesResponse?: SearchSeriesResponse$search;
	brandResponse?: SearchBrandResponse;
};
