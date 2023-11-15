import React, { RefObject, useCallback } from 'react';
import { SpecPanel as Presenter } from './SpecPanel';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { PAGE_SIZE } from '@/models/pages/productDetail/shared.mobile';
import { useSelector, useStore } from '@/store/hooks';
import {
	clearPartNumberFilter,
	searchPartNumberOperation,
	selectCompletedPartNumber,
	selectCurrentPartNumberList,
	selectCurrentPartNumberResponse,
	selectSeries,
	selectShowsSpecPanel,
	selectSoleProductAttributes,
	toggleShowsPartNumberListPanel,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/productDetail';
import { selectPrevSearchCondition } from '@/store/modules/pages/productDetail/selectors/complex';
import { SendLogPayload } from '@/utils/domain/spec/types';

type Props = {
	partNumberBarRef: RefObject<HTMLDivElement>;
};

/**
 * Spec panel container
 */
export const SpecPanel: React.VFC<Props> = ({ partNumberBarRef }) => {
	const store = useStore();
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const partNumberList = useSelector(selectCurrentPartNumberList);
	const completedPartNumber =
		useSelector(selectCompletedPartNumber)?.partNumber ?? undefined;
	const series = useSelector(selectSeries);
	const showsSpecPanel = useSelector(selectShowsSpecPanel);
	const { cautionList, noticeList } = useSelector(selectSoleProductAttributes);
	const {
		partNumberSpecList = [],
		alterationNoticeText,
		alterationSpecList = [],
		cadTypeList = [],
		totalCount,
		completeFlag = Flag.FALSE,
	} = currentPartNumberResponse ?? {};

	const shouldSearchPartNumber = useCallback(
		({ fixedInfo, ...condition }) =>
			fixedInfo ||
			Object.values(condition).some(
				specValues =>
					(Array.isArray(specValues) && specValues.length > 0) ||
					(!Array.isArray(specValues) && specValues !== undefined)
			),
		[]
	);

	const handleClearFilter = useCallback(() => {
		if (!shouldSearchPartNumber(selectPrevSearchCondition(store.getState()))) {
			return;
		}
		clearPartNumberFilter(store)({
			seriesCode: series.seriesCode,
			pageSize: PAGE_SIZE,
		});
	}, [series.seriesCode, shouldSearchPartNumber, store]);

	const sendLog = useCallback(
		(payload: SendLogPayload) => {
			ectLogger.partNumber.changeSpec({
				seriesCode: series.seriesCode,
				specName: payload.specName,
				specValueDisp: payload.specValueDisp,
				selectedFlag: Flag.toFlag(payload.selected),
			});
		},
		[series.seriesCode]
	);

	const load = useCallback(
		({ selectedSpecs, log }: ChangePayload) => {
			searchPartNumberOperation(store)({
				seriesCode: series.seriesCode,
				fixedInfo: currentPartNumberResponse?.partNumberList[0]?.fixedInfo,
				pageSize: PAGE_SIZE,
				...selectedSpecs,
			});

			if (log) {
				if (log instanceof Array) {
					log.forEach(sendLog);
				} else {
					sendLog(log);
				}
			}
			ga.events.specSearchTimes();
		},
		[
			currentPartNumberResponse?.partNumberList,
			sendLog,
			series.seriesCode,
			store,
		]
	);

	const handleClose = useCallback(() => {
		toggleShowsSpecPanel(store)();
	}, [store]);

	const handleConfirm = useCallback(() => {
		partNumberBarRef.current?.scrollIntoView({ behavior: 'smooth' });
		toggleShowsSpecPanel(store)();
	}, [partNumberBarRef, store]);

	const handleClickPartNumberCount = useCallback(() => {
		toggleShowsPartNumberListPanel(store)();
	}, [store]);

	if (!showsSpecPanel) {
		return null;
	}

	return (
		<Presenter
			series={series}
			partNumber={
				// 不本意だが ect-web-th の通り。型番確定したかではなく、1件になったかで表示制御される。
				partNumberList.length === 1 ? partNumberList[0]?.partNumber : undefined
			}
			completedPartNumber={completedPartNumber}
			totalCount={totalCount}
			specList={partNumberSpecList}
			cadTypeList={cadTypeList}
			alterationNoticeText={alterationNoticeText}
			cautionList={cautionList}
			noticeList={noticeList}
			alterationSpecList={alterationSpecList}
			completeFlag={completeFlag}
			onChange={load}
			onClose={handleClose}
			onClearFilter={handleClearFilter}
			onClickPartNumberCount={handleClickPartNumberCount}
			onConfirm={handleConfirm}
		/>
	);
};
SpecPanel.displayName = 'SpecPanel';
