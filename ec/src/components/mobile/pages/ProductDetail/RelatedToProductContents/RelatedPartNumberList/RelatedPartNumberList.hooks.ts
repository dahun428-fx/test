import { useEffect, useMemo } from 'react';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	selectPartNumberResponse,
	selectRelatedPartNumberResponse,
} from '@/store/modules/pages/productDetail';

/** Related part number hook */
export const useRelatedPartNumber = (seriesCode: string) => {
	const relatedPartNumberInfo = useSelector(selectRelatedPartNumberResponse);

	const hasPageStandardUnitPrice = useMemo(() => {
		if (!relatedPartNumberInfo) {
			return false;
		}
		return relatedPartNumberInfo.partNumberList.some(
			partNumber => partNumber.standardUnitPrice !== undefined
		);
	}, [relatedPartNumberInfo]);

	const hasPagePiecesPerPackage = useMemo(() => {
		if (!relatedPartNumberInfo) {
			return false;
		}
		return relatedPartNumberInfo.partNumberList.some(
			partNumber => partNumber.piecesPerPackage !== undefined
		);
	}, [relatedPartNumberInfo]);

	useEffect(() => {
		if (relatedPartNumberInfo?.partNumberList?.length) {
			// Only one case is sent here because it is sent in units of series codes.
			ga.ecommerce.viewItemList([
				{ seriesCode, itemListName: ItemListName.PRODUCT_DETAIL },
			]);
		}
	}, [relatedPartNumberInfo?.partNumberList, seriesCode]);

	return {
		relatedPartNumberInfo,
		hasPageStandardUnitPrice,
		hasPagePiecesPerPackage,
	};
};

export const useSpecInformation = () => {
	const partNumberResponse = useSelector(selectPartNumberResponse);

	return {
		nonStandardSpecList:
			partNumberResponse?.specList?.filter(spec =>
				Flag.isFalse(spec.standardSpecFlag)
			) ?? [],
	};
};
