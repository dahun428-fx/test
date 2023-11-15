import React, { useCallback, useEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { PartNumberList as Presenter } from './PartNumberList';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	searchPartNumberOperation,
	selectCurrentPartNumberResponse,
	selectPartNumberListLoading,
	selectPartNumberListPage,
	selectSeries,
	selectSort,
	updatePartNumberSearchConditionOperation,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';
import { getHeight } from '@/utils/dom';

type Props = {
	seriesCode: string;
	/** selector to calculate the top coordinates of the sticky */
	stickyTopSelectors?: string[];
	showsAllSpec?: boolean;
};

const SCROLLBAR_HEIGHT = 11;

export const PartNumberList: React.VFC<Props> = ({
	seriesCode,
	showsAllSpec = false,
	stickyTopSelectors = [],
}) => {
	// product data
	const { relatedLinkFrameFlag, rohsFrameFlag } = useSelector(selectSeries);
	const response = useSelector(selectCurrentPartNumberResponse);
	const loading = useSelector(selectPartNumberListLoading);
	const page = useSelector(selectPartNumberListPage);
	const store = useStore();
	const sortParams = useSelector(selectSort);

	// sticky top position
	const [stickyTop, setStickyTop] = useState(SCROLLBAR_HEIGHT);

	assertNotNull(response);
	const { currencyCode, partNumberList, specList = [], totalCount } = response;

	/** reload part number list */
	const reload = useCallback(
		(condition: Partial<SearchPartNumberRequest>) => {
			if (totalCount === 1) {
				updatePartNumberSearchConditionOperation(store)(condition);
				return;
			}

			const payload = {
				seriesCode,
				...condition,
			};

			if (showsAllSpec) {
				payload.allSpecFlag = Flag.TRUE;
			}

			searchPartNumberOperation(store)(payload);
			document.querySelector('#codeList')?.scrollIntoView();
		},
		[seriesCode, showsAllSpec, store, totalCount]
	);

	useEffect(() => {
		// calculate sticky top position
		if (stickyTopSelectors.length) {
			const onResize = () => {
				const NOTHING_DOM_HEIGHT = 0;
				const stickyTopSelectorsHeight =
					stickyTopSelectors
						.map(selector => getHeight(selector) ?? NOTHING_DOM_HEIGHT)
						.reduce(
							(actionsPanelHeight, detailTabsHeight) =>
								actionsPanelHeight + detailTabsHeight,
							NOTHING_DOM_HEIGHT
						) + SCROLLBAR_HEIGHT;
				/**
				 * Calculating the top of Sticky.
				 * If the DOM height is not rounded down to a small number,
				 * there will be a gap of about 1px above Sticky.
				 */
				const stickyTop = Math.floor(
					stickyTopSelectorsHeight ?? NOTHING_DOM_HEIGHT
				);
				setStickyTop(stickyTop);
			};
			const observer = new ResizeObserver(onResize);
			for (const selector of stickyTopSelectors) {
				const target = document.querySelector(selector);
				if (target) {
					observer.observe(target);
				}
			}
			return () => observer.disconnect();
		}
	}, [stickyTopSelectors]);

	return (
		<Presenter
			seriesCode={seriesCode}
			currencyCode={currencyCode}
			totalCount={totalCount}
			partNumberList={partNumberList}
			specList={specList}
			relatedLinkFrameFlag={relatedLinkFrameFlag}
			rohsFrameFlag={rohsFrameFlag}
			stickyTop={stickyTop}
			reload={reload}
			loading={loading}
			page={page}
			sortParams={sortParams}
		/>
	);
};
PartNumberList.displayName = 'PartNumberList';
