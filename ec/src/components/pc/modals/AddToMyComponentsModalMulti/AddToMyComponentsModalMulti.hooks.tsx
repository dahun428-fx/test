import { useCallback } from 'react';
import { useModal } from '../../ui/modals/Modal.hooks';
import { AddToMyComponentsModalMulti } from './AddToMyComponentsModalMulti';
import { AddMyComponentsResponse } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { config } from '@/config';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { store } from '@/store';
import { regacyPartNumberCopy } from '@/utils/clipboardCopy';
import { useTranslation } from 'react-i18next';
import styles from './AddToMyComponentsModalMulti.module.scss';

export const useAddToMyComponentsModalMulti = () => {
	const { showModal } = useModal();

	const authenticated = useSelector(selectAuthenticated);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const isEcUser = useSelector(selectIsEcUser);
	const { hasQuotePermission } = selectUserPermissions(store.getState());

	const [t] = useTranslation();

	const currencyCode = config.defaultCurrencyCode;

	const handleClipBoardCopy = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		partNumber: string
	) => {
		e.preventDefault();
		e.stopPropagation();
		regacyPartNumberCopy(partNumber);
		clipBoardSuccessShow(e.currentTarget);
	};

	const clipBoardSuccessShow = (target: HTMLAnchorElement) => {
		const html = document.createElement('div');
		const p = document.createElement('p');
		const text = t('components.modals.addToCartModalMulti.clipBoardMessage');
		const textEl = document.createTextNode(text);
		html.className = styles.copyBalloon || '';
		p.appendChild(textEl);
		html.appendChild(p);
		target.appendChild(html);
		setTimeout(() => {
			target.removeChild(html);
		}, 1000);
	};

	return useCallback(
		(
			addMyComponentsResponse: AddMyComponentsResponse,
			priceList: Price[],
			isCompare?: boolean
		) => {
			const myComponentsItemList = addMyComponentsResponse.myComponentsItemList;

			return showModal(
				<AddToMyComponentsModalMulti
					myComponentsItemList={myComponentsItemList}
					currencyCode={currencyCode}
					isPurchaseLinkUser={isPurchaseLinkUser}
					isEcUser={isEcUser}
					hasQuotePermission={hasQuotePermission}
					authenticated={authenticated}
					handleClipBoardCopy={handleClipBoardCopy}
					priceList={priceList}
					isCompare={isCompare}
				/>
			);
		},
		[authenticated, hasQuotePermission, isPurchaseLinkUser, showModal]
	);
};
