import { productDetailsDownloadCadenas } from './ProductDetailsDownloadCadenas/ProductDetailsDownloadCadenas.i18n.ko'; //change to ko
import { productDetailsDownloadSinus } from './ProductDetailsDownloadSinus/ProductDetailsDownloadSinus.i18n.ko'; //change to ko
import { Translation } from '@/i18n/types';

export const productDetailsDownloadModal: Translation = {
	productDetailsDownloadSinus,
	productDetailsDownloadCadenas,
	title: '상품상세정보 다운로드',
	downloadButton: 'ZIP파일 다운로드',
	quantityAlertModal: {
		minQuantityOnlyValidation:
			'Orders can be made for {{minQuantity}} or more items.',
		orderUnitOnlyValidation: 'Orders can be made in units of {{ orderUnit }}.',
		bothFactorValidation: `Orders can be made for {{minQuantity}} or more items,\nor in units of {{ orderUnit }}.`,
		ok: 'OK',
	},
};
