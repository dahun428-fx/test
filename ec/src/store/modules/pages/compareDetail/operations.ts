import { Dispatch } from 'redux';
import { actions } from './slice';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Compare } from '@/models/localStorage/Compare';
import { assertNotEmpty, assertNotNull } from '@/utils/assertions';
import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { CompareDetail, CompareDetailLoadStatus, SpecList } from './types';

type CompareLoadPayload = {
	compare: Compare;
	categoryCode: string;
};
export function removeCompareDetailItemOperation(dispatch: Dispatch) {
	return (item: CompareDetail) => {
		dispatch(actions.removeItem(item));
	};
}
export function updateStatusOperation(dispatch: Dispatch) {
	return (status: CompareDetailLoadStatus) => {
		dispatch(actions.update({ status }));
	};
}
export function loadCompareOperation(dispatch: Dispatch) {
	return async ({ compare, categoryCode }: CompareLoadPayload) => {
		const compareItems = compare.items.filter(
			item => item.categoryCode === categoryCode && item.chk
		);
		assertNotEmpty(compareItems);

		dispatch(actions.update({ status: CompareDetailLoadStatus.LOADING }));

		const promise = Promise.all(
			compareItems.map(async item => {
				const seriesCode = item.seriesCode;
				const partNumber = item.partNumber;

				const [partNumberResponse, seriesResponse] = await Promise.all([
					searchPartNumber$search({
						seriesCode,
						partNumber,
					}),
					searchSeries$detail({
						seriesCode,
					}),
				]);

				return { partNumberResponse, seriesResponse };
			})
		);
		promise
			.then(async response => {
				let specItems: Spec[] = [];
				let seriesItems: Series[] = [];
				let partNumberItems: PartNumber[] = [];
				const compareDetailItems = response.map((item, index) => {
					const { specList, partNumberList, currencyCode } =
						item.partNumberResponse;
					const { seriesList } = item.seriesResponse;
					if (specList) {
						specItems = [...specItems, ...specList];
					}
					seriesItems = [...seriesItems, ...seriesList];
					partNumberItems = [...partNumberItems, ...partNumberList];
					return {
						idx: index,
						seriesList,
						partNumberList,
					};
				});

				assertNotNull(specItems);
				assertNotNull(seriesItems);
				assertNotNull(partNumberItems);
				assertNotNull(compareDetailItems);

				dispatch(
					actions.update({
						status: CompareDetailLoadStatus.LOADED_MAIN,
						specItems,
						seriesItems,
						partNumberItems,
						compareDetailItems,
					})
				);
			})
			.catch(noop);
	};
}

function noop() {
	// noop
}
