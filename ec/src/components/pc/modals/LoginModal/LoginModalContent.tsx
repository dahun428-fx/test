import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm, LoginPayload } from './LoginForm';
import styles from './LoginModalContent.module.scss';
import { LinkButton } from '@/components/pc/ui/buttons';
import { Link } from '@/components/pc/ui/links';
import { BlockLoader } from '@/components/pc/ui/loaders/BlockLoader';
import { useLogin } from '@/hooks/auth/useLogin';
import { url } from '@/utils/url';

export type LoginResult = 'LOGGED_IN';

type Props = {
	close?: (result?: LoginResult) => void;
};

export const LoginModalContent: React.VFC<Props> = ({ close }) => {
	const [t] = useTranslation();

	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	const { isError, errorMessage, loading, login } = useLogin();
	const [closing, setClosing] = useState(false);
	const handleClickLogin = async (payload: LoginPayload) => {
		const { succeeded } = await login(payload);
		if (succeeded) {
			// closing animation の時にログインフォームが表示されてしまうのを防ぐための closing state
			setClosing(true);
			close?.('LOGGED_IN');
		}
	};

	return (
		<div className={styles.container}>
			{isError ? (
				<div className={styles.errorContents}>{errorMessage}</div>
			) : loading || closing ? (
				<BlockLoader className={styles.loader} />
			) : (
				<div>
					<div className={styles.contents}>
						<FormContainer title="Existing User">
							<LoginForm onClickLogin={handleClickLogin} />
						</FormContainer>
						<FormContainer title="New User">
							<div className={styles.registerButtonWrapper}>
								<LinkButton
									href={url.wos.userRegistration({ lang })}
									theme="conversion"
									target="_blank"
									size="m"
									className={styles.registerButton}
								>
									{t('components.modals.loginModal.newUser')}
								</LinkButton>
							</div>
							<div>{t('components.modals.loginModal.registerMessage')}</div>
							<div className={styles.guideLink}>
								<Link href={url.registrationGuide} target="_blank">
									{t('components.modals.loginModal.registrationGuideLink')}
								</Link>
							</div>
						</FormContainer>
					</div>
				</div>
			)}
		</div>
	);
};
LoginModalContent.displayName = 'LoginModalContent';

const FormContainer: React.VFC<{
	title: string;
	children?: React.ReactNode;
}> = ({ title, children }) => {
	return (
		<div className={styles.formContainer}>
			<h2 className={styles.formTitle}>{title}</h2>
			<div className={styles.formBody}>{children}</div>
		</div>
	);
};
