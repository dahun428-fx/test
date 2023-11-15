import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState, VFC } from 'react';
import { useDispatch } from 'react-redux';
import { KeywordSearch as Presenter } from './KeywordSearch';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	load,
	selectSeriesResponse,
	selectStatus,
	selectBrandModeFlag,
	Status,
} from '@/store/modules/pages/keywordSearch';
import { notNull } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

export type Props = {
	keyword: string;
	categoryPage?: number;
	seriesPage?: number;
};

// NOTE: For mobile devices, a maximum 18 categories will be displayed.
const CATEGORY_PAGE_SIZE = 18;

/** Keyword search container */
export const KeywordSearch: VFC<Props> = props => {
	const dispatch = useDispatch();
	const seriesResponse = useSelector(selectSeriesResponse);
	const status = useSelector(selectStatus);
	const [displayType, setDisplayType] = useState<DisplayTypeOption>(
		DisplayTypeOption.PHOTO
	);

	const brandModeFlag = useSelector(selectBrandModeFlag);
	const oldKeyword = useRef('');

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
		if (notNull(props.keyword)) {
			load(dispatch)(
				{
					keyword: props.keyword,
					seriesPage: props.seriesPage,
					categoryPageSize: CATEGORY_PAGE_SIZE,
					categoryPage: props.categoryPage,
					brandMode,
					isReSearch,
				},
				{ isMobile: true }
			);
		}
	}, [brandMode, dispatch, isReSearch, props]);

	useEffect(() => {
		aa.pageView.keywordSearch().then();
		ga.pageView.keywordSearch().then();
	}, [props.keyword]);

	useEffect(() => {
		if (
			seriesResponse &&
			oldKeyword.current !== props.keyword &&
			status === Status.LOADED_MAIN
		) {
			ectLogger.visit({
				classCode: ClassCode.SEARCH,
				specSearchDispType: seriesResponse?.seriesList.length
					? seriesResponse.specSearchDispType ?? '1'
					: undefined,
			});
			oldKeyword.current = props.keyword ?? '';
		}
	}, [seriesResponse, status, props.keyword]);

	return (
		<Presenter
			{...props}
			onChangeDisplayType={setDisplayType}
			displayType={displayType}
			status={status}
			totalCount={seriesResponse?.totalCount}
		/>
	);
};
