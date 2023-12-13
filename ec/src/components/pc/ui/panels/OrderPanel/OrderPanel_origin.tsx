import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrderPanel.module.scss';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { url } from '@/utils/url';

type Props = {
	size: 'wide' | 'narrow';
	/** ログイン済みか */
	authenticated: boolean;
	/** ログイン済みかつEC会員か */
	isEcUser: boolean;
	/** ログイン済みかつ購買連携ユーザか */
	isPurchaseLinkUser?: boolean;
	/** 注文権限 (未ログインの場合は false 想定) */
	hasOrderPermission: boolean;
	/** 見積権限 (未ログインの場合は false 想定) */
	hasQuotePermission: boolean;
	/** 注文履歴権限 (未ログインの場合は false 想定) */
	hasOrderHistoryPermission: boolean;
	/** 注文履歴権限 (未ログインの場合は false 想定) */
	hasQuoteHistoryPermission: boolean;
};

const lang = 'en';

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

	return (
		<div className={styles.orderQuoteBox} data-panel-size={size}>
			<div className={styles.title}>
				{isPurchaseLinkUser
					? t('components.ui.panels.orderPanel.orderNow')
					: t('components.ui.panels.orderPanel.title')}
			</div>
			<ul className={styles.orderLinks}>
				{!isPurchaseLinkUser ? (
					<>
						<li className={styles.orderLink}>
							<NagiLinkButton
								className={styles.button}
								href={url.wos.quote.quote({ lang })}
								disabled={authenticated && !hasQuotePermission}
							>
								{t('common.quote.quote')}
							</NagiLinkButton>
						</li>
						<li className={styles.orderLink}>
							<NagiLinkButton
								className={styles.button}
								href={url.wos.order.order({ lang })}
								disabled={authenticated && !hasOrderPermission}
							>
								{t('common.order.order')}
							</NagiLinkButton>
						</li>
					</>
				) : (
					<li className={styles.orderLink}>
						<NagiLinkButton
							className={styles.button}
							href={url.wos.quote.quote({ lang })}
							disabled={authenticated && !hasQuotePermission}
						>
							{t('components.ui.panels.orderPanel.orderNow')}
						</NagiLinkButton>
					</li>
				)}
			</ul>
			{!isEcUser && (
				<ul className={styles.orderLinks}>
					<li className={styles.orderLink}>
						<NagiLinkButton
							className={styles.button}
							href={url.wos.quote.history({ lang })}
							theme="tertiary"
							disabled={authenticated && !hasQuoteHistoryPermission}
						>
							{t('common.quote.history')}
						</NagiLinkButton>
					</li>
					<li className={styles.orderLink}>
						<NagiLinkButton
							className={styles.button}
							href={url.wos.order.history({ lang })}
							theme="tertiary"
							disabled={authenticated && !hasOrderHistoryPermission}
						>
							{t('common.order.history')}
						</NagiLinkButton>
					</li>
				</ul>
			)}
			{/* EC 会員の場合は表示しない */}
			{!isEcUser && (
				<div>
					<ul className={styles.serviceList}>
						<li className={styles.linkList}>
							<div className={styles.linkListTitle}>
								{t('components.ui.panels.orderPanel.copyAndPaste')}
							</div>
							<div className={styles.lineLinkList}>
								<NagiLink
									href={url.wos.quote.withCopyAndPaste({ lang })}
									disabled={authenticated && !hasQuotePermission}
									theme="secondary"
									className={styles.fontBold}
								>
									{t('common.quote.quote')}
								</NagiLink>
								{!isPurchaseLinkUser && (
									<NagiLink
										href={url.wos.order.withCopyAndPaste({ lang })}
										disabled={authenticated && !hasOrderPermission}
										theme="secondary"
										className={classNames(styles.marginLeft, styles.fontBold)}
									>
										{t('common.order.order')}
									</NagiLink>
								)}
							</div>
						</li>
						<li className={styles.linkList}>
							<div className={styles.linkListTitle}>
								{t('components.ui.panels.orderPanel.uploadFile')}
							</div>
							<div className={styles.lineLinkList}>
								<NagiLink
									href={url.wos.quote.withUploadingFile({ lang })}
									disabled={authenticated && !hasQuotePermission}
									theme="secondary"
									className={styles.fontBold}
								>
									{t('common.quote.quote')}
								</NagiLink>
								{!isPurchaseLinkUser && (
									<NagiLink
										href={url.wos.order.withUploadingFile({ lang })}
										disabled={authenticated && !hasOrderPermission}
										theme="secondary"
										className={classNames(styles.marginLeft, styles.fontBold)}
									>
										{t('common.order.order')}
									</NagiLink>
								)}
							</div>
						</li>
						<li className={styles.linkList}>
							<NagiLink
								href={url.wos.shipment.history({ lang })}
								theme="secondary"
								className={styles.fontBold}
							>
								{t('components.ui.panels.orderPanel.shipmentHistory')}
							</NagiLink>
						</li>
					</ul>
				</div>
			)}
			{/* EC 会員の場合にのみ表示 */}
			{isEcUser && (
				<>
					<div className={styles.upgradeAccount}>
						{t('components.ui.panels.orderPanel.messageForEcUser')}
					</div>
					<div className={styles.upgradeAccountButton}>
						<NagiLinkButton
							href={url.wos.upgradeAccount({ lang })}
							theme="primary"
							size="max"
						>
							{t('components.ui.panels.orderPanel.upgradeAccount')}
						</NagiLinkButton>
					</div>
				</>
			)}
			{/*
				ログイン済みの場合にのみ表示 (会員種別は問わない)
				- これは 2022/2/4 現在の現行画面設計書には存在しない項目で、インドネシアの独自仕様と考えられる。
			 */}
			{authenticated && (
				<ul className={styles.returnRequest}>
					<li className={styles.linkList}>
						<NagiLink
							href={url.wos.returnRequest({ lang })}
							theme="secondary"
							className={styles.fontBold}
						>
							{t('components.ui.panels.orderPanel.returnRequestList')}
						</NagiLink>
					</li>
				</ul>
			)}
			{/*
				EC 会員の場合は表示しない
				- これは 2022/2/4 現在の現行画面設計書とは乖離しており、インドネシアの独自仕様と考えられる。
			*/}
			{!isEcUser && (
				<div className={styles.otherServiceList}>
					<ul>
						<li className={styles.linkList}>
							<NagiLink
								href={url.wos.partNumberChecker}
								newTab={true}
								theme="secondary"
								className={styles.fontBold}
							>
								{t('components.ui.panels.orderPanel.partNumberChecker')}
							</NagiLink>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};
OrderPanel.displayName = 'OrderPanel';
