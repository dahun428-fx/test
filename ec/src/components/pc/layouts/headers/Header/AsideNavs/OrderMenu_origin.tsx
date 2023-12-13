import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './OrderMenu.hooks';
import styles from './OrderMenu.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import { OrderPanel } from '@/components/pc/ui/panels/OrderPanel';
import useOuterClick from '@/hooks/ui/useOuterClick';

/**
 * Quote/Order menu
 */
export const OrderMenu: React.VFC = () => {
	const [t] = useTranslation();
	const rootRef = useRef<HTMLDivElement>(null);
	const [expanded, setExpanded] = useState(false);
	const { permissions, isEcUser } = useAuth();

	useOuterClick(rootRef, () => setExpanded(false));

	return (
		<div className={styles.wrapper} ref={rootRef}>
			<Expand
				{...{
					label: t('components.ui.layouts.headers.header.orderMenu.expand'),
					expanded,
					onClick: () => setExpanded(!expanded),
				}}
			/>
			<div className={styles.menu}>
				{expanded && (
					<OrderPanel size="narrow" {...{ isEcUser, ...permissions }} />
				)}
			</div>
		</div>
	);
};
