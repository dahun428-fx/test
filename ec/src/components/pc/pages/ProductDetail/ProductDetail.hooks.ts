import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import {
	selectPartNumberResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { selectCategoryInfoList } from '@/store/modules/pages/productDetail/selectors/shared';
import { first } from '@/utils/collection';
import { Cookie, setCookie } from '@/utils/cookie';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { normalizeUrl } from '@/utils/url';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { getOneParams } from '@/utils/query';

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
 * Scroll to hash hook
 */
export const useScrollToHash = () => {
	const scrollToHash = () => {
		const { hash } = window.location;
		if (hash) {
			const targetElement = document.querySelector(hash);
			if (targetElement) {
				// NOTE: 1s as the default delay for product lazy loading
				setTimeout(() => {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 1000);
			}
		}
	};
	useOnMounted(scrollToHash);
};

export type Templates =
	| 'simple'
	| 'pu'
	| 'complex'
	| 'patternH'
	| 'wysiwyg'
	| 'discontinued';
/**
 * Track page view hook
 */
export const useTrackPageView = (template: Templates = 'complex') => {
	const series = useSelector(selectSeries);
	const router = useRouter();
	const { HissuCode: hissuCode } = getOneParams(router.query, 'HissuCode');
	const {
		currencyCode,
		partNumberList = [],
		completeFlag,
	} = useSelector(selectPartNumberResponse) ?? {};
	const categoryList = useSelector(selectCategoryInfoList);

	useEffect(() => {
		const { partNumber, innerCode } =
			partNumberList.find(pn => pn.partNumber === hissuCode) ?? {};

		ectLogger.visit({
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			classCode: ClassCode.DETAIL,
			url: normalizeUrl(location.href),
			shunsakuCode: '',
			specSearchDispType: '',
		});

		const gaPageView =
			template === 'simple'
				? ga.pageView.productDetail.simple
				: ga.pageView.productDetail;

		gaPageView({
			seriesCode: series.seriesCode,
			seriesName: series.seriesName,
			brandCode: series.brandCode,
			brandName: series.brandName,
			categoryList,
			partNumber,
			innerCode,
			departmentCode: series.departmentCode,
			misumiFlag: series.misumiFlag,
		});

		/** todo : aa tag */
		// aa.pageView
		// 	.productDetail({
		// 		seriesCode: series.seriesCode,
		// 		seriesName: series.seriesName,
		// 		brandCode: series.brandCode,
		// 		brandName: series.brandName,
		// 		categoryList,
		// 		partNumber,
		// 		departmentCode: series.departmentCode,
		// 		misumiFlag: series.misumiFlag,
		// 		template,
		// 	})
		// 	.then(() => {
		// 		// pageView 送信が成功(= AA script load 完了)した後に実行する必要のあるイベント送信
		// 		// - 2023/1/11 現在、AA script は結局 2023/3 リリース時点では同期ロードすることになったのだが、
		// 		//   非同期ロードするようになった時に修正する箇所を減らすための実装
		// 		const completedPartNumber = first(partNumberList);

		// 		if (Flag.isTrue(completeFlag) && completedPartNumber) {
		// 			aa.events.sendPartNumberGeneratedOnce(completedPartNumber.partNumber);
		// 		}
		// 	});

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
