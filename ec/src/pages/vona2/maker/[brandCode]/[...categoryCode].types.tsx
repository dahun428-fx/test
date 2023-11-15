import {
	Brand,
	SearchBrandResponse,
} from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	Category,
	SearchCategoryResponse,
} from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

export type SharedQuery = {
	CategorySpec?: string;
};

export type Props = {
	brandResponse: SearchBrandResponse;
	seriesResponse: SearchSeriesResponse$search;
	categoryResponse: SearchCategoryResponse;
	brandIndexList: Brand[];
	categoryCode: string;
	categorySpec?: string;
	page: number;
	categoryTopList: Category[];
	isMakerCategoryTop: boolean;
};
