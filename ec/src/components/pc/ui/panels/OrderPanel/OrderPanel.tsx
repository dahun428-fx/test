import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrderPanel.module.scss';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { url } from '@/utils/url';
import Link from 'next/link';

type Props = {
	size: 'wide' | 'narrow';
	/** ログイン済みか */
	authenticated: boolean;
	/** ログイン済みかつEC会員か */
	isEcUser: boolean;
	/** ログイン済みかつ購買連携ユーザか */
	isPurchaseLinkUser?: boolean;
	/** 注文権限 (未ログインの場合は false 想定) */
	hasOrderPermission: boolean; //
	/** 見積権限 (未ログインの場合は false 想定) */
	hasQuotePermission: boolean; //hasQuotePermission: permissionList.includes('3'),
	/** 注文履歴権限 (未ログインの場合は false 想定) */
	hasOrderHistoryPermission: boolean;
	/** 注文履歴権限 (未ログインの場合は false 想定) */
	hasQuoteHistoryPermission: boolean;
};

const lang = 'KOR';

/**
 * Order / Quote
 */
export const OrderPanel: React.VFC<Props> = ({
	size = 'narrow',
	authenticated,
	isEcUser,
	isPurchaseLinkUser,
	hasOrderPermission,
	hasQuotePermission,
	hasOrderHistoryPermission,
	hasQuoteHistoryPermission,
}) => {
	const [t] = useTranslation();

	const isPurchaseDiv = () => {
		const canEstimate = !isEcUser && hasQuotePermission;

		return (
			<>
				{canEstimate || !authenticated ? (
					<p>
						<Link href={url.wos.quote.quote({ lang })}>
							<a className={styles.btnHeaderOrder}>견적</a>
						</Link>
					</p>
				) : (
					<p>
						<span
							className={classNames(styles.btnHeaderOrder, styles.isDisabled)}
						>
							견적
						</span>
					</p>
				)}
			</>
		);
	};

	return (
		<div
			className={classNames(
				styles.headerBalloonBoxLeft,
				styles.balloonBoxOrder
			)}
		>
			<div className={styles.headerBalloonBoxTtl}>
				{isPurchaseLinkUser ? '[WOS]형번견적' : '견적/주문'}
			</div>
			<div>
				{isPurchaseLinkUser ? (
					isPurchaseDiv()
				) : (
					<ul className={styles.headerOrderFunction}></ul>
				)}
			</div>
		</div>
	);
};
OrderPanel.displayName = 'OrderPanel';
