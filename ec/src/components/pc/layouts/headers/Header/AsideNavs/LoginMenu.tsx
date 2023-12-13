import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './LoginForm';
import styles from './AsideNavs.module.scss';
// import styles from './LoginMenu.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import useOuterClick from '@/hooks/ui/useOuterClick';
import classNames from 'classnames';

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
		<li
			className={
				showsMenu
					? classNames(styles.login, styles.on)
					: classNames(styles.login)
			}
			ref={ref}
		>
			<Expand
				expanded={showsMenu}
				label={t('components.ui.layouts.headers.header.loginMenu.expand')}
				onClick={handleClickButton}
			/>
			{showsMenu && (
				<div>
					<LoginForm />
				</div>
			)}
		</li>
	);
};
LoginMenu.displayName = 'LoginMenu';
