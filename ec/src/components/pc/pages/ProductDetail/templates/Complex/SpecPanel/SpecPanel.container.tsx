import { useRouter } from 'next/router';
import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpecPanel as Presenter } from './SpecPanel';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { usePartNumberCompletedToast } from '@/components/pc/ui/toasts/PartNumberCompletedToast.hooks';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { useSelector, useStore } from '@/store/hooks';
import {
	changeFocusesAlterationSpecs,
	clearPartNumberFilter,
	searchPartNumberOperation,
	selectCurrentPartNumberResponse,
	selectSort,
} from '@/store/modules/pages/productDetail';
import {
	selectFocusesAlterationSpecs,
	selectPrevSearchCondition,
} from '@/store/modules/pages/productDetail/selectors/complex';
import { assertValidPercent } from '@/utils/assertions';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { SendLogPayload } from '@/utils/domain/spec/types';

type Props = {
	seriesCode: string;
	actionsPanelRef: RefObject<HTMLDivElement>;
};

// Default value of selected item
const GUIDE_COUNT_DEFAULT = 1;

// Default value of total item
const MAX_GUIDE_COUNT_DEFAULT = 8;

/**
 * Spec panel container
 */
export const SpecPanel: React.VFC<Props> = ({
	seriesCode,
	actionsPanelRef,
}) => {
	// NOTE: retrieve entire part-number response to trigger the toast notification for any changes in response
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const focusesAlterationSpecs = useSelector(selectFocusesAlterationSpecs);
	const sort = useSelector(selectSort);
	const [progressPercent, setProgressPercent] = useState(0);
	const {
		partNumberSpecList = [],
		daysToShipList = [],
		cadTypeList = [],
		alterationNoticeText,
		alterationSpecList = [],
		completeFlag = Flag.FALSE,
	} = currentPartNumberResponse ?? {};
	const store = useStore();
	const { showMessage } = useMessageModal();
	const [t] = useTranslation();
	const router = useRouter();
	const { Tab } = router.query;

	const validateFilter = useCallback(
		({ fixedInfo, ...condition }) => {
			const isValid = Object.values(condition).some(
				item =>
					(Array.isArray(item) && item.length > 0) ||
					(!Array.isArray(item) && item !== undefined)
			);

			if (!isValid && !fixedInfo) {
				showMessage(
					t('pages.productDetail.complex.specPanel.specConditionsNotSet')
				);
				return false;
			}

			return true;
		},
		[showMessage, t]
	);

	const clearFilter = useCallback(() => {
		const prevCondition = selectPrevSearchCondition(store.getState());

		const isValid = validateFilter(prevCondition);

		if (!isValid) {
			return;
		}

		const pageSize = getPartNumberPageSize(Tab);

		clearPartNumberFilter(store)({
			seriesCode,
			pageSize,
			sort,
		});
	}, [Tab, seriesCode, sort, store, validateFilter]);

	const load = useCallback(
		(specs: Partial<SearchPartNumberResponse$search>) => {
			const pageSize = getPartNumberPageSize(Tab);

			searchPartNumberOperation(store)({
				seriesCode,
				...specs,
				fixedInfo: currentPartNumberResponse?.partNumberList[0]?.fixedInfo,
				pageSize,
				sort,
			});
			ga.events.specSearchTimes();
		},
		[Tab, currentPartNumberResponse?.partNumberList, seriesCode, sort, store]
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

	const scrollToActionsPanel = useCallback(() => {
		if (!actionsPanelRef?.current) {
			return;
		}
		actionsPanelRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}, [actionsPanelRef]);

	/** to trigger toast notification when part-number is completed */
	const { showPartNumberCompleteToast } = usePartNumberCompletedToast();
	useEffect(
		() => {
			showPartNumberCompleteToast(completeFlag);
			if (Flag.isTrue(completeFlag)) {
				scrollToActionsPanel();
			}
		},
		// NOTE: this is to trigger toast after each part number api call
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentPartNumberResponse]
	);

	/** Calculate progress bar percent */
	const calculateProgressBarPercent = useCallback(() => {
		if (!currentPartNumberResponse) {
			return;
		}

		const { guideCount, maxGuideCount, completeFlag } =
			currentPartNumberResponse;
		const currentStep = isFinite(guideCount) ? guideCount : GUIDE_COUNT_DEFAULT;
		const totalSteps = isFinite(maxGuideCount)
			? maxGuideCount
			: MAX_GUIDE_COUNT_DEFAULT;
		let percent = 0;

		if (totalSteps > 0) {
			percent = Math.round((currentStep / totalSteps) * 100);
		}

		if (Flag.isTrue(completeFlag)) {
			percent = 100;
		}

		assertValidPercent(percent);

		setProgressPercent(percent);
	}, [currentPartNumberResponse]);

	const showStandardSpecs = useCallback(
		() => changeFocusesAlterationSpecs(store.dispatch)(false),
		[store.dispatch]
	);

	useEffect(calculateProgressBarPercent, [calculateProgressBarPercent]);

	return (
		<Presenter
			specList={partNumberSpecList}
			daysToShipList={daysToShipList}
			cadTypeList={cadTypeList}
			progressPercent={progressPercent}
			alterationNoticeText={alterationNoticeText}
			alterationSpecList={alterationSpecList}
			focusesAlterationSpecs={focusesAlterationSpecs}
			showStandardSpecs={showStandardSpecs}
			onChange={load}
			onClearFilter={clearFilter}
			sendLog={sendLog}
		/>
	);
};
SpecPanel.displayName = 'SpecPanel';
