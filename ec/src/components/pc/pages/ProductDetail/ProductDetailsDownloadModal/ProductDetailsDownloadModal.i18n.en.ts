import { productDetailsDownloadCadenas } from './ProductDetailsDownloadCadenas/ProductDetailsDownloadCadenas.i18n.en';
import { productDetailsDownloadSinus } from './ProductDetailsDownloadSinus/ProductDetailsDownloadSinus.i18n.en';
import { Translation } from '@/i18n/types';

export const productDetailsDownloadModal: Translation = {
	productDetailsDownloadSinus,
	productDetailsDownloadCadenas,
	title: 'Download Product Details',
	downloadButton: 'Download ZIP File',
	quantityAlertModal: {
		minQuantityOnlyValidation:
			'Orders can be made for {{minQuantity}} or more items.',
		orderUnitOnlyValidation: 'Orders can be made in units of {{ orderUnit }}.',
		bothFactorValidation: `Orders can be made for {{minQuantity}} or more items,\nor in units of {{ orderUnit }}.`,
		ok: 'OK',
	},
};
