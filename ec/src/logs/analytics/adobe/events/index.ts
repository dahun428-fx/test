import { sendAddToCart } from './sendAddToCart';
import { sendAddToCartOrOrderNow } from './sendAddToCartOrOrderNow';
import { sendAddToMyComponents } from './sendAddToMyComponents';
import { sendCadPreview } from './sendCadPreview';
import { sendCatalogTab } from './sendCatalogTab';
import { sendCheckPrice } from './sendCheckPrice';
import { sendClickCombo } from './sendClickCombo';
import { sendClickFullTextPDF } from './sendClickFullTextPDF';
import { sendClickTechInfoPDF } from './sendClickTechInfoPDF';
import {
	sendDownloadCadenas,
	sendDownloadFixedCad,
	sendDownloadSinus,
	sendDownloadWeb2Cad,
} from './sendDownloadCad';
import { sendDownloadCatalog } from './sendDownloadCatalog';
import { sendDownloadProductDetails } from './sendDownloadProductDetails';
import { sendLoggedIn } from './sendLoggedIn';
import {
	sendOrderNoListedProductModalView,
	sendOrderNoListedProductEvent,
	sendAddNoListedProductToCartEvent,
} from './sendNoListedProductEvent';
import { sendOrderNow } from './sendOrderNow';
import { sendPartNumberGeneratedOnce } from './sendPartNumberGenerated';
import { sendQuote } from './sendQuote';
import { sendResultTotalCounts } from './sendResultTotalCounts';
import { sendSelectSortType } from './sendSelectSortType';
import { sendViewCombo } from './sendViewCombo';

export const events = {
	sendAddToMyComponents,
	sendLoggedIn,
	sendOrderNoListedProductModalView,
	sendOrderNoListedProductEvent,
	sendAddNoListedProductToCartEvent,
	sendOrderNow,
	sendAddToCart,
	sendCheckPrice,
	sendPartNumberGeneratedOnce,
	sendDownloadCatalog,
	sendDownloadProductDetails,
	sendQuote,
	sendCatalogTab,
	sendCadPreview,
	sendDownloadCadenas,
	sendDownloadFixedCad,
	sendDownloadSinus,
	sendDownloadWeb2Cad,
	sendResultTotalCounts,
	sendAddToCartOrOrderNow,
	sendViewCombo,
	sendClickCombo,
	sendClickFullTextPDF,
	sendClickTechInfoPDF,
	sendSelectSortType,
} as const;
