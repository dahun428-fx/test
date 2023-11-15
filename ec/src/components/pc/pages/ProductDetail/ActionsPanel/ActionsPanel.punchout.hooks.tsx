import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PurchaseLinkMessageList } from './PurchaseLinkMessageList';
import { useConfirmModal } from '@/components/pc/ui/modals/ConfirmModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import UnfitType from '@/models/api/constants/UnfitType';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { store } from '@/store';
import {
	selectUser,
	selectIsPurchaseLinkUser,
	selectIsAbleToCheckout,
	selectIsAbleToCheckoutWithUnfitProduct,
	selectInvalidChars,
	selectCheckoutMaxCount,
} from '@/store/modules/auth';
import {
	validatePrice,
	isProductAbleToCheckout,
	validateCheckoutCount,
} from '@/utils/domain/punchout';

type Result = 'ok' | 'cancel';

export const usePurchaseLink = () => {
	const { t } = useTranslation();
	const { showMessage } = useMessageModal();
	const { showConfirm } = useConfirmModal();

	const getAuth = useCallback(() => {
		// 他のタブでのログアウトなどの操作をした場合を考慮した auth store からの情報取得 (hook の state にはできない)
		// Retrieve data from the auth store, taking into account operations such as
		// logging out on other tabs. (Unable to use hook's state)
		const state = store.getState();
		return {
			user: selectUser(state),
			isPurchaseLinkUser: selectIsPurchaseLinkUser(state),
			invalidChars: selectInvalidChars(state),
			isAbleToCheckout: selectIsAbleToCheckout(state),
			isAbleToCheckoutWithUnfitProduct:
				selectIsAbleToCheckoutWithUnfitProduct(state),
			checkoutMaxCount: selectCheckoutMaxCount(state),
		};
	}, []);

	const validateToCheckoutBeforeCheckPrice = useCallback((): Result => {
		const { isAbleToCheckout, checkoutMaxCount } = getAuth();

		if (isAbleToCheckout) {
			const messageList = validateCheckoutCount({
				t,
				count: 1,
				checkoutMaxCount,
			});

			if (messageList.length) {
				showMessage(
					<PurchaseLinkMessageList messageList={messageList} />
				).then();
				return 'cancel';
			}
		}

		return 'ok';
	}, [getAuth, showMessage, t]);

	const validateToCheckout = useCallback(
		async (price: Price): Promise<Result> => {
			const {
				user,
				isPurchaseLinkUser,
				invalidChars,
				isAbleToCheckout,
				isAbleToCheckoutWithUnfitProduct,
			} = getAuth();

			if (isPurchaseLinkUser) {
				const messageList = validatePrice({
					t,
					price,
					isAbleToCheckout,
					invalidChars,
				});
				if (!isProductAbleToCheckout({ user, price })) {
					showMessage(
						<PurchaseLinkMessageList messageList={messageList} />
					).then();
					return 'cancel';
				} else {
					if (
						messageList.length > 0 &&
						price.unfitType !== undefined &&
						price.unfitType !== UnfitType.NotUnfit &&
						!isAbleToCheckoutWithUnfitProduct
					) {
						showMessage(
							<PurchaseLinkMessageList messageList={messageList} />
						).then();
						return 'cancel';
					} else {
						if (messageList.length > 0) {
							if (
								!(await showConfirm({
									message: (
										<PurchaseLinkMessageList messageList={messageList} />
									),
									confirmButton: t(
										'pages.productDetail.actionsPanel.confirmButton'
									),
									closeButton: t(
										'pages.productDetail.actionsPanel.closeButton'
									),
								}))
							) {
								return 'cancel';
							}
						}
					}
				}
			}
			return 'ok';
		},
		[getAuth, showConfirm, showMessage, t]
	);

	const validateToAddToCartOrMyComponents = useCallback(
		async (price: Price, message: string): Promise<Result> => {
			const { user, isPurchaseLinkUser, invalidChars, isAbleToCheckout } =
				getAuth();

			if (isPurchaseLinkUser) {
				const messageList = validatePrice({
					t,
					price,
					isAbleToCheckout,
					invalidChars,
				});

				if (!isAbleToCheckout) {
					if (messageList.length) {
						showMessage(
							<PurchaseLinkMessageList messageList={messageList} />
						).then();
						return 'cancel';
					}
					// チェックアウト不可能ユーザの場合、以降のバリデーションチェックを実行しない。(謎仕様だが ect-web-my の通り)
					// In the case of a non-checkoutable user, we do not perform
					// any further validation checks. (according to ect-web-my)
					return 'ok';
				}

				if (messageList.length) {
					if (isProductAbleToCheckout({ user, price })) {
						if (
							!(await showConfirm({
								message: <PurchaseLinkMessageList messageList={messageList} />,
								confirmButton: t(
									'pages.productDetail.actionsPanel.confirmButton'
								),
								closeButton: t('pages.productDetail.actionsPanel.closeButton'),
							}))
						) {
							return 'cancel';
						}
					} else {
						// Unable to checkout
						await showMessage(
							<PurchaseLinkMessageList messageList={messageList} />
						);
						return 'cancel';
					}
				} else {
					if (!isProductAbleToCheckout({ user, price })) {
						await showMessage(
							<PurchaseLinkMessageList
								messageList={[
									{
										type: 'error',
										message,
									},
								]}
							/>
						);
						return 'cancel';
					}
				}
			}
			return 'ok';
		},
		[getAuth, showConfirm, showMessage, t]
	);

	const validateToAddToCart = useCallback(
		(price: Price): Promise<Result> =>
			validateToAddToCartOrMyComponents(
				price,
				t('pages.productDetail.actionsPanel.unableToAddToCart')
			),
		[t, validateToAddToCartOrMyComponents]
	);

	const validateToAddToMyComponents = useCallback(
		(price: Price): Promise<Result> =>
			validateToAddToCartOrMyComponents(
				price,
				t('pages.productDetail.actionsPanel.unableToAddToMyComponents')
			),
		[t, validateToAddToCartOrMyComponents]
	);

	const validateCheckedPrice = useCallback(
		(price: Price | null) => {
			const { isPurchaseLinkUser, invalidChars, isAbleToCheckout } = getAuth();

			if (price && isPurchaseLinkUser) {
				const messageList = validatePrice({
					t,
					price,
					isAbleToCheckout,
					invalidChars,
				});
				if (messageList.length) {
					showMessage(
						<PurchaseLinkMessageList messageList={messageList} />
					).then();
				}
			}
		},
		[getAuth, showMessage, t]
	);

	return {
		validateToCheckoutBeforeCheckPrice,
		validateToCheckout,
		validateToAddToCart,
		validateToAddToMyComponents,
		validateCheckedPrice,
	};
};
