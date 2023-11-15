import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTermsOfUseCad } from '@/api/services/getTermsOfUseCad';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { store } from '@/store';
import {
	selectAuthenticated,
	selectUserPermissions,
	refreshAuth,
} from '@/store/modules/auth';
import { clearAllErrorsOperation } from '@/store/modules/cadDownload';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';

export const useCadDownload = ({
	seriesCode,
	partNumber,
	cadId,
	onCancelLogin,
}: {
	seriesCode: string;
	partNumber?: string;
	cadId?: string;
	onCancelLogin: () => void;
}) => {
	const [termsOfUseTypeList, setTermsOfUseTypeList] = useState<string[]>();
	const [loadingTermsOfUse, startToLoadTermsOfUse, endLoadingTermsOfUse] =
		useBoolState(false);
	const [authLoading, startLoadingAuth, endLoadingAuth] = useBoolState(false);
	const dispatch = useDispatch();
	const showLoginModal = useLoginModal();
	const [isShowCadDataIsNotAvailable, setIsShowCadDataIsNotAvailable] =
		useState(false);

	const isShowTermsOfUseMSM =
		getCookie(Cookie.VONA2_CONFIRMED_CAD) !== '1' &&
		termsOfUseTypeList &&
		(termsOfUseTypeList.includes('1') || termsOfUseTypeList.includes('3'));

	const isShowTermsOfUseWeb2Cad =
		getCookie(Cookie.VONA2_CONFIRMED_WEB2CAD) !== '1' &&
		termsOfUseTypeList &&
		termsOfUseTypeList.includes('2');

	const [step, setStep] = useState<'termsOfUse' | 'cadDownload'>();

	const getTermsOfUse = async () => {
		try {
			startToLoadTermsOfUse();
			const response = await getTermsOfUseCad({
				seriesCode,
				partNumber,
				cadId,
			});

			if (!response.termsOfUseTypeList.length) {
				setIsShowCadDataIsNotAvailable(true);
			}

			setTermsOfUseTypeList(response.termsOfUseTypeList);
		} catch (error) {
			setIsShowCadDataIsNotAvailable(true);
		} finally {
			endLoadingTermsOfUse();
		}
	};

	const agreeTermsOfUse = (isCheckboxChecked: boolean) => {
		if (!termsOfUseTypeList) {
			return;
		}

		if (isCheckboxChecked) {
			if (isShowTermsOfUseMSM) {
				setCookie(Cookie.VONA2_CONFIRMED_CAD, '1');
			}

			if (isShowTermsOfUseWeb2Cad) {
				setCookie(Cookie.VONA2_CONFIRMED_WEB2CAD, '1');
			}
		}
		setStep('cadDownload');
	};

	const checkAuthenticate = async () => {
		try {
			startLoadingAuth();
			await refreshAuth(dispatch)();
			const authenticated = selectAuthenticated(store.getState());

			if (!authenticated) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					onCancelLogin();
					return;
				}
			}

			const { hasCadDownloadPermission } = selectUserPermissions(
				store.getState()
			);
			if (!hasCadDownloadPermission) {
				return;
			}

			getTermsOfUse();
		} catch (error) {
			// noop
		} finally {
			endLoadingAuth();
		}
	};

	useOnMounted(() => {
		clearAllErrorsOperation(dispatch)();
		checkAuthenticate();
	});

	useEffect(() => {
		setStep(
			isShowTermsOfUseMSM || isShowTermsOfUseWeb2Cad
				? 'termsOfUse'
				: 'cadDownload'
		);
	}, [isShowTermsOfUseMSM, isShowTermsOfUseWeb2Cad]);

	return {
		termsOfUseTypeList,
		loadingTermsOfUse,
		isShowTermsOfUseMSM,
		isShowTermsOfUseWeb2Cad,
		step,
		isShowCadDataIsNotAvailable,
		authLoading,
		agreeTermsOfUse,
	};
};
