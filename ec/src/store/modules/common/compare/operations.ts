import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { Dispatch } from 'redux';
import { compareActions, selectComparePriceCache } from '.';
import { addCompareItem } from '@/services/localStorage/compare';
import { CompareLoadStatus } from './types';
import { AppStore } from '@/store';
import { TFunction } from 'react-i18next';
import { assertNotEmpty } from '@/utils/assertions';
import { ApplicationError } from '@/errors/ApplicationError';
import { checkPrice } from '@/api/services/checkPrice';
import { correctPriceIfPurchaseLinkUser } from '@/utils/domain/price';
import { selectUser } from '../../auth';

export const updateShowsCompareBalloonStatusOperation = (
	dispatch: Dispatch
) => {
	return (show: boolean) => {
		dispatch(show ? compareActions.show() : compareActions.hide());
	};
};

export const addItemOperation = (dispatch: Dispatch) => {
	return (item: CompareItem) => {
		dispatch(compareActions.setItem(item));
		addCompareItem(item);
	};
};

export const updateCompareOperation = (dispatch: Dispatch) => {
	return (compare: Compare) => {
		dispatch(compareActions.updateCompare(compare));
	};
};

export const removeItemOperation = (dispatch: Dispatch) => {
	return (compareItem: CompareItem) => {
		dispatch(compareActions.removeItem(compareItem));
	};
};

export const updateCompareStatusOperation = (dispatch: Dispatch) => {
	return (status: CompareLoadStatus) => {
		dispatch(compareActions.updateCompare({ status }));
	};
};

export function checkPriceOperation({ getState, dispatch }: AppStore) {
	/**
	 * WARN: 型番未確定時はこの operation を呼んではならない
	 * @throws {AssertionError}
	 * @throws {MsmApiError}
	 */
	async function check(compareItems: CompareItem[]): Promise<void>;
	/**
	 * WARN: 型番未確定時はこの operation を呼んではならない
	 * @param compareItems
	 * @throws {AssertionError}
	 * @throws {MsmApiError}
	 */
	async function check(compareItems: CompareItem[]): Promise<void>;
	async function check(compareItems: CompareItem[]): Promise<void> {
		const storeState = getState();
		const priceCache = selectComparePriceCache(storeState);
		const userInfo = selectUser(storeState);

		if (!priceCache) return;

		const items = compareItems.reduce<CompareItem[]>((previous, current) => {
			const quantity = 1;
			if (priceCache[`${current.partNumber}\t${quantity}`]) {
				return previous;
			} else {
				return [...previous, current];
			}
		}, []);

		if (items.length < 1) return;

		const productList = items.map(item => {
			if (item.seriesCode === null || item.partNumber === null) {
				throw new ApplicationError(
					`Can not check price. series: [${item.seriesCode}] partNumber: [${item.partNumber}]`
				);
			}
			return {
				partNumber: item.partNumber,
				quantity: 1,
				brandCode: item.brandCode,
			};
		});

		try {
			const response = await checkPrice({ productList });
			if (response.priceList[0] === undefined) {
				return;
			}

			const { priceList } = response;
			assertNotEmpty(priceList);

			priceList.map(item => {
				dispatch(
					compareActions.updateComparePriceCache(
						correctPriceIfPurchaseLinkUser(item, userInfo)
					)
				);
			});
		} catch (error) {}
	}
	return check;
}
