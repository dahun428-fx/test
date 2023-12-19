import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import styles from './OrderMenu.module.scss';
import styles from './AsideNavs.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import { CustomerServicePanel } from '@/components/pc/ui/panels/CustomerServicePanel';
import useOuterClick from '@/hooks/ui/useOuterClick';
import classNames from 'classnames';

/**
 * Need Help?
 */
export const NeedHelp: React.VFC = () => {
	const [t] = useTranslation();
	const rootRef = useRef<HTMLLIElement>(null);
	// const [expanded, setExpanded] = useState(false);

	// useOuterClick(
	// 	rootRef,
	// 	useCallback(() => setExpanded(false), [])
	// );

	const handleOnClick = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		event.preventDefault();
	};

	return (
		<li
			// className={
			// 	expanded ? classNames(styles.help, styles.on) : classNames(styles.help)
			// }
			ref={rootRef}
		>
			<a onClick={event => handleOnClick(event)}>
				{t('components.ui.layouts.headers.header.needHelp.expand')}
			</a>
			{/* <Expand
				{...{
					label: t('components.ui.layouts.headers.header.needHelp.expand'),
					expanded,
					onClick: () => setExpanded(expanded => !expanded),
				}}
			/> */}
		</li>
	);
};
NeedHelp.displayName = 'NeedHelp';
