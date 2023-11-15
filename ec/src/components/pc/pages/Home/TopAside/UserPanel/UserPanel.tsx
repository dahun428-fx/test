import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserPanel.module.scss';
import { Flag } from '@/models/api/Flag';
import { SettlementType } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { url } from '@/utils/url';

type UnfitCount = {
	quote: number;
	order: number;
};

type Props = {
	className?: string;
	unfitCount: UnfitCount;
	/** 通常メッセージ配信有フラグ */
	informationMessageFlag?: Flag;
	/** クーポンメッセージ配信有フラグ */
	couponMessageFlag?: Flag;
	/** 未確認クーポン件数 */
	unconfirmedCouponCount?: number;
	/** EC会員か */
	isEcUser: boolean;
	/** 購買連携ユーザーか */
	isPurchaseLinkUser: boolean;
	/** 代理ログインであるか */
	isProxyLogin: boolean;
	/** 決済形態 */
	settlementType: SettlementType;
	/** 注文権限 */
	hasOrderPermission: boolean;
	/** 子ユーザー管理権限 */
	hasUserManagementPermission: boolean;
	/** 配送先管理権限 */
	hasShipToManagementPermission: boolean;
	/** CADダウンロード権限 */
	hasCadDownloadPermission: boolean;
	/** My部品表権限 */
	hasMyComponentsPermission: boolean;
	/** 請求書参照権限 */
	hasInvoiceReferencePermission: boolean;
	/** 取引明細参照権限 */
	hasTransactionDetailReferencePermission: boolean;
};

const lang = 'en';

/**
 * User panel (Order / Quote)
 */
export const UserPanel: React.VFC<Props> = ({
	className,
	unfitCount,
	informationMessageFlag,
	couponMessageFlag,
	unconfirmedCouponCount,
	isPurchaseLinkUser,
	isEcUser,
	isProxyLogin,
	settlementType,
	hasOrderPermission,
	hasShipToManagementPermission,
	hasUserManagementPermission,
	hasCadDownloadPermission,
	hasMyComponentsPermission,
	hasInvoiceReferencePermission,
	hasTransactionDetailReferencePermission,
}) => {
	const { t } = useTranslation();

	return (
		<div className={classNames(styles.userBox, className)}>
			{!isEcUser && !isPurchaseLinkUser && (
				<ul className={styles.pendingAction}>
					<LinkItem
						href={url.wos.settings.profile({ lang })}
						label={t('pages.home.userPanel.quote', { unfitCount })}
						disabled={unfitCount.quote === 0}
					/>
					<LinkItem
						href={url.wos.settings.changePassword({ lang })}
						label={t('pages.home.userPanel.order', { unfitCount })}
						disabled={unfitCount.order === 0}
					/>
				</ul>
			)}
			<ul className={styles.list}>
				<LinkItem
					href={url.myPage.top}
					label={t('pages.home.userPanel.myPage')}
				/>
				{Flag.isTrue(informationMessageFlag) && (
					<LinkItem
						href={url.myPage.messageList}
						label={t('pages.home.userPanel.messageList')}
					/>
				)}
				{Flag.isTrue(couponMessageFlag) && !isPurchaseLinkUser && (
					<LinkItem
						href={url.myPage.couponList}
						label={
							unconfirmedCouponCount
								? t('pages.home.userPanel.couponWithCount', {
										unconfirmedCouponCount,
								  })
								: t('pages.home.userPanel.coupon')
						}
					/>
				)}
			</ul>
			<ul className={styles.list}>
				{hasCadDownloadPermission && (
					<LinkItem
						href={url.myPage.cadDownloadHistory}
						label={t('pages.home.userPanel.cadDownloadHistory')}
					/>
				)}
				{hasMyComponentsPermission && (
					<LinkItem
						href={url.myPage.myComponents}
						label={t('pages.home.userPanel.myComponents')}
					/>
				)}
				{hasInvoiceReferencePermission && !isPurchaseLinkUser && (
					<LinkItem
						href={url.wos.invoiceList({ lang })}
						label={t('pages.home.userPanel.invoiceList')}
					/>
				)}
				{hasTransactionDetailReferencePermission && (
					<LinkItem
						href={url.wos.customerStatementDownload({ lang })}
						label={t('pages.home.userPanel.statementDownload')}
					/>
				)}
			</ul>
			{!isPurchaseLinkUser && (
				<ul className={styles.list}>
					<LinkItem
						href={url.wos.settings.profile({ lang })}
						label={t('pages.home.userPanel.profile')}
					/>
					<LinkItem
						href={url.wos.settings.changePassword({ lang })}
						label={t('pages.home.userPanel.changePassword')}
					/>
					{!isEcUser && (
						<>
							<LinkItem
								href={url.wos.settings.myOrganization({ lang })}
								label={t('pages.home.userPanel.myOrganization')}
							/>
							{/* お届け先関連 <代引きユーザーでない かつ 注文権限あり> */}
							{settlementType !== SettlementType.CASH_ON_DELIVERY &&
								hasOrderPermission && (
									<>
										{hasShipToManagementPermission ? (
											<LinkItem
												href={url.wos.settings.shipToManagement({ lang })}
												label={t('pages.home.userPanel.shipToManagement')}
											/>
										) : (
											!isProxyLogin && (
												<LinkItem
													href={url.wos.settings.newShipToAddress({ lang })}
													label={t('pages.home.userPanel.newShipToAddress')}
												/>
											)
										)}
									</>
								)}
							<LinkItem
								href={url.wos.settings.changeSettings({ lang })}
								label={t('pages.home.userPanel.changeSettings')}
							/>
							<LinkItem
								href={url.wos.settings.partNumberNicknameManagement({ lang })}
								label={t('pages.home.userPanel.partNumberNicknameManagement')}
							/>
							{hasUserManagementPermission &&
								!isProxyLogin &&
								settlementType !== SettlementType.CASH_ON_DELIVERY &&
								settlementType !== SettlementType.CREDIT_CARD && (
									<LinkItem
										href={url.wos.settings.userManagement({ lang })}
										label={t('pages.home.userPanel.userManagement')}
									/>
								)}
						</>
					)}
				</ul>
			)}
		</div>
	);
};
UserPanel.displayName = 'UserPanel';

const LinkItem: React.VFC<{
	href: string;
	label: string;
	disabled?: boolean;
}> = ({ href, label, disabled = false }) => {
	return (
		<li className={styles.item}>
			{disabled ? (
				<span className={styles.disabledLink}>{label}</span>
			) : (
				<a className={styles.link} href={href}>
					{label}
				</a>
			)}
		</li>
	);
};
LinkItem.displayName = 'LinkItem';
