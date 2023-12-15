import { useCallback, useRef, useState } from 'react';
import styles from './AsideNavs.module.scss';
import classNames from 'classnames';
import { Expand } from '../Expand';
import { useTranslation } from 'react-i18next';
import useOuterClick from '@/hooks/ui/useOuterClick';

/**
 * RegistMenu
 */
export const RegistMenu: React.FC = () => {
	const [t] = useTranslation();
	const rootRef = useRef<HTMLLIElement>(null);
	const [expanded, setExpanded] = useState(false);

	useOuterClick(
		rootRef,
		useCallback(() => setExpanded(false), [])
	);

	return (
		<li
			className={
				expanded
					? classNames(styles.regist, styles.on)
					: classNames(styles.regist)
			}
			ref={rootRef}
		>
			<Expand
				{...{
					label: t('components.ui.layouts.headers.header.registMenu.expand'),
					expanded,
					onClick: () => setExpanded(expanded => !expanded),
				}}
			/>
		</li>
	);
};
RegistMenu.displayName = 'RegistMenu';
