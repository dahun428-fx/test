import Router from 'next/router';
import { useEffect } from 'react';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { useSelector, useStore } from '@/store/hooks';
import {
	checkPriceOperation,
	selectCategoryCodeList,
	selectCompleteFlag,
	selectCurrentPartNumberList,
	selectPartNumberResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { getOneParams } from '@/utils/query';
import { normalizeUrl } from '@/utils/url';

export const useAutoCheckPrice = () => {
	const completeFlag = useSelector(selectCompleteFlag);
	const partNumberList = useSelector(selectCurrentPartNumberList);
	const store = useStore();

	useEffect(() => {
		if (Flag.isTrue(completeFlag) && partNumberList.length === 1) {
			checkPriceOperation(store)();
		}
	}, [completeFlag, partNumberList, store]);
};

export const useTrackPageView = () => {
	const series = useSelector(selectSeries);
	const { HissuCode: hissuCode } = getOneParams(Router.query, 'HissuCode');
	const {
		currencyCode,
		partNumberList = [],
		completeFlag,
	} = useSelector(selectPartNumberResponse) ?? {};
	const categoryCodeList = useSelector(selectCategoryCodeList);

	useEffect(() => {
		const { categoryList, categoryCode = '', categoryName = '' } = series;
		const { partNumber, innerCode } =
			partNumberList.find(pn => pn.partNumber === hissuCode) ?? {};

		ectLogger.visit({
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			classCode: ClassCode.DETAIL,
			url: normalizeUrl(location.href),
		});

		ga.pageView
			.productDetail({
				seriesCode: series.seriesCode,
				seriesName: series.seriesName,
				misumiFlag: series.misumiFlag,
				departmentCode: series.categoryList[0]?.categoryCode ?? '',
				categoryList: [...categoryList, { categoryCode, categoryName }],
				brandCode: series.brandCode,
				brandName: series.brandName,
				partNumber,
				innerCode,
			})
			.then();

		aa.pageView
			.productDetail({
				seriesCode: series.seriesCode,
				brandCode: series.brandCode,
				categoryCodeList,
			})
			.then(() => {
				// pageView 送信が成功(= AA script load 完了)した後に実行する必要のあるイベント送信
				// - 2023/1/11 現在、AA script は結局 2023/3 リリース時点では同期ロードすることになったのだが、
				//   非同期ロードするようになった時に修正する箇所を減らすための実装
				if (Flag.isTrue(completeFlag)) {
					aa.events.sendPartNumberGeneratedOnce();
				}
			});

		ga.ecommerce.viewItem({
			seriesCode: series.seriesCode,
			partNumber,
			innerCode,
			currencyCode,
		});

		// Needs to send after view item
		if (Flag.isTrue(completeFlag)) {
			ga.events.partNumberGenerated({ partNumber, innerCode });
			ectLogger.partNumber.complete({
				brandCode: series.brandCode,
				seriesCode: series.seriesCode,
				partNumber,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [series]);
};
