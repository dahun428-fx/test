import React, { useCallback, useEffect } from 'react';
import { SpecFilter as Presenter } from './SpecFilter';
import { usePartNumberCompletedToast } from '@/components/pc/ui/toasts/PartNumberCompletedToast.hooks';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectCurrentPartNumberResponse,
	searchPartNumberOperation,
} from '@/store/modules/pages/productDetail';
import { SendLogPayload } from '@/utils/domain/spec/types';

type Props = {
	seriesCode: string;
	className?: string;
};

export const SpecFilter: React.VFC<Props> = ({ seriesCode, className }) => {
	const {
		partNumberSpecList = [],
		cadTypeList = [],
		daysToShipList = [],
		completeFlag,
	} = useSelector(selectCurrentPartNumberResponse) ?? {};

	const store = useStore();

	const load = useCallback(
		(specs: Partial<SearchPartNumberRequest>) => {
			searchPartNumberOperation(store)({
				seriesCode,
				allSpecFlag: Flag.TRUE,
				// TODO: 60 を cookie などから取る必要があるなら差し替え
				pageSize: 60,
				...specs,
			});
			ga.events.specSearchTimes();
		},
		[seriesCode, store]
	);

	const loadWithHiddenSpec = useCallback(
		(specs: Partial<SearchPartNumberRequest>) => {
			searchPartNumberOperation(store)(
				{
					seriesCode,
					allSpecFlag: Flag.TRUE,
					// TODO: 60 を cookie などから取る必要があるなら差し替え
					pageSize: 60,
					...specs,
				},
				{ clearCurrentCondition: true }
			);
			ga.events.specSearchTimes();
		},
		[seriesCode, store]
	);

	const sendLog = useCallback(
		(payload: SendLogPayload) => {
			const { specName, specValueDisp, selected } = payload;
			ectLogger.partNumber.changeSpec({
				seriesCode,
				specName,
				specValueDisp,
				selectedFlag: Flag.toFlag(selected),
			});
		},
		[seriesCode]
	);

	/** to trigger toast notification when part-number is completed */
	const { showPartNumberCompleteToast } = usePartNumberCompletedToast();
	useEffect(
		() => {
			showPartNumberCompleteToast(completeFlag);
		},
		// NOTE: this is to trigger toast after each part number api call
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[completeFlag]
	);

	return (
		<Presenter
			specList={partNumberSpecList}
			cadTypeList={cadTypeList}
			daysToShipList={daysToShipList}
			onChange={load}
			onSelectHiddenSpec={loadWithHiddenSpec}
			sendLog={sendLog}
			className={className}
		/>
	);
};
SpecFilter.displayName = 'SpecFilter';
