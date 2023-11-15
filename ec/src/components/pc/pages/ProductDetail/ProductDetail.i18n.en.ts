import { actionsPanel } from './ActionsPanel/ActionsPanel.i18n.en';
import { addToMyComponentsModal } from './AddToMyComponentsModal/AddToMyComponentsModal.i18n.en';
import { basicInformation } from './BasicInformation/BasicInformation.i18n.en';
import { catalog } from './Catalog/Catalog.i18n.en';
import { catalogLink } from './CatalogLink/CatalogLink.i18n.en';
import { daysToShip as daysToShipUI } from './DaysToShip/DaysToShip.i18n.en';
import { faq } from './Faq/Faq.i18n.en';
import { pageHeading } from './PageHeading/PageHeading.i18n.en';
import { partNumberHeader } from './PartNumberHeader/PartNumberHeader.i18n';
import { partNumberInputHeader } from './PartNumberInputHeader/PartNumberInputHeader.i18n.en';
import { partNumberList } from './PartNumberList/PartNumberList.i18n.en';
import { partNumberSpecList } from './PartNumberSpecList/PartNumberSpecList.i18n.en';
import { productAttributes } from './ProductAttributes/ProductAttributes.i18n.en';
import { productAttributesLabels } from './ProductAttributesLabels/ProductAttributesLabels.i18n.en';
import { productDetailsDownloadButton } from './ProductDetailsDownloadButton/ProductDetailsDownloadButton.i18n.en';
import { productDetailsDownloadModal } from './ProductDetailsDownloadModal/ProductDetailsDownloadModal.i18n.en';
import { productImageModal } from './ProductImageModal/ProductImageModal.i18n.en';
import { productImagePanel } from './ProductImagePanel/ProductImagePanel.i18n.en';
import { productNotice } from './ProductNotice/ProductNotice.i18n.en';
import { interestRecommend } from './RelatedToProductContents/InterestRecommend/InterestRecommend.i18n.en';
import { relatedPartNumberList } from './RelatedToProductContents/RelatedPartNumberList/RelatedPartNumberList.i18n.en';
import { techSupport } from './RelatedToProductContents/TechSupport/TechSupport.i18n.en';
import { sdsLinkListModal } from './SdsLinkListModal/SdsLinkListModal.i18n.en';
import { searchSimilarProductButton } from './SearchSimilarProductButton/SearchSimilarProductButton.i18n.en';
import { complex } from './templates/Complex/Complex.i18n.en';
import { patternH } from './templates/PatternH/PatternH.i18n.en';
import { simple } from './templates/Simple/Simple.i18n.en';
import { wysiwyg } from './templates/Wysiwyg/Wysiwyg.i18n.en';
import { Translation } from '@/i18n/types';

export const productDetail: Translation = {
	standardUnitPrice: 'Standard Unit Price',
	daysToShip: 'Days to Ship',
	daysToShipUI,
	quantity: 'Quantity',
	caution: 'Caution',
	expressDelivery: 'Express Delivery Service',
	addToCart: 'Add to Cart',
	partNumber: 'Part Number',
	myComponents: 'My Components',
	orderNow: 'Order Now',
	checkout: 'Check Out',
	specifications: 'Specifications',
	meta: {
		keywords:
			'{{series.brandName}},{{series.seriesName}},{{categoryNames}},{{seoKeyword}}',
	},
	complex,
	simple,
	patternH,
	wysiwyg,
	productImageModal,
	productImagePanel,
	relatedPartNumberList,
	faq,
	techSupport,
	productDetailsDownloadButton,
	productAttributes,
	interestRecommend,
	catalogLink,
	partNumberHeader,
	partNumberSpecList,
	partNumberList,
	actionsPanel,
	addToMyComponentsModal,
	productAttributesLabels,
	searchSimilarProductButton,
	sdsLinkListModal,
	catalog,
	productNotice,
	productDetailsDownloadModal,
	pageHeading,
	basicInformation,
	partNumberInputHeader,
};
