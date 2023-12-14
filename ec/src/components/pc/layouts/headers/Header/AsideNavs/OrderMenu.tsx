import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './OrderMenu.hooks';
// import styles from './OrderMenu.module.scss';
import styles from './AsideNavs.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import { OrderPanel } from '@/components/pc/ui/panels/OrderPanel';
import useOuterClick from '@/hooks/ui/useOuterClick';
import classNames from 'classnames';

/**
 * Quote/Order menu
 */
export const OrderMenu: React.VFC = () => {
	const [t] = useTranslation();
	const rootRef = useRef<HTMLLIElement>(null);
	const [expanded, setExpanded] = useState(false);
	const { permissions, isEcUser, selectedUserInfo, selectedOrderInfo } =
		useAuth();

	useOuterClick(rootRef, () => setExpanded(false));

	return (
		<li
			className={
				expanded
					? classNames(styles.order, styles.on)
					: classNames(styles.order)
			}
			ref={rootRef}
		>
			<Expand
				{...{
					label: t('components.ui.layouts.headers.header.orderMenu.expand'),
					expanded,
					onClick: () => setExpanded(!expanded),
				}}
			/>
			{expanded && (
				<div
					className={classNames(
						styles.headerBalloonBoxLeft,
						styles.balloonBoxOrder
					)}
				>
					<div>
						<OrderPanel
							size="narrow"
							{...{
								isEcUser,
								...permissions,
								selectedUserInfo,
								selectedOrderInfo,
							}}
						/>
					</div>
				</div>
			)}
			{/* <div className={styles.menu}>
				{expanded && (
					<OrderPanel size="narrow" {...{ isEcUser, ...permissions }} />
				)}
			</div> */}
		</li>
	);
};
