import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AddToCartModal } from './AddToCartModal';
import styles from './AddToCartModal.module.scss';
import { useModal } from '@/components/mobile/ui/modals/Modal.hooks';
import { AddCartResponse } from '@/models/api/msm/ect/cart/AddCartResponse';
import { useSelector } from '@/store/hooks';
import { selectIsPurchaseLinkUser, selectUser } from '@/store/modules/auth';

/** Add to cart modal hook */
export const useAddToCartModal = () => {
	const { showModal } = useModal();
	const { t } = useTranslation();
	const user = useSelector(selectUser);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const campaignApplyFlag = user?.campaignApplyFlag;

	return useCallback(
		(addCartResponse: AddCartResponse) =>
			// NOTE: This modal will change width when switching between portrait and landscape mode on mobile.
			//       Currently, on PHP site, width is fixed base on Portrait mode.
			showModal(
				<AddToCartModal
					{...{
						addCartResponse,
						campaignApplyFlag,
						isPurchaseLinkUser,
					}}
				/>,
				{
					title: (
						<span className={styles.title}>
							{t('mobile.components.modals.addToCartModal.title')}
						</span>
					),
					className: styles.modal,
				}
			),
		[campaignApplyFlag, isPurchaseLinkUser, showModal, t]
	);
};
