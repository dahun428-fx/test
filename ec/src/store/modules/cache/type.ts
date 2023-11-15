import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

export type CacheState = {
	topCategories: Category[] | null;
	cartCount: number | null;
};
