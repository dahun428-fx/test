import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { login as loginOperation } from '@/store/modules/auth';

type LoginPayload = { loginId: string; password: string };
type LoginResult = { succeeded: boolean };

export const useLogin = () => {
	const [t] = useTranslation();

	const [isError, setIsError] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const dispatch = useDispatch();

	const login = async (payload: LoginPayload): Promise<LoginResult> => {
		const { loginId, password } = payload;
		setLoading(true);
		setErrorMessage(null);

		let succeeded = true;
		try {
			await loginOperation(dispatch)({ loginId, password });
		} catch (error) {
			setIsError(true);
			succeeded = false;
			if (error instanceof MsmApiError) {
				// API000100:「必須バリデーションエラー」/ RequiredValidationError
				// API001100:「認証エラー」/ AuthenticationError
				if (error.has('API000100', 'API001100')) {
					setErrorMessage(t('hooks.auth.useLogin.mistypedErrorMessage'));
				} else {
					setErrorMessage(t('hooks.auth.useLogin.systemErrorMessage'));
				}
			} else {
				throw error;
			}
		} finally {
			setLoading(false);
		}
		return { succeeded };
	};

	return {
		isError,
		errorMessage,
		loading,
		login,
	};
};
