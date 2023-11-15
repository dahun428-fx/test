import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { PriceCheckResult as Presenter } from './PriceCheckResult';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/mobile/modals/PaymentMethodRequiredModal';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { store } from '@/store';
import { useSelector } from '@/store/hooks';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import {
	selectChecking,
	selectPrice,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';
import { moveToQuote } from '@/utils/domain/order';

type Props = {
	className?: string;
};

export const PriceCheckResult: React.VFC<Props> = ({ className }) => {
	const series = useSelector(selectSeries);
	const price = useSelector(selectPrice);
	const checking = useSelector(selectChecking);

	// auth, user
	const authenticated = useSelector(selectAuthenticated);
	const isEcUser = useSelector(selectIsEcUser);
	const { hasQuotePermission } = useSelector(selectUserPermissions);

	// modals
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

	// utils
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const quote = useCallback(async () => {
		assertNotNull(price);

		// refresh user info
		await refreshAuth(dispatch)();

		if (!selectAuthenticated(store.getState())) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		if (selectIsEcUser(store.getState())) {
			showPaymentMethodRequiredModal().then();
			return;
		}

		if (!selectUserPermissions(store.getState()).hasQuotePermission) {
			showMessage(
				t('mobile.pages.productDetail.actionsPanel.noQuotePermission')
			).then();
			return;
		}

		aa.events.sendQuote();
		ga.events.quote();

		moveToQuote({ ...price, ...series });
	}, [
		dispatch,
		price,
		series,
		showLoginModal,
		showMessage,
		showPaymentMethodRequiredModal,
		t,
	]);

	if (!checking && price == null) {
		return null;
	}

	return (
		<Presenter
			className={className}
			checking={checking}
			price={price}
			// 見積権限がない場合は見積不可。EC会員の場合は、見積可。
			disableQuote={authenticated && !isEcUser && !hasQuotePermission}
			quote={quote}
		/>
	);
};
PriceCheckResult.displayName = 'PriceCheckResult';
