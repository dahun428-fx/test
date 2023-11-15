import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { addToCart as addToCartService } from '@/api/services/addToCart';
import { useAddToCartModal } from '@/components/pc/modals/AddToCartModal';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/pc/modals/PaymentMethodRequiredModal';
import { useUniversalLoader } from '@/components/pc/ui/loaders/UniversalLoader.context';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import {
	AddToCartType,
	ItemListName,
} from '@/logs/analytics/google/ecommerce/types';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { store } from '@/store';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { moveToOrder } from '@/utils/domain/order';
import { validateQuantity } from '@/utils/domain/quantity';

/**
 * No listed product actions.
 * - order now
 * - add to cart
 */
export const useNoListedProductActions = (type: Series) => {
	const { t } = useTranslation();

	const showLogin = useLoginModal();
	const showCompleteAddToCartModal = useAddToCartModal(type);
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();
	const { showMessage } = useMessageModal();
	const { showLoading, hideLoading } = useUniversalLoader();

	const verifyQuantity = useCallback(
		(quantity: number | null): quantity is number => {
			const messages = validateQuantity({ quantity }, t);
			if (messages[0]) {
				showMessage(messages[0]).then();
				return false;
			}
			return true;
		},
		[showMessage, t]
	);

	const verifyPermission = useCallback(
		async (
			requiredPermission: Extract<
				keyof ReturnType<typeof selectUserPermissions>,
				'hasOrderPermission' | 'hasCartPermission'
			>
		) => {
			if (!isAuthenticated()) {
				const result = await showLogin();
				if (result !== 'LOGGED_IN') {
					return false;
				}
			}

			const { isEcUser, permissions } = getUserAttributes();

			if (isEcUser) {
				showPaymentMethodRequiredModal().then();
				return false;
			}

			if (!permissions[requiredPermission]) {
				showMessage(
					t('pages.keywordSearch.partNumberTypeList.noCartPermissionError')
				).then();
				return false;
			}
			return true;
		},
		[showLogin, showMessage, showPaymentMethodRequiredModal, t]
	);

	const orderNow = useCallback(
		async (quantity: number | null) => {
			if (!verifyQuantity(quantity)) {
				return;
			}

			if (!(await verifyPermission('hasOrderPermission'))) {
				return;
			}

			aa.events.sendAddToCartOrOrderNow(type);
			ga.events.orderNoListedProduct(type);

			moveToOrder({
				partNumber: type.partNumber,
				seriesCode: type.seriesCode,
				brandName: type.brandName,
				brandCode: type.brandCode,
				quantity,
			});
		},
		[type, verifyPermission, verifyQuantity]
	);

	const addToCart = useCallback(
		async (quantity: number | null) => {
			if (!verifyQuantity(quantity)) {
				return;
			}

			if (!(await verifyPermission('hasCartPermission'))) {
				return;
			}

			showLoading();
			try {
				const response = await addToCartService({
					cartItemList: [
						{
							partNumber: type.partNumber,
							brandCode: type.brandCode,
							quantity,
						},
					],
				});

				aa.events.sendAddToCartOrOrderNow(type);
				ga.ecommerce.addToCart({
					type: AddToCartType.NO_LISTED_IN_CATALOG,
					currencyCode: response.currencyCode,
					products: response.cartItemList.map(item => {
						return {
							seriesCode: item.seriesCode,
							innerCode: item.innerCode,
							partNumber: item.partNumber,
							quantity: item.quantity,
							itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
						};
					}),
				});

				showCompleteAddToCartModal(response).then();
			} finally {
				hideLoading();
			}
		},
		[
			verifyQuantity,
			verifyPermission,
			showLoading,
			type,
			showCompleteAddToCartModal,
			hideLoading,
		]
	);

	return { addToCart, orderNow };
};

export const useAuth = () => ({
	isPurchaseLinkUser: useSelector(selectIsPurchaseLinkUser),
});

function isAuthenticated() {
	return selectAuthenticated(store.getState());
}

function getUserAttributes() {
	const storeState = store.getState();
	const isEcUser = selectIsEcUser(storeState);
	const permissions = selectUserPermissions(storeState);

	return { isEcUser, permissions };
}
