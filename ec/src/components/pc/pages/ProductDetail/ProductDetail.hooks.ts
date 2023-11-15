import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import {
	selectCategoryCodeList,
	selectPartNumberResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { selectTemplateType } from '@/store/modules/pages/productDetail/selectors/shared';
import { first } from '@/utils/collection';
import { Cookie, setCookie } from '@/utils/cookie';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { normalizeUrl } from '@/utils/url';

/**
 * Page size hook
 * Manage page size for product detail
 */
export const usePageSize = <T extends number = number>() => {
	const router = useRouter();
	const { Tab } = router.query;

	const pageSize = getPartNumberPageSize(Tab);

	const [value, setValue] = useState<number>(pageSize);

	const set = useCallback((value: T) => {
		setValue(value);
		setCookie(Cookie.VONA_ITEM_DETAIL_PER_PAGE, value.toString());
	}, []);

	return [value, set] as const;
};

/**
 * Track page view hook
 */
export const useTrackPageView = () => {
	const series = useSelector(selectSeries);
	const {
		currencyCode,
		partNumberList = [],
		completeFlag,
	} = useSelector(selectPartNumberResponse) ?? {};
	const categoryCodeList = useSelector(selectCategoryCodeList);
	const templateType = useSelector(selectTemplateType);

	useEffect(() => {
		if (!templateType) {
			return;
		}
		const { categoryList, categoryCode = '', categoryName = '' } = series;

		const partNumber = Flag.isTrue(completeFlag)
			? first(partNumberList)
			: undefined;

		ectLogger.visit({
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			classCode: ClassCode.DETAIL,
			partNumber: partNumber?.partNumber,
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
				partNumber: partNumber?.partNumber,
				innerCode: partNumber?.innerCode,
			})
			.then();

		if (templateType === TemplateType.SIMPLE) {
			aa.pageView.productDetail
				.simple({
					seriesCode: series.seriesCode,
					brandCode: series.brandCode,
					categoryCodeList,
					partNumber: partNumber?.partNumber,
				})
				.then(() => {
					// pageView 送信が成功(= AA script load 完了)した後に実行する必要のあるイベント送信
					// - 2023/1/11 現在、AA script は結局 2023/3 リリース時点では同期ロードすることになったのだが、
					//   非同期ロードするようになった時に修正する箇所を減らすための実装
					if (Flag.isTrue(completeFlag)) {
						aa.events.sendPartNumberGeneratedOnce();
					}
				});
		} else {
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
		}

		ga.ecommerce.viewItem({
			seriesCode: series.seriesCode,
			partNumber: partNumber?.partNumber,
			innerCode: partNumber?.innerCode,
			currencyCode,
		});

		// Needs to send after view item
		if (Flag.isTrue(completeFlag)) {
			ga.events.partNumberGenerated({
				partNumber: partNumber?.partNumber,
				innerCode: partNumber?.innerCode,
			});
			ectLogger.partNumber.complete({
				brandCode: series.brandCode,
				seriesCode: series.seriesCode,
				partNumber: partNumber?.partNumber,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [series]);
};
