import React, { ChangeEvent, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginForm.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Link } from '@/components/pc/ui/links';
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

	const handleChangeLoginId = (e: ChangeEvent<HTMLInputElement>) => {
		setLoginId(e.target.value);
	};

	const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await onClickLogin({ loginId, password });
	};

	return (
		<div>
			<form onSubmit={handleLogin}>
				<dl className={styles.formItem}>
					<dt className={styles.formItemTitle}>
						{t('components.modals.loginModal.loginId')}
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
						{t('components.modals.loginModal.password')}
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
					<Button
						type="submit"
						theme="strong"
						size="m"
						className={styles.button}
					>
						{t('components.modals.loginModal.loginButton')}
					</Button>
				</div>
				<ul>
					<li className={styles.linkListItem}>
						<Link
							href={url.wos.forgotLoginId}
							target="_blank"
							className={styles.linkListLink}
						>
							{t('components.modals.loginModal.forgotLoginId')}
						</Link>
					</li>
					<li className={styles.linkListItem}>
						<Link
							href={url.wos.forgotPassword}
							target="_blank"
							className={styles.linkListLink}
						>
							{t('components.modals.loginModal.forgotPassword')}
						</Link>
					</li>
				</ul>
			</form>
		</div>
	);
};
LoginForm.displayName = 'LoginForm';
