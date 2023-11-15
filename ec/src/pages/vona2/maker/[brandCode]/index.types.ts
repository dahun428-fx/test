import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';

export type SharedOptionalQuery = {
	searchFlow?: string;
	KWSearch?: string;
};

export type Props = {
	brandResponse: SearchBrandResponse;
	categoryResponse: SearchCategoryResponse;
};
