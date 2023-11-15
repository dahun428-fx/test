import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AddToMyComponentsButton as Presenter } from './AddToMyComponentsButton';
import { addMyComponents } from '@/api/services/addMyComponents';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { useAddToMyComponentsModal } from '@/components/mobile/pages/ProductDetail/ProductActions/AddToMyComponentsModal';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { useSelector, useStore } from '@/store/hooks';
import { refreshAuth, selectAuthenticated } from '@/store/modules/auth';
import {
	selectCompletedPartNumber,
	selectPrice,
	selectSeries,
} from '@/store/modules/pages/productDetail';

/** Add to my components button container */
export const AddToMyComponentsButton: React.VFC = () => {
	const dispatch = useDispatch();
	const store = useStore();
	const completedPartNumber = useSelector(selectCompletedPartNumber);
	const price = useSelector(selectPrice);
	const series = useSelector(selectSeries);
	const showLoginModal = useLoginModal();
	const showAddToMyComponentsModal = useAddToMyComponentsModal();
	const [loading, startToLoading, endLoading] = useBoolState(false);

	/** add to my components */
	const addToMyComponents = useCallback(async () => {
		if (!completedPartNumber || !price) {
			return;
		}

		const {
			brandCode = '',
			quantity,
			innerCode,
			unitPrice,
			standardUnitPrice,
			daysToShip,
			shipType,
			piecesPerPackage,
		} = price;

		ga.events.addToMyComponents({
			partNumber: completedPartNumber.partNumber,
			innerCode: completedPartNumber.innerCode,
		});

		try {
			startToLoading();
			await refreshAuth(dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return false;
				}
			}

			const response = await addMyComponents({
				myComponentsItemList: [
					{
						partNumber: completedPartNumber.partNumber,
						seriesCode: series.seriesCode,
						brandCode,
						quantity,
						innerCode,
						unitPrice,
						standardUnitPrice,
						daysToShip,
						shipType,
						piecesPerPackage,
					},
				],
				priceCheckFlag: '0',
				siteCode: '1',
			});

			if (response.myComponentsItemList.length > 0) {
				showAddToMyComponentsModal();
				aa.events.sendAddToMyComponents();
			}
		} catch (error) {
			// noop
		} finally {
			endLoading();
		}
	}, [
		completedPartNumber,
		dispatch,
		endLoading,
		price,
		series.seriesCode,
		showAddToMyComponentsModal,
		showLoginModal,
		startToLoading,
		store,
	]);

	return (
		<Presenter
			disabled={!completedPartNumber}
			loading={loading}
			addToMyComponents={addToMyComponents}
		/>
	);
};
AddToMyComponentsButton.displayName = 'AddToMyComponentsButton';
