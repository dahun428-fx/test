import React, { useCallback } from 'react';
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
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	onClickPartNumber?: () => void;
};

export const PartNumberList: React.VFC<Props> = ({ onClickPartNumber }) => {
	const { seriesCode, relatedLinkFrameFlag, rohsFrameFlag } =
		useSelector(selectSeries);
	const response = useSelector(selectCurrentPartNumberResponse);
	const loading = useSelector(selectPartNumberListLoading);
	const page = useSelector(selectPartNumberListPage);
	const store = useStore();

	assertNotNull(response);

	const {
		currencyCode,
		partNumberList,
		specList = [],
		regulationList = [],
		totalCount,
	} = response;

	/** reload part number list */
	const reload = useCallback(
		(condition: Partial<SearchPartNumberRequest>) => {
			if (totalCount === 1) {
				return;
			}
			searchPartNumberOperation(store)({
				seriesCode,
				...condition,
			});
		},
		[seriesCode, store, totalCount]
	);

	return (
		<Presenter
			seriesCode={seriesCode}
			currencyCode={currencyCode}
			totalCount={totalCount}
			partNumberList={partNumberList}
			notStandardSpecList={specList.filter(spec =>
				Flag.isFalse(spec.standardSpecFlag)
			)}
			regulationList={regulationList}
			relatedLinkFrameFlag={relatedLinkFrameFlag}
			rohsFrameFlag={rohsFrameFlag}
			reload={reload}
			onClickPartNumber={onClickPartNumber}
			loading={loading}
			page={page}
		/>
	);
};
PartNumberList.displayName = 'PartNumberList';
