import { Dispatch } from 'redux';
import { actions } from './slice';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

type CompareLoadPayload = {
	seriesCode: string;
	partNumber: string;
	// seriesResponse: SearchSeriesResponse$detail;
	// partNumberResponse: SearchPartNumberResponse$search;
};

export function loadCompareOperation(dispatch: Dispatch) {
	return async ({ seriesCode, partNumber }: CompareLoadPayload) => {
		dispatch(
			actions.load({
				seriesCode,
				partNumber,
			})
		);
	};
}
