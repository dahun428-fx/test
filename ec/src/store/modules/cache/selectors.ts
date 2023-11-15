import { AppState } from '@/store';

/** Top categories */
export function selectTopCategories(state: AppState) {
	return state.cache.topCategories;
}

/** Cart item count */
export function selectCartCount(state: AppState) {
	return state.cache.cartCount;
}
