import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	load,
	selectBrandModeFlag,
	selectSeriesResponse,
	selectStatus,
	Status,
} from '@/store/modules/pages/keywordSearch';
import { notNull } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

type Payload = {
	keyword?: string;
	categoryPage?: number;
	seriesPage?: number;
};

export const useLoadKeywordRelated = (payload: Payload) => {
	const dispatch = useDispatch();
	const status = useSelector(selectStatus);
	const brandModeFlag = useSelector(selectBrandModeFlag);
	const router = useRouter();
	const { isReSearch, bfSearch } = getOneParams(
		router.query,
		'isReSearch',
		'bfSearch'
	);

	const brandMode = useMemo(() => {
		if (Flag.isTrue(brandModeFlag)) {
			return '1';
		}

		return bfSearch === '0' ? '0' : '2';
	}, [bfSearch, brandModeFlag]);

	useEffect(() => {
		if (notNull(payload.keyword)) {
			load(dispatch)({ ...payload, brandMode, isReSearch });
		}
	}, [brandMode, dispatch, isReSearch, payload]);

	return { status };
};

export const useTrackPageView = (keyword?: string) => {
	const seriesResponse = useSelector(selectSeriesResponse);
	const status = useSelector(selectStatus);
	const oldKeyword = useRef('');

	useEffect(() => {
		aa.pageView.keywordSearch().then();
		ga.pageView.keywordSearch().then();
	}, [keyword]);

	useEffect(() => {
		if (
			seriesResponse &&
			oldKeyword.current !== keyword &&
			status === Status.LOADED_MAIN
		) {
			ectLogger.visit({
				classCode: ClassCode.SEARCH,
				specSearchDispType: seriesResponse?.seriesList.length
					? seriesResponse.specSearchDispType ?? '1'
					: undefined,
			});
			oldKeyword.current = keyword ?? '';
		}
	}, [seriesResponse, status, keyword]);
};
