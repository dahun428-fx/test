import { useSelector, useStore } from '@/store/hooks';
import { SpecFilter as Presenter } from './SpecFilter';
import {
	searchPartNumberOperation,
	selectCurrentPartNumberResponse,
} from '@/store/modules/pages/productDetail';
import { useCallback, useEffect } from 'react';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { ga } from '@/logs/analytics/google';
import { Flag } from '@/models/api/Flag';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { ectLogger } from '@/logs/ectLogger';
import { usePartNumberCompletedToast } from '@/components/pc/ui/toasts/PartNumberCompletedToast.hooks';
import { ParametricUnitPartNumberSpec } from './SpecFilter.types';

type Props = {
	seriesCode: string;
	className?: string;
};

export const SpecFilter: React.VFC<Props> = ({ seriesCode, className }) => {
	const {
		partNumberSpecList = [],
		completeFlag,
		alterationNoticeText,
		alterationSpecList = [],
		alterationSpecGroupList = [],
	} = useSelector(selectCurrentPartNumberResponse) ?? {};

	const store = useStore();

	const load = useCallback(
		(specs: Partial<SearchPartNumberRequest>, isHiddenSpec = false) => {
			searchPartNumberOperation(store)(
				{
					seriesCode,
					allSpecFlag: Flag.TRUE,
					// TODO: 60 を cookie などから取る必要があるなら差し替え
					pageSize: 60,
					...specs,
				},
				{ templateType: TemplateType.PU, clearCurrentCondition: isHiddenSpec }
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
			// TODO: sdk側で型が合ってない
			specList={partNumberSpecList as unknown as ParametricUnitPartNumberSpec[]}
			alterationNoticeText={alterationNoticeText}
			alterationSpecList={alterationSpecList}
			alterationSpecGroupList={alterationSpecGroupList}
			onChange={load}
			sendLog={sendLog}
			className={className}
		/>
	);
};

SpecFilter.displayName = 'SpecFilter';
