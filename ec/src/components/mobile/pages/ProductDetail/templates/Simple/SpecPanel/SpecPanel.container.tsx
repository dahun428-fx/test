import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpecPanel as Presenter } from './SpecPanel';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { AssertionError } from '@/errors/app/AssertionError';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { PAGE_SIZE } from '@/models/pages/productDetail/shared.mobile';
import { useSelector, useStore } from '@/store/hooks';
import {
	checkPriceOperation,
	clearPartNumberFilter,
	searchPartNumberOperation,
	selectChecking,
	selectCurrentPartNumberList,
	selectCurrentPartNumberResponse,
	selectSeries,
	selectShowsSpecPanel,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/productDetail';
import { selectPrevSearchCondition } from '@/store/modules/pages/productDetail/selectors/complex';
import { first } from '@/utils/collection';
import { SendLogPayload } from '@/utils/domain/spec/types';

/**
 * Spec panel container
 */
export const SpecPanel: React.VFC = () => {
	const store = useStore();
	const currentPartNumberResponse = useSelector(
		selectCurrentPartNumberResponse
	);
	const partNumberList = useSelector(selectCurrentPartNumberList);
	const series = useSelector(selectSeries);
	const showsSpecPanel = useSelector(selectShowsSpecPanel);
	const checking = useSelector(selectChecking);
	const [quantity, setQuantity] = useState<number | null>(1);
	const { showMessage } = useMessageModal();

	const [t] = useTranslation();
	const {
		partNumberSpecList = [],
		cadTypeList = [],
		totalCount,
		maxGuideCount,
		guideCount,
		completeFlag,
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

	const handleReset = useCallback(() => {
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

	const resetQuantity = useCallback(() => {
		const partNumber = first(currentPartNumberResponse?.partNumberList);

		setQuantity(partNumber?.minQuantity ?? partNumber?.orderUnit ?? 1);
	}, [currentPartNumberResponse?.partNumberList]);

	const handleConfirm = useCallback(async () => {
		try {
			// If the part number has not been completed, please skip the price check and close the control panel.
			// Even if the part number is not completed, it can be completed when the specs that can be selected become 0. (Export prohibited part number, etc.)
			if (Flag.isTrue(completeFlag)) {
				await checkPriceOperation(store)(quantity, t);
			}

			toggleShowsSpecPanel(store)();
		} catch (error) {
			if (error instanceof AssertionError) {
				if (error.messages.length) {
					resetQuantity();
					if (
						error.message.includes(t('utils.domain.quantity.notIntegerWarning'))
					) {
						showMessage(t('utils.domain.quantity.notIntegerWarning'));
						return;
					}
					showMessage(
						<>
							{error.messages.map((item, index) => (
								<div key={index}>{item}</div>
							))}
						</>
					);
				}
			}
		}
	}, [completeFlag, quantity, resetQuantity, showMessage, store, t]);

	useEffect(() => {
		resetQuantity();
	}, [resetQuantity]);

	if (!showsSpecPanel) {
		return null;
	}

	return (
		<Presenter
			specList={partNumberSpecList}
			cadTypeList={cadTypeList}
			partNumber={partNumberList[0]?.partNumber}
			totalCount={totalCount}
			maxGuideCount={maxGuideCount}
			guideCount={guideCount}
			completeFlag={completeFlag}
			checking={checking}
			quantity={quantity}
			orderUnit={first(partNumberList)?.orderUnit}
			onChange={load}
			onClose={handleClose}
			onReset={handleReset}
			onConfirm={handleConfirm}
			onChangeQuantity={setQuantity}
		/>
	);
};
SpecPanel.displayName = 'SpecPanel';
