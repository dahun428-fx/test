import i18n from 'i18next';
import { TFunction } from 'react-i18next';
import { config } from '@/config';
import { AssertionError } from '@/errors/app/AssertionError';
import { assertNotEmpty, assertNotNull } from '@/utils/assertions';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * Is it product packing?
 * @param product
 */
export function isPack(product: {
	piecesPerPackage?: number;
	content?: string;
}) {
	if (!product || !product.piecesPerPackage || product.piecesPerPackage <= 1) {
		return false;
	}

	// NOTE: 商品の内容量がスペック項目にあれば、パック品ではないと判定
	if (product.content) {
		return false;
	}
	return true;
}

/**
 * Render min quantity message
 * @param product
 * @param t
 * @returns
 */
export function getMinQuantityMessage(
	product: { minQuantity?: number; piecesPerPackage?: number },
	t: TFunction
) {
	const minQuantity = product.minQuantity || 1;

	if (product.piecesPerPackage === undefined) {
		return t('utils.domain.partNumber.nPieces', {
			n: minQuantity,
		});
	}

	return t('utils.domain.partNumber.nPacks', {
		n: minQuantity,
	});
}

/**
 * Render part numbers package
 * @param product
 * @param t
 * @returns
 */
export function getPartNumberPackText(
	product: { piecesPerPackage?: number },
	t: TFunction
) {
	if (product.piecesPerPackage && product.piecesPerPackage <= 1) {
		return '';
	}

	return t('utils.domain.partNumber.piecesPerPackage', {
		piecesPerPackage: product.piecesPerPackage,
	});
}

/**
 * Get part number page size base on tab name
 * @param tabName
 * @returns
 */
export function getPartNumberPageSize(
	tabName: string | string[] | undefined
): number {
	const defaultConfigPageSize = config.pagination.detail.size;
	const defaultConfigPageSizeList = config.pagination.detail.sizeList;
	const seoPageSize =
		defaultConfigPageSizeList[defaultConfigPageSizeList.length - 1];
	assertNotNull(seoPageSize);
	const defaultPageSize =
		tabName === 'codeList' ? seoPageSize : defaultConfigPageSize;
	const detailItemPerPage = getCookie(Cookie.VONA_ITEM_DETAIL_PER_PAGE);

	const pageSize =
		detailItemPerPage &&
		defaultConfigPageSizeList.includes(Number(detailItemPerPage))
			? Number(detailItemPerPage)
			: defaultPageSize;
	return pageSize;
}

/**
 * 型番入力 validation
 * @param inputPartNumber
 */
export function assertPartNumber(
	inputPartNumber: string | undefined
): asserts inputPartNumber is string {
	assertNotEmpty(inputPartNumber, i18n.t('utils.domain.partNumber.empty'));
	if (!inputPartNumber.match(/^([!-~ ｦ-ﾟ･])+$/)) {
		throw new AssertionError(
			'partNumber',
			i18n.t('utils.domain.partNumber.invalidCharacter')
		);
	}
}

/**
 * Get Unfixed spec part number parts
 * @param partNumber
 * @returns UnfixedPartNumber[]
 */
export function unfixedSpecPartNumberParts(partNumber: string): {
	part: string;
	unfixedSpec: boolean;
}[] {
	const unfixedSpecPartNumber = [];
	let part = '';

	for (let i = 0; i < partNumber.length; i++) {
		const value = partNumber[i];

		if (value === '[') {
			unfixedSpecPartNumber.push({ part, unfixedSpec: false });
			part = value;
			continue;
		}

		if (value === ']') {
			part += value;
			unfixedSpecPartNumber.push({ part, unfixedSpec: true });
			part = '';
			continue;
		}

		part += value;
	}

	if (part) {
		unfixedSpecPartNumber.push({ part, unfixedSpec: false });
	}

	return unfixedSpecPartNumber;
}
