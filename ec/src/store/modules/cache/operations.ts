import { Dispatch } from 'redux';
import { actions } from './slice';
import { searchCategory } from '@/api/services/searchCategory';
import { Logger } from '@/logs/datadog';

/** Load top categories. */
export function loadTopCategories(dispatch: Dispatch) {
	return async () => {
		try {
			const response = await searchCategory({
				ancesterType: '1',
				categoryLevel: 2,
				filterType: '1',
				page: 1,
				pageSize: 30,
			});
			dispatch(actions.update({ topCategories: response.categoryList }));
		} catch (error) {
			Logger.warn(`Error occurred on Detail Page: [Fetch top Categories]`, {
				error,
			});
		}
	};
}

/** Updates cart count. */
export function updateCartCount(dispatch: Dispatch) {
	return (cartCount: number | null) => {
		dispatch(actions.update({ cartCount }));
	};
}
