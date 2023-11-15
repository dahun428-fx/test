import { trackCadPreview } from './cadPreview';
import { trackCategoryTopView, trackLowerCategoryView } from './category';
import { trackError } from './error';
import { trackKeywordSearchView } from './keywordSearch';
import {
	trackMakerListView,
	trackMakerTopView,
	trackMakerCategoryTopView,
	trackMakerCategoryView,
} from './maker';
import { trackNotFound } from './notFound';
import { trackProductView, trackSimpleProductView } from './productDetail';
import { trackTopView } from './top';
import { trackUnclassifiedView } from './unclassified';

export const pageView = {
	productDetail: Object.assign(trackProductView, {
		simple: trackSimpleProductView,
	}),
	top: trackTopView,
	keywordSearch: trackKeywordSearchView,
	cadPreview: trackCadPreview,
	maker: {
		list: trackMakerListView,
		top: trackMakerTopView,
		categoryTop: trackMakerCategoryTopView,
		category: trackMakerCategoryView,
	},
	category: {
		top: trackCategoryTopView,
		lower: trackLowerCategoryView,
	},
	unclassified: trackUnclassifiedView,
	notFound: trackNotFound,
	error: trackError,
} as const;
