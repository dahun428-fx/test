import React, { ChangeEvent, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../AsideNavs/AsideNavs.module.scss';
import { config } from '@/config';
import { useLogin } from '@/hooks/auth/useLogin';
import { url } from '@/utils/url';
import classNames from 'classnames';
import Link from 'next/link';

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

	const loadingDiv = () => {
		return (
			<div className={styles.headerLoading}>
				<p>Loading...</p>
			</div>
		);
	};

	const errorDiv = () => {
		console.log('isError', isError);
		return (
			<p className={styles.error}>
				{t('components.ui.layouts.headers.header.loginForm.errorMessage')}
			</p>
		);
	};

	const formDiv = () => {
		return (
			<div className={styles.headerLogin}>
				<dl className={styles.id}>
					<dt>{t('components.ui.layouts.headers.header.loginForm.userId')}</dt>
					<dd>
						<input
							type="text"
							name="userid"
							value={loginId}
							onChange={handleChangeLoginId}
							maxLength={config.form.length.max.loginId} //128
						/>
					</dd>
				</dl>
				<dl className={styles.pass}>
					<dt>
						{t('components.ui.layouts.headers.header.loginForm.password')}
					</dt>
					<dd>
						<input
							type="password"
							name="password"
							value={password}
							onChange={handleChangePassword}
							maxLength={config.form.length.max.password} //128
						/>
					</dd>
				</dl>
				<p className={styles.btnLogin}>
					<input
						type="submit"
						value={t('components.ui.layouts.headers.header.loginForm.login')}
					/>
				</p>

				<ul className={styles.linkList}>
					<li>
						<Link href={url.wos.forgotLoginId}>
							<a target="_blank">
								{t('components.ui.layouts.headers.header.loginForm.forgotId')}
							</a>
						</Link>
					</li>
					<li>
						<Link href={url.wos.forgotPassword}>
							<a target="_blank">
								{t(
									'components.ui.layouts.headers.header.loginForm.forgotPassword'
								)}
							</a>
						</Link>
					</li>
				</ul>
			</div>
		);
	};

	return (
		<div
			className={classNames(
				styles.headerBalloonBoxLeft,
				styles.balloonBoxLogin
			)}
		>
			<form onSubmit={handleLogin}>
				{loading ? loadingDiv() : isError ? errorDiv() : formDiv()}
			</form>
		</div>
	);
};
LoginForm.displayName = 'LoginForm';
