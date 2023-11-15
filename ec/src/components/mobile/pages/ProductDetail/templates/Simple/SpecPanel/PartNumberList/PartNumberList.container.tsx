import { useCallback } from 'react';
import { PartNumberList as Presenter } from './PartNumberList';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	searchPartNumberOperation,
	selectCurrentPartNumberList,
	selectCurrentPartNumberResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';

export const PartNumberList: React.VFC = () => {
	const store = useStore();
	const series = useSelector(selectSeries);

	/** load part number list */
	const load = useCallback(
		(condition: Partial<SearchPartNumberRequest>) => {
			searchPartNumberOperation(store)({
				seriesCode: series.seriesCode,
				...condition,
			});
		},
		[series.seriesCode, store]
	);

	const specList = useSelector(selectCurrentPartNumberResponse)?.specList ?? [];
	const partNumberList = useSelector(selectCurrentPartNumberList);

	return (
		<Presenter
			partNumberList={partNumberList}
			specList={specList}
			load={load}
		/>
	);
};
PartNumberList.displayName = 'PartNumberList';
