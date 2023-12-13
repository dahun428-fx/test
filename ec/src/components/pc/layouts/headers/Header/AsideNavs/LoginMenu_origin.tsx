import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './LoginForm';
import styles from './LoginMenu.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import useOuterClick from '@/hooks/ui/useOuterClick';

/**
 * Login menu
 */
export const LoginMenu: React.VFC = () => {
	const { t } = useTranslation();
	const [showsMenu, setShowsMenu] = useState(false);
	const ref = useRef(null);

	const handleClickButton = () => {
		setShowsMenu(!showsMenu);
	};

	useOuterClick(
		ref,
		useCallback(() => {
			setShowsMenu(false);
		}, [])
	);

	return (
		<div className={styles.box} ref={ref}>
			<Expand
				expanded={showsMenu}
				label={t('components.ui.layouts.headers.header.loginMenu.expand')}
				onClick={handleClickButton}
			/>
			{showsMenu && (
				<div className={styles.menu}>
					<LoginForm />
				</div>
			)}
		</div>
	);
};
LoginMenu.displayName = 'LoginMenu';
