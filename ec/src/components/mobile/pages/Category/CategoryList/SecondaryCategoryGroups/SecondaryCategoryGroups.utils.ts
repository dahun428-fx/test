import { ApplicationError } from '@/errors/ApplicationError';
import type { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { EitherRequired } from '@/utils/type';

const ID_PREFIX = 'ec-web-category-list-';
export type Id = `${typeof ID_PREFIX}${string}`;

export function getId(category: EitherRequired<Category, 'categoryCode'>): Id {
	return `${ID_PREFIX}${category.categoryCode}`;
}

export function getCategoryCode(id: string): string | undefined {
	if (!id.startsWith(ID_PREFIX)) {
		throw new ApplicationError(
			`Not expected id. (Needs start with "ec-web-category-list-"): ${id}`
		);
	}
	return id.replace(ID_PREFIX, '');
}
