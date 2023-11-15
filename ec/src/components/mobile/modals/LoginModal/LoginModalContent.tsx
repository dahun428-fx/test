import React, { useMemo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm, LoginPayload } from './LoginForm';
import styles from './LoginModalContent.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { Link } from '@/components/mobile/ui/links';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { useLogin } from '@/hooks/auth/useLogin';
import { url } from '@/utils/url';

export type LoginResult = 'LOGGED_IN';

type Props = {
	close?: (result?: LoginResult) => void;
};

/** Login modal content */
export const LoginModalContent: React.VFC<Props> = ({ close }) => {
	const [t] = useTranslation();

	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	const { isError, errorMessage, loading, login } = useLogin();
	const [closing, setClosing] = useState(false);

	const handleClickLogin = useCallback(
		async (payload: LoginPayload) => {
			const { succeeded } = await login(payload);
			if (succeeded) {
				// closing animation の時にログインフォームが表示されてしまうのを防ぐための closing state
				setClosing(true);
				close?.('LOGGED_IN');
			}
		},
		[close, login]
	);

	const handleClickClose = useCallback(() => {
		close?.(); // login cancel
	}, [close]);

	const loginFormView = useMemo(() => {
		return (
			<div>
				<div className={styles.contents}>
					<FormContainer
						title={t('mobile.components.modals.loginModal.title')}
						onClickClose={handleClickClose}
					>
						<LoginForm onClickLogin={handleClickLogin} />
					</FormContainer>
					<FormContainer
						title={t('mobile.components.modals.loginModal.forNewCustomer')}
					>
						{/* eslint-disable-next-line react/jsx-no-target-blank */}
						<a
							href={url.wos.userRegistration({ lang })}
							target="_blank"
							className={styles.registerButton}
						>
							{t('mobile.components.modals.loginModal.registerNow')}
						</a>
						<ul>
							<li className={styles.linkListItem}>
								<Link
									href={url.registrationGuide}
									target="_blank"
									className={styles.linkListLink}
								>
									{t(
										'mobile.components.modals.loginModal.registrationGuideLink'
									)}
								</Link>
							</li>
						</ul>
					</FormContainer>
				</div>
			</div>
		);
	}, [handleClickClose, handleClickLogin, t]);

	return (
		<div className={styles.container}>
			{isError ? (
				<div className={styles.errorContents}>
					<p className={styles.errorMessage}>{errorMessage}</p>
					<div className={styles.closeButtonBox}>
						<Button onClick={handleClickClose} size="max" theme="default">
							<span className={styles.closeText}>
								{t('mobile.components.modals.loginModal.close')}
							</span>
						</Button>
					</div>
				</div>
			) : loading || closing ? (
				<div>
					<h2 className={styles.formTitle}>
						<span>{t('mobile.components.modals.loginModal.title')}</span>
						<span className={styles.closeButton} onClick={handleClickClose} />
					</h2>
					<BlockLoader className={styles.loader} />
				</div>
			) : (
				loginFormView
			)}
		</div>
	);
};
LoginModalContent.displayName = 'LoginModalContent';

const FormContainer: React.VFC<{
	title: string;
	children?: React.ReactNode;
	onClickClose?: () => void;
}> = ({ title, children, onClickClose }) => {
	return (
		<div className={styles.formContainer}>
			<h2 className={styles.formTitle}>
				<span>{title}</span>
				{onClickClose && (
					<span className={styles.closeButton} onClick={onClickClose} />
				)}
			</h2>
			<div className={styles.formBody}>{children}</div>
		</div>
	);
};
