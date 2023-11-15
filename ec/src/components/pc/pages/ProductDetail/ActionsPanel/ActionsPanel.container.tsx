import Router from 'next/router';
import React, { useCallback, useEffect, useState, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionsPanel as Presenter } from './ActionsPanel';
import { usePurchaseLink } from './ActionsPanel.punchout.hooks';
import { PriceCheckResult } from './types';
import { addMyComponents } from '@/api/services/addMyComponents';
import { addToCart as addToCartApi } from '@/api/services/addToCart';
import { useAddToCartModal } from '@/components/pc/modals/AddToCartModal';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/pc/modals/PaymentMethodRequiredModal';
import { useAddToMyComponentsModal } from '@/components/pc/pages/ProductDetail/AddToMyComponentsModal/AddToMyComponentsModal.hooks';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { ApplicationError } from '@/errors/ApplicationError';
import { AssertionError } from '@/errors/app/AssertionError';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { AddToCartType } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { CartItem } from '@/models/api/msm/ect/cart/AddCartRequest';
import { store } from '@/store';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsEcUser,
	selectUser,
	selectUserPermissions,
	refreshAuth,
	selectIsPurchaseLinkUser,
	selectIsAbleToCheckout,
} from '@/store/modules/auth';
import {
	selectTemplateType,
	changeFocusesAlterationSpecs,
	selectAlterationSpecList,
	selectCategoryCodeList,
	selectSeries,
	selectSoleProductAttributes,
	updateQuantity,
	selectPrice,
	checkPriceOperation,
	selectChecking,
	clearPriceCache,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';
import { moveToOrder, moveToQuote, moveToCheckout } from '@/utils/domain/order';
import { getMinOrderQuantity } from '@/utils/domain/price';
import { assertQuantity } from '@/utils/domain/quantity';

type Props = {
	seriesCode: string;
	stickyEnabled?: boolean;
	alterationSpecEnabled?: boolean;
	similarSearchEnabled?: boolean;
	actionsPanelRef?: RefObject<HTMLDivElement>;
};

/**
 * Order Actions Panel container
 * WARN: Experimental. Violates development rules. Container implementation is forbidden, implement with hooks.
 */
export const ActionsPanel: React.FC<Props> = ({
	seriesCode,
	stickyEnabled,
	alterationSpecEnabled,
	similarSearchEnabled,
	children,
	actionsPanelRef,
}) => {
	// auth
	const authenticated = useSelector(selectAuthenticated);
	const isEcUser = useSelector(selectIsEcUser);
	const user = useSelector(selectUser);
	const { hasCartPermission, hasOrderPermission, hasQuotePermission } =
		useSelector(selectUserPermissions);

	// auth / purchase link user
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const isAbleToCheckout = useSelector(selectIsAbleToCheckout);

	// purchase link
	const {
		validateToCheckoutBeforeCheckPrice,
		validateToCheckout,
		validateToAddToCart,
		validateToAddToMyComponents,
		validateCheckedPrice,
	} = usePurchaseLink();

	// product attributes
	const product = useSelector(selectSoleProductAttributes);
	const alterationSpecList = useSelector(selectAlterationSpecList);
	const templateType = useSelector(selectTemplateType);
	const isTemplateTypeSimple = templateType === TemplateType.SIMPLE;

	// series
	const series = useSelector(selectSeries);
	const categoryCodeList = useSelector(selectCategoryCodeList);

	// utils
	const { t } = useTranslation();
	const { showMessage } = useMessageModal();

	// price check
	const [showsCheck, showCheck, hideCheck] = useBoolState(true);
	const price = useSelector(selectPrice);
	const [inputQuantity, setInputQuantity] = useState<number | null>(null);
	const checking = useSelector(selectChecking);

	// some actions
	const [processing, startToProcess, endProcessing] = useBoolState(false);

	// modals
	const showLoginModal = useLoginModal();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();
	const showAddToCartModal = useAddToCartModal(series);
	const showAddToMyComponentsModal = useAddToMyComponentsModal(seriesCode);

	// Variable to check if the user able to add to cart
	const isAddToCartEnabled =
		!authenticated || (authenticated && isEcUser) ? true : hasCartPermission;

	const onChangeQuantity = useCallback(
		(quantity: number | null) => {
			setInputQuantity(quantity);
			showCheck();
		},
		[showCheck]
	);

	const resetQuantity = useCallback(
		(quantity: number | null) => {
			updateQuantity(store.dispatch)(quantity);
			onChangeQuantity(quantity);
		},
		[onChangeQuantity]
	);

	/** price check */
	const check = useCallback(async (): Promise<PriceCheckResult> => {
		assertPartNumberIsCompleted(product);

		try {
			await checkPriceOperation(store)(inputQuantity, t);

			hideCheck();
		} catch (error) {
			if (error instanceof AssertionError) {
				// If a quantity validation error occurs, the quantity is forced to change
				// its value in the order of minimum order quantity and order unit quantity priority.
				resetQuantity(getMinOrderQuantity(product));
				if (error.messages[0]) {
					showMessage(error.messages[0]);
					return 'error';
				}
			}
			throw error;
		}
		return 'success';
	}, [product, inputQuantity, t, hideCheck, resetQuantity, showMessage]);

	/**
	 * Handle check price click
	 * - NOTE: 購買連携ユーザ向けのメッセージモーダル出し分けのためにやむなく切り出し。
	 *         We had to create this method to display message and buttons on a modal for purchase link users.
	 */
	const handleClickCheckPrice = useCallback(async () => {
		assertPartNumberIsCompleted(product);
		await check();

		ga.events.checkPrice({
			partNumberCount: 1,
			partNumber: product.partNumber,
			innerCode: product.innerCode,
		});

		// validate for purchase link user
		validateCheckedPrice(getPrice());
	}, [check, product, validateCheckedPrice]);

	/** add to cart */
	const addToCart = useCallback(async () => {
		try {
			assertPartNumberIsCompleted(product);
			startToProcess();

			// NOTE: Get the latest user info when executing add to cart
			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if (selectIsEcUser(store.getState())) {
				showPaymentMethodRequiredModal();
				return;
			}

			if (!selectUserPermissions(store.getState()).hasCartPermission) {
				showMessage(t('common.cart.noPermission'));
				return;
			}

			if ((await check()) === 'error') {
				return;
			}

			const checkedPrice = getPrice();

			if (!checkedPrice) {
				return;
			}

			// validate for purchase link user
			if ((await validateToAddToCart(checkedPrice)) === 'cancel') {
				return;
			}

			const cartItem: CartItem = {
				seriesCode,
				brandCode: product.brandCode,
				partNumber: product.partNumber,
				quantity: checkedPrice.quantity,
				innerCode: checkedPrice.innerCode,
				unitPrice: checkedPrice.unitPrice,
				standardUnitPrice: checkedPrice.standardUnitPrice,
				daysToShip: checkedPrice.daysToShip,
				shipType: checkedPrice.shipType,
				piecesPerPackage: checkedPrice.piecesPerPackage,
			};

			const addToCartResponse = await addToCartApi({
				cartItemList: [cartItem],
			});

			ga.ecommerce.addToCart({
				type: AddToCartType.PRODUCT_DETAIL,
				products: [{ ...checkedPrice, seriesCode }],
				currencyCode:
					checkedPrice.currencyCode ?? addToCartResponse.currencyCode,
			});
			aa.events.sendAddToCart({
				categoryCodeList,
				brandCode: product.brandCode,
				seriesCode,
			});

			showAddToCartModal(addToCartResponse, checkedPrice);
		} finally {
			endProcessing();
		}
	}, [
		categoryCodeList,
		check,
		endProcessing,
		product,
		seriesCode,
		showAddToCartModal,
		showLoginModal,
		showMessage,
		showPaymentMethodRequiredModal,
		startToProcess,
		t,
		validateToAddToCart,
	]);

	/** order now */
	const orderNow = useCallback(async () => {
		try {
			assertPartNumberIsCompleted(product);

			ga.events.orderNow({
				partNumberCount: 1,
				partNumber: product.partNumber,
				innerCode: product.innerCode,
			});

			startToProcess();

			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if (selectIsEcUser(store.getState())) {
				showPaymentMethodRequiredModal();
				return;
			}

			if (!selectUserPermissions(store.getState()).hasOrderPermission) {
				showMessage(t('common.order.noPermission'));
				return;
			}

			if ((await check()) === 'error') {
				return;
			}

			const checkedPrice = getPrice();

			// REVIEW: Not display anything? The following is copied from mobile ActionsPanel
			// NOTE: Do not redirect to WOS order page when check price error
			if (!checkedPrice) {
				return;
			}

			aa.events.sendOrderNow();

			moveToOrder({
				...checkedPrice,
				seriesCode,
				seriesName: series.seriesName,
				brandName: series.brandName,
				brandCode: series.brandCode,
			});
		} finally {
			endProcessing();
		}
	}, [
		product,
		startToProcess,
		check,
		seriesCode,
		series.seriesName,
		series.brandName,
		series.brandCode,
		showLoginModal,
		showPaymentMethodRequiredModal,
		showMessage,
		t,
		endProcessing,
	]);

	/** Add to my components */
	const addToMyComponents = useCallback(async () => {
		try {
			assertPartNumberIsCompleted(product);

			ga.events.addToMyComponents({
				partNumber: product.partNumber,
				innerCode: product.innerCode,
			});

			startToProcess();

			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if ((await check()) === 'error') {
				return;
			}

			const checkedPrice = getPrice();

			if (!checkedPrice) {
				return;
			}

			// validate for purchase link user
			if ((await validateToAddToMyComponents(checkedPrice)) === 'cancel') {
				return;
			}

			await addMyComponents({
				myComponentsItemList: [
					{
						seriesCode,
						brandCode: checkedPrice.brandCode ?? '',
						partNumber: checkedPrice.partNumber,
						quantity: checkedPrice.quantity,
						innerCode: checkedPrice.innerCode,
						unitPrice: checkedPrice.unitPrice,
						standardUnitPrice: checkedPrice.standardUnitPrice,
						daysToShip: checkedPrice.daysToShip,
						shipType: checkedPrice.shipType,
						piecesPerPackage: checkedPrice.piecesPerPackage,
					},
				],
				priceCheckFlag: '0',
				siteCode: '1',
			});

			showAddToMyComponentsModal();
			aa.events.sendAddToMyComponents();
		} finally {
			endProcessing();
		}
	}, [
		check,
		endProcessing,
		product,
		seriesCode,
		showAddToMyComponentsModal,
		showLoginModal,
		startToProcess,
		validateToAddToMyComponents,
	]);

	const quoteOnWOS = useCallback(async () => {
		try {
			assertPartNumberIsCompleted(product);
			assertNotNull(price);
			ga.events.quote();

			assertQuantity(inputQuantity, product, t);

			startToProcess();
			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if (selectIsEcUser(store.getState())) {
				showPaymentMethodRequiredModal();
				return;
			}

			if (!selectUserPermissions(store.getState()).hasQuotePermission) {
				showMessage(t('pages.productDetail.actionsPanel.noQuotePermission'));
				return;
			}

			aa.events.sendQuote();

			moveToQuote({
				...price,
				partNumber: product.partNumber,
				seriesCode: series.seriesCode,
				brandName: series.brandName,
				brandCode: series.brandCode,
			});
		} catch (error) {
			if (error instanceof AssertionError && error.messages[0]) {
				showMessage(error.messages[0]);
				return;
			}
			throw error;
		} finally {
			endProcessing();
		}
	}, [
		endProcessing,
		inputQuantity,
		price,
		product,
		series.brandCode,
		series.brandName,
		series.seriesCode,
		showLoginModal,
		showMessage,
		showPaymentMethodRequiredModal,
		startToProcess,
		t,
	]);

	const checkout = useCallback(async () => {
		try {
			assertPartNumberIsCompleted(product);

			ga.events.checkout({
				partNumber: product.partNumber,
				innerCode: product.innerCode,
			});

			startToProcess();

			await refreshAuth(store.dispatch)();

			// 他のタブでのログアウトなどの操作をした場合を考慮した auth store からの情報取得
			// Retrieve data from the auth store, taking into account operations such as
			// logging out on other tabs.
			const state = store.getState();
			if (!selectAuthenticated(state) || !selectIsAbleToCheckout(state)) {
				Router.reload(); // According to ect-web
				return;
			}

			if (validateToCheckoutBeforeCheckPrice() === 'cancel') {
				return;
			}

			if ((await check()) === 'error') {
				return;
			}

			const checkedPrice = getPrice();

			// REVIEW: Not display anything? The following is copied from mobile ActionsPanel
			// NOTE: Do not redirect to WOS order page when check price error
			if (!checkedPrice) {
				return;
			}

			// validate for purchase link user
			if ((await validateToCheckout(checkedPrice)) === 'cancel') {
				return;
			}

			moveToCheckout({
				...checkedPrice,
				seriesCode,
				seriesName: series.seriesName,
				brandName: series.brandName,
				brandCode: series.brandCode,
			});
		} finally {
			endProcessing();
		}
	}, [
		check,
		endProcessing,
		product,
		series.brandCode,
		series.brandName,
		series.seriesName,
		seriesCode,
		startToProcess,
		validateToCheckout,
		validateToCheckoutBeforeCheckPrice,
	]);

	const focusOptionSpecs = useCallback(() => {
		changeFocusesAlterationSpecs(store.dispatch)(true);

		// scroll to top of spec panel
		const specPanelEl = document.querySelector('#specPanel');
		specPanelEl?.scrollTo?.({ behavior: 'smooth', top: 0 });

		// scroll to alteration spec drawing
		const alterationHtmlEl = document.querySelector('#alterationHtml');
		// TODO: NEW_FE-2660 When implement to float actions panel and tabs, need offset from top.
		alterationHtmlEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });

		ga.events.clickShowAlterationSpecs();
	}, []);

	useEffect(() => {
		// If changed user info, will clear cache.
		clearPriceCache(store.dispatch)();
		// NOTE: Do not change this to `user`, it will create a side effect: when adding to my components twice, the 2nd time does not work.
	}, [user?.userCode]);

	useEffect(() => {
		resetQuantity(
			Flag.isTrue(product.completeFlag) ? getMinOrderQuantity(product) : null
		);
	}, [onChangeQuantity, product, resetQuantity]);

	return (
		<Presenter
			showsCheck={showsCheck}
			quantity={inputQuantity}
			onChangeQuantity={onChangeQuantity}
			product={product}
			alterationSpecEnabled={alterationSpecEnabled}
			alterationSpecList={alterationSpecList}
			isTemplateTypeSimple={isTemplateTypeSimple}
			similarSearchEnabled={similarSearchEnabled}
			price={price ?? undefined}
			loading={checking || processing}
			checkPrice={handleClickCheckPrice}
			orderNow={orderNow}
			addToCart={addToCart}
			quoteOnWOS={quoteOnWOS}
			checkout={checkout}
			addToMyComponents={addToMyComponents}
			focusOptionSpecs={focusOptionSpecs}
			authenticated={authenticated}
			isEcUser={isEcUser}
			hasOrderPermission={hasOrderPermission}
			hasQuotePermission={hasQuotePermission}
			isAddToCartEnabled={isAddToCartEnabled}
			isPurchaseLinkUser={isPurchaseLinkUser}
			isAbleToCheckout={isAbleToCheckout}
			stickyEnabled={stickyEnabled}
			actionsPanelRef={actionsPanelRef}
		>
			{children}
		</Presenter>
	);
};
ActionsPanel.displayName = 'ActionsPanel';

/**
 * get the latest price from store
 */
function getPrice() {
	return selectPrice(store.getState());
}

type ProductAttributes = ReturnType<typeof selectSoleProductAttributes>;

function assertPartNumberIsCompleted(
	product: ProductAttributes
): asserts product is ProductAttributes & { partNumber: string } {
	if (Flag.isFalse(product.completeFlag) || product.partNumber == null) {
		throw new ApplicationError(
			`Part number is not completed. seriesCode:[${product.seriesCode}], partNumber:[${product.partNumber}]`
		);
	}
}
