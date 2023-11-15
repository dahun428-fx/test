import React, { ChangeEvent, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginForm.module.scss';
import { NagiButton } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { BlockLoader } from '@/components/pc/ui/loaders/BlockLoader';
import { config } from '@/config';
import { useLogin } from '@/hooks/auth/useLogin';
import { url } from '@/utils/url';

/**
 * Login form
 */
export const LoginForm: VFC = () => {
	const [t] = useTranslation();
	const { isError, loading, login } = useLogin();
	const [loginId, setLoginId] = useState('');
	const [password, setPassword] = useState('');

	/** Handle change login ID */
	const handleChangeLoginId = (e: ChangeEvent<HTMLInputElement>) => {
		setLoginId(e.target.value);
	};

	/** Handle change password */
	const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	/** Handle login */
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await login({ loginId, password });
	};

	return (
		<div>
			{isError ? (
				<p className={styles.loginErrorMessage}>
					{t('components.ui.layouts.headers.header.loginForm.errorMessage')}
				</p>
			) : loading ? (
				<BlockLoader className={styles.loader} />
			) : (
				<form onSubmit={handleLogin}>
					<dl className={styles.formItem}>
						<dt className={styles.formItemTitle}>
							{t('components.ui.layouts.headers.header.loginForm.userId')}
						</dt>
						<dd>
							<input
								name="loginId"
								type="text"
								value={loginId}
								onChange={handleChangeLoginId}
								maxLength={config.form.length.max.loginId}
								className={styles.input}
							/>
						</dd>
					</dl>
					<dl className={styles.formItem}>
						<dt className={styles.formItemTitle}>
							{t('components.ui.layouts.headers.header.loginForm.password')}
						</dt>
						<dd>
							<input
								name="password"
								type="password"
								value={password}
								onChange={handleChangePassword}
								maxLength={config.form.length.max.password}
								className={styles.passwordInput}
							/>
						</dd>
					</dl>
					<div className={styles.buttonBox}>
						<NagiButton type="submit" className={styles.button}>
							{t('components.ui.layouts.headers.header.loginForm.login')}
						</NagiButton>
					</div>
					<ul>
						<li className={styles.linkListItem}>
							<NagiLink
								href={url.wos.forgotLoginId}
								target="_blank"
								className={styles.linkListLink}
							>
								{t('components.ui.layouts.headers.header.loginForm.forgotId')}
							</NagiLink>
						</li>
						<li className={styles.linkListItem}>
							<NagiLink
								href={url.wos.forgotPassword}
								target="_blank"
								className={styles.linkListLink}
							>
								{t(
									'components.ui.layouts.headers.header.loginForm.forgotPassword'
								)}
							</NagiLink>
						</li>
					</ul>
				</form>
			)}
		</div>
	);
};
LoginForm.displayName = 'LoginForm';
