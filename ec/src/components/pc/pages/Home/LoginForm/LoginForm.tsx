import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginForm.module.scss';
import { useLoginModal } from '@/components/pc/modals/LoginModal';

type Props = {
	className?: string;
};

/** Login Form */
export const LoginForm: React.VFC<Props> = ({ className }) => {
	const { t } = useTranslation();
	const showLogin = useLoginModal();

	return (
		<div className={classNames(styles.box, className)}>
			<h2 className={styles.header}>{t('pages.home.loginForm.title')}</h2>
			<div className={styles.buttonBox}>
				<button className={styles.button} onClick={showLogin}>
					{t('pages.home.loginForm.button')}
				</button>
			</div>
		</div>
	);
};
LoginForm.displayName = 'LoginForm';
