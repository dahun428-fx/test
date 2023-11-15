import { trackCadPreview } from './cadPreview';
import { trackKeywordSearchView } from './keywordSearch';
import { trackProductView, trackSimpleProductView } from './productDetail';
import { trackTopView } from './top';
import {
	trackCategoryTopView,
	trackLowerCategoryView,
	trackCategorySpecSearchView,
} from '@/logs/analytics/adobe/pageView/category';
import {
	trackMakerListView,
	trackMakerTopView,
	trackMakerCategoryTopView,
	trackMakerCategoryView,
	trackMakerCategorySpecSearchView,
} from '@/logs/analytics/adobe/pageView/maker';
import { trackUnclassifiedView } from '@/logs/analytics/adobe/pageView/unclassified';

export const pageView = {
	productDetail: Object.assign(trackProductView, {
		simple: trackSimpleProductView,
	}),
	keywordSearch: trackKeywordSearchView,
	top: trackTopView,
	cadPreview: trackCadPreview,
	category: {
		top: trackCategoryTopView,
		lower: trackLowerCategoryView,
		spec: trackCategorySpecSearchView,
	},
	maker: {
		list: trackMakerListView,
		top: trackMakerTopView,
		category: {
			top: trackMakerCategoryTopView,
			lower: trackMakerCategoryView,
			spec: trackMakerCategorySpecSearchView,
		},
	},
	unclassified: trackUnclassifiedView,
} as const;
