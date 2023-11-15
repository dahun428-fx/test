import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AddToMyComponentsButton as Presenter } from './AddToMyComponentsButton';
import { addMyComponents } from '@/api/services/addMyComponents';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { useAddToMyComponentsModal } from '@/components/mobile/pages/ProductDetail/ProductActions/AddToMyComponentsModal';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { useSelector, useStore } from '@/store/hooks';
import { refreshAuth, selectAuthenticated } from '@/store/modules/auth';
import {
	selectCompletedPartNumber,
	selectPrice,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';

type Props = {
	className?: string;
};

export const AddToMyComponentsButton: React.VFC<Props> = ({ className }) => {
	const dispatch = useDispatch();
	const store = useStore();

	const completedPartNumber = useSelector(selectCompletedPartNumber);
	const price = useSelector(selectPrice);
	const series = useSelector(selectSeries);
	const showLoginModal = useLoginModal();
	const showAddToMyComponentsModal = useAddToMyComponentsModal();

	/** add to my components */
	const addToMyComponents = useCallback(async () => {
		assertNotNull(completedPartNumber);
		assertNotNull(price);

		ga.events.addToMyComponents({
			partNumber: completedPartNumber.partNumber,
			innerCode: completedPartNumber.innerCode,
		});

		await refreshAuth(dispatch)();

		if (!selectAuthenticated(store.getState())) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return false;
			}
		}

		const addMyComponentResponse = await addMyComponents({
			myComponentsItemList: [
				{
					seriesCode: series.seriesCode,
					brandCode: price.brandCode ?? '',
					partNumber: completedPartNumber.partNumber,
					quantity: price.quantity,
					innerCode: price.innerCode,
					unitPrice: price.unitPrice,
					standardUnitPrice: price.standardUnitPrice,
					daysToShip: price.daysToShip,
					shipType: price.shipType,
					piecesPerPackage: price.piecesPerPackage,
				},
			],
			priceCheckFlag: '0',
			siteCode: '1',
		});

		if (addMyComponentResponse.myComponentsItemList.length > 0) {
			showAddToMyComponentsModal();
			aa.events.sendAddToMyComponents();
		}
	}, [
		completedPartNumber,
		dispatch,
		price,
		series.seriesCode,
		showAddToMyComponentsModal,
		showLoginModal,
		store,
	]);

	return (
		<Presenter
			className={className}
			disabled={completedPartNumber === null || price === null}
			addToMyComponents={addToMyComponents}
		/>
	);
};
