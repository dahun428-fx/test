import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrderMenu.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import { CustomerServicePanel } from '@/components/pc/ui/panels/CustomerServicePanel';
import useOuterClick from '@/hooks/ui/useOuterClick';

/**
 * Need Help?
 */
export const NeedHelp: React.VFC = () => {
	const [t] = useTranslation();
	const rootRef = useRef<HTMLDivElement>(null);
	const [expanded, setExpanded] = useState(false);

	useOuterClick(
		rootRef,
		useCallback(() => setExpanded(false), [])
	);

	return (
		<div className={styles.wrapper} ref={rootRef}>
			<Expand
				{...{
					label: t('components.ui.layouts.headers.header.needHelp.expand'),
					expanded,
					onClick: () => setExpanded(expanded => !expanded),
				}}
			/>
			<div className={styles.menu}>{expanded && <CustomerServicePanel />}</div>
		</div>
	);
};
NeedHelp.displayName = 'NeedHelp';
