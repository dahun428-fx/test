import Router from 'next/router';
import { useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import {
	checkPriceOperation,
	selectCompleteFlag,
	selectCategoryCodeList,
	selectPartNumberResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { first } from '@/utils/collection';
import { getOneParams } from '@/utils/query';
import { normalizeUrl } from '@/utils/url';

export const useAutoCheckPrice = () => {
	const completeFlag = useSelector(selectCompleteFlag);
	const store = useStore();

	useEffect(() => {
		if (Flag.isTrue(completeFlag)) {
			checkPriceOperation(store)();
		}
	}, [completeFlag, store]);
};

export const useTrackPageView = () => {
	const series = useSelector(selectSeries);
	const categoryCodeList = useSelector(selectCategoryCodeList);

	const { HissuCode: hissuCode } = getOneParams(Router.query, 'HissuCode');
	const {
		partNumberList = [],
		completeFlag,
		currencyCode,
	} = useSelector(selectPartNumberResponse) ?? {};

	useEffect(() => {
		const {
			categoryList,
			categoryCode = '',
			categoryName = '',
			seriesName,
			brandName,
			misumiFlag,
			brandCode,
			seriesCode,
		} = series;

		// NOTE: In case of having no hissuCode, but series has only one partNumber
		// Need to get partNumber from partNumberList than set it to log.
		// Example: https://my.misumi-ec.com/vona2/detail/223004939945/
		const { partNumber, innerCode } =
			partNumberList.find(pn => pn.partNumber === hissuCode) ??
			(partNumberList.length === 1
				? {
						partNumber: first(partNumberList)?.partNumber,
						innerCode: first(partNumberList)?.innerCode,
				  }
				: {});

		ectLogger.visit({
			brandCode,
			seriesCode,
			classCode: ClassCode.DETAIL,
			url: normalizeUrl(location.href),
		});

		ga.pageView.productDetail
			.simple({
				seriesCode,
				seriesName,
				brandCode,
				brandName,
				misumiFlag,
				departmentCode: categoryList[0]?.categoryCode ?? '',
				categoryList: [...categoryList, { categoryCode, categoryName }],
				partNumber,
				innerCode,
			})
			.then();

		aa.pageView.productDetail
			.simple({
				seriesCode: series.seriesCode,
				brandCode: series.brandCode,
				categoryCodeList,
			})
			.then(() => {
				if (Flag.isTrue(completeFlag)) {
					aa.events.sendPartNumberGeneratedOnce();
				}
			});

		ga.ecommerce.viewItem({
			seriesCode,
			partNumber,
			innerCode,
			currencyCode,
		});

		// Needs to send after view item
		if (Flag.isTrue(completeFlag)) {
			ga.events.partNumberGenerated({ partNumber, innerCode });
			ectLogger.partNumber.complete({
				brandCode,
				seriesCode,
				partNumber,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [series]);
};
