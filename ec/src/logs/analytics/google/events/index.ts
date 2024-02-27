import { addToMyComponents } from './addToMyComponents';
import { checkPrice } from './checkPrice';
import { checkout } from './checkout';
import { clickShowAlterationSpecs } from './clickShowAlterationSpecs';
import { downloadCad } from './downloadCad';
import { downloadPdf } from './downloadPdf';
import { loggedIn } from './loggedIn';
import { orderNoListedProduct, viewNoListedProduct } from './noListedProduct';
import { orderNow } from './orderNow';
import { partNumberGenerated } from './partNumberGenerated';
import { quote } from './quote';
import { showMoreAttention } from './showMoreAttention';
import { similarProduct } from './similarProduct';
import { specSearchTimes } from './specSearchTimes';
import { keywordSearch } from '@/logs/analytics/google/events/keywordSearch';
import { productsPUCatalogDL } from './productsPUCatalogDL';

export const events = {
	loggedIn,
	showMoreAttention,
	viewNoListedProduct,
	orderNoListedProduct,
	checkPrice,
	partNumberGenerated,
	downloadPdf,
	similarProduct,
	orderNow,
	addToMyComponents,
	downloadCad,
	quote,
	checkout,
	clickShowAlterationSpecs,
	specSearchTimes,
	keywordSearch,
	productsPUCatalogDL,
} as const;
