import { categoryRecommend } from './CategoryRecommend/CategoryRecommend.i18n.en';
import { emphasizedRecommend } from './EmphasizedRecommend/EmphasizedRecommend.i18n.en';
import { recentlyViewedAndRecommend } from './RecentlyViewedAndRecommend/RecentlyViewedAndRecommend.i18n.en';
import { searchResultRecommend } from './SearchResultRecommend/SearchResultRecommend.i18n.en';
import { viewHistorySimulPurchase } from './_legacy/ViewHistorySimulPurchase/ViewHistorySimulPurchase.i18n.en';
import { Translation } from '@/i18n/types';

export const cameleerContents: Translation = {
	unitPrice: 'Unit Price: ',
	daysToShip: 'Days to Ship: ',
	supplementaryMessage:
		'Please confirm the actual "Days to Ship" on product page after login',
	recentlyViewedAndRecommend,
	searchResultRecommend,
	categoryRecommend,
	emphasizedRecommend,
	viewHistorySimulPurchase,
};
