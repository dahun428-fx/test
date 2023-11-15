import { generalRecommendLogger } from './generalRecommend';
import { trackClick, trackImpression } from './tracker';
import { viewSeries, viewCategory } from './viewHistory';

export const cameleer = {
	trackClick,
	trackImpression,
	viewSeries,
	viewCategory,
	generalRecommendLogger,
} as const;
