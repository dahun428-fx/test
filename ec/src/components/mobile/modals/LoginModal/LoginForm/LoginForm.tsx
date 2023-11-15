import React, { ChangeEvent, FormEvent, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginForm.module.scss';
import { Link } from '@/components/mobile/ui/links';
import { config } from '@/config';
import { url } from '@/utils/url';

export type LoginPayload = {
	loginId: string;
	password: string;
};

type Props = {
	onClickLogin: (payload: LoginPayload) => Promise<void>;
};

/**
 * Login form
 */
export const LoginForm: VFC<Props> = ({ onClickLogin }) => {
	const [t] = useTranslation();
	const [loginId, setLoginId] = useState('');
	const [password, setPassword] = useState('');

	const handleChangeLoginId = (event: ChangeEvent<HTMLInputElement>) => {
		setLoginId(event.target.value);
	};

	const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await onClickLogin({ loginId, password });
	};

	return (
		<form onSubmit={handleLogin}>
			<div className={styles.formItem}>
				<input
					name="loginId"
					type="text"
					value={loginId}
					placeholder={t('mobile.components.modals.loginModal.userIdOrEmail')}
					onChange={handleChangeLoginId}
					maxLength={config.form.length.max.loginId}
					className={styles.input}
				/>
			</div>
			<div className={styles.formItem}>
				<input
					name="password"
					type="password"
					value={password}
					placeholder={t('mobile.components.modals.loginModal.password')}
					onChange={handleChangePassword}
					maxLength={config.form.length.max.password}
					className={styles.passwordInput}
				/>
			</div>
			<div className={styles.buttonBox}>
				<button type="submit" className={styles.button}>
					<span className={styles.loginText}>
						{t('mobile.components.modals.loginModal.loginButton')}
					</span>
				</button>
			</div>
			<ul>
				<li className={styles.linkListItem}>
					<Link
						href={url.wos.forgotLoginId}
						target="_blank"
						className={styles.linkListLink}
					>
						{t('mobile.components.modals.loginModal.forgotLoginId')}
					</Link>
				</li>
				<li className={styles.linkListItem}>
					<Link
						href={url.wos.forgotPassword}
						target="_blank"
						className={styles.linkListLink}
					>
						{t('mobile.components.modals.loginModal.forgotPassword')}
					</Link>
				</li>
			</ul>
		</form>
	);
};
LoginForm.displayName = 'LoginForm';
