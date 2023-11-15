import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LogoutButton.module.scss';
import { ButtonBase } from '@/components/mobile/ui/buttons/ButtonBase';

type Props = {
	onClick: () => void;
};

/** Logout Button component */
export const LogoutButton: React.VFC<Props> = ({ onClick }) => {
	const [t] = useTranslation();

	return (
		<ButtonBase className={styles.logoutButton} onClick={onClick}>
			{t('mobile.components.layouts.bottomNav.userPanel.logoutButton.logout')}
		</ButtonBase>
	);
};
