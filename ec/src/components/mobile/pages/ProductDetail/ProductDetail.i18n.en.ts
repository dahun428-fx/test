import { actionsPanel } from './ActionsPanel/ActionsPanel.i18n.en';
import { addToMyComponentsCompleteModal } from './AddToMyComponentsCompleteModal/AddToMyComponentsCompleteModal.i18n.en';
import { brandCategory } from './BrandCategory/BrandCategory.i18n.en';
import { cadDownload } from './CadDownload/CadDownload.i18n.en';
import { catalog } from './Catalog/Catalog.i18n.en';
import { catalogButton } from './CatalogButton/CatalogButton.i18n.en';
import { catchCopy } from './CatchCopy/CatchCopy.i18n.en';
import { configuredSpecifications } from './ConfiguredSpecifications/ConfiguredSpecifications.i18n.en';
import { pageHeading } from './PageHeading/PageHeading.i18n.en';
import { partNumberList } from './PartNumberList/PartNumberList.i18n.en';
import { needsQuoteMessage } from './PriceCheckResult/NeedsQuoteMessage/NeedsQuoteMessage.i18n.en';
import { purchaseConditions } from './PriceCheckResult/PurchaseConditions/PurchaseConditions.i18n.en';
import { productActions } from './ProductActions/ProductActions.i18n.en';
import { productAttributes } from './ProductAttributes/ProductAttributes.i18n.en';
import { productDescription } from './ProductDescription/ProductDescription.i18n.en';
import { productDetailsDownloadButton } from './ProductDetailsDownloadButton/ProductDetailsDownloadButton.i18n.en';
import { productDetailsDownloadModal } from './ProductDetailsDownloadModal/ProductDetailsDownloadModal.i18n.en';
import { productImagePanel } from './ProductImagePanel/ProductImagePanel.i18n.en';
import { productImageModal } from './ProductImagesModal/ProductImageModal.i18n.en';
import { relatedToProductContents } from './RelatedToProductContents/RelatedToProductContents.i18n.en';
import { sdsPdfDownloadButton } from './Sds/Sds.i18n.en';
import { searchSimilarProductButton } from './SearchSimilarProductButton/SearchSimilarProductButton.i18n.en';
import { seriesInfoText } from './SeriesInfoText/SeriesInfoText.i18n.en';
import { templates } from './templates/templates.i18n.en';
import { Translation } from '@/i18n/types';

export const productDetail: Translation = {
	actionsPanel,
	catalogButton,
	templates,
	seriesInfoText,
	configure: 'Configure',
	reconfigure: 'Reconfigure',
	partNumber: 'Part Number',
	enterQuantity: 'Enter Quantity',
	daysToShip: 'Days to Ship',
	unitPrice: 'Unit Price',
	quantity: 'Quantity',
	total: 'Total',
	orderNow: 'Order Now',
	addToCart: 'Add to Cart',
	viewCart: 'View Cart',
	close: 'Close',
	quoteOnWos: 'Quote on WOS.',
	standardUnitPrice: 'Standard Unit Price',
	expressDelivery: 'Express Delivery Service',
	piecesPerPackage: '{{piecesPerPackage}} Pieces Per Package',
	checkPriceDaysToShip: 'Check Price / Days to ship',
	myComponents: 'My Components',
	addToMyComponents: 'Add to My Components',
	specifications: 'Specifications',
	noPermissionToQuote: 'You do not have quotation permission.',
	productImagePanel,
	searchSimilarProductButton,
	relatedToProductContents,
	sdsPdfDownloadButton,
	addToMyComponentsCompleteModal,
	promptRegistration:
		'This is standard price, please <0>register</0> to see the actual price.',
	productDetailsDownloadButton,
	productImageModal,
	brandCategory,
	pageHeading,
	partNumberList,
	purchaseConditions,
	productActions,
	configuredSpecifications,
	productDescription,
	catchCopy,
	needsQuoteMessage,
	catalog,
	productAttributes,
	cadDownload,
	productDetailsDownloadModal,
};
