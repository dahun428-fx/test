import classNames from 'classnames';
import Router from 'next/router';
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth, useLogout, useOrderInfo } from './UserPanel.hooks';
import styles from './UserPanel.module.scss';
import { LinkListItem } from '@/components/mobile/ui/links';
import { LogoutButton } from '@/components/mobile/ui/navigations/BottomNav/UserPanel/LogoutButton';
import { url } from '@/utils/url';

/** User Panel component */
export const UserPanel: React.VFC = () => {
	const [t] = useTranslation();
	const {
		user,
		isEcUser,
		isCashOnDeliveryUser,
		isCreditCardUser,
		hasCoupon,
		unconfirmedCouponCount,
		hasCadDownloadPermission,
		hasMyComponentsPermission,
		hasOrderPermission,
	} = useAuth();

	const logout = useLogout();
	const orderInfo = useOrderInfo();

	// TODO: Discuss with HAYABUSA team about lang config.
	const lang = 'en';
	const quoteCount = orderInfo?.unfitCount.quote || 0;
	const orderCount = orderInfo?.unfitCount.order || 0;

	const cartCount = user?.cartCount;

	const adminEnabled =
		orderInfo?.hasShipToAdministPermission &&
		!isCashOnDeliveryUser &&
		!isEcUser &&
		hasOrderPermission;

	const configUnabled =
		isCashOnDeliveryUser ||
		orderInfo?.isProxyLogin ||
		isEcUser ||
		!hasOrderPermission;

	const userManagementUnabled =
		isCreditCardUser ||
		isCashOnDeliveryUser ||
		orderInfo?.isProxyLogin ||
		!orderInfo?.hasUserManagementPermission;

	const handleClickLogout = async () => {
		await logout();
		// NOTE: Keeping AA or GA get the right authentication state.
		Router.reload();
	};

	return (
		<div className={styles.userPanelWrapper}>
			<h2 className={styles.heading}>{user?.userName}</h2>
			{!isEcUser && (
				<ul>
					<p className={styles.customerCode}>
						{t('mobile.components.layouts.bottomNav.userPanel.customerCode', {
							customerCode: user?.customerCode,
						})}
					</p>
					<LinkListItem href={url.myPage.cart}>
						<Trans i18nKey="mobile.components.layouts.bottomNav.userPanel.cart">
							Cart <span className={styles.count}>({{ cartCount }})</span>
						</Trans>
					</LinkListItem>
				</ul>
			)}

			{orderInfo?.hasOrderInfo && !isEcUser && (
				<>
					<h2 className={styles.heading}>
						{t(
							'mobile.components.layouts.bottomNav.userPanel.myPendingActions'
						)}
					</h2>
					<ul>
						<LinkListItem
							href={url.wos.quote.quote({ lang })}
							disabled={quoteCount === 0}
						>
							<Trans i18nKey="mobile.components.layouts.bottomNav.userPanel.quote">
								Quote
								<span
									className={classNames(styles.count, {
										[String(styles.countDisable)]: quoteCount === 0,
									})}
								>
									({{ quoteCount }})
								</span>
							</Trans>
						</LinkListItem>
						<LinkListItem
							href={url.wos.order.order({ lang })}
							disabled={orderCount === 0}
						>
							<Trans i18nKey="mobile.components.layouts.bottomNav.userPanel.order">
								Order
								<span
									className={classNames(styles.count, {
										[String(styles.countDisable)]: orderCount === 0,
									})}
								>
									({{ orderCount }})
								</span>
							</Trans>
						</LinkListItem>
					</ul>
				</>
			)}
			<ul>
				<LinkListItem href={url.myPage.top}>
					{t('mobile.components.layouts.bottomNav.userPanel.myPage')}
				</LinkListItem>

				{hasCoupon && (
					<LinkListItem href={url.myPage.couponList}>
						{t('mobile.components.layouts.bottomNav.userPanel.myCoupons')}
						{unconfirmedCouponCount ? (
							<span className={classNames(styles.count, styles.coupon)}>
								( {unconfirmedCouponCount} )
							</span>
						) : null}
					</LinkListItem>
				)}
			</ul>

			<h2 className={styles.heading}>
				{t('mobile.components.layouts.bottomNav.userPanel.myFavorites')}
			</h2>
			<ul>
				{hasCadDownloadPermission && (
					<LinkListItem href={url.myPage.cadDownloadHistory}>
						{t(
							'mobile.components.layouts.bottomNav.userPanel.cadDownloadHistory'
						)}
					</LinkListItem>
				)}

				{hasMyComponentsPermission && (
					<LinkListItem href={url.myPage.myComponents}>
						{t('mobile.components.layouts.bottomNav.userPanel.myComponents')}
					</LinkListItem>
				)}

				{orderInfo?.hasInvoiceReferencePermission && (
					<LinkListItem href={url.wos.invoiceList({ lang })}>
						{t('mobile.components.layouts.bottomNav.userPanel.invoiceList')}
					</LinkListItem>
				)}

				{orderInfo?.hasPaymentStatementPermission && (
					<LinkListItem href={url.wos.customerStatementDownload({ lang })}>
						{t(
							'mobile.components.layouts.bottomNav.userPanel.customerStatementDownload'
						)}
					</LinkListItem>
				)}
			</ul>

			<h2 className={styles.heading}>
				{t('mobile.components.layouts.bottomNav.userPanel.settings')}
			</h2>
			<ul>
				<>
					<LinkListItem href={url.wos.settings.profile({ lang })}>
						{t('mobile.components.layouts.bottomNav.userPanel.profile')}
					</LinkListItem>
					<LinkListItem href={url.wos.settings.changePassword({ lang })}>
						{t('mobile.components.layouts.bottomNav.userPanel.changePassword')}
					</LinkListItem>
					{!isEcUser && (
						<LinkListItem href={url.wos.settings.myOrganization({ lang })}>
							{t(
								'mobile.components.layouts.bottomNav.userPanel.myOrganization'
							)}
						</LinkListItem>
					)}
				</>
				{orderInfo?.hasOrderInfo && adminEnabled && (
					<LinkListItem href={url.wos.settings.shipTo({ lang })}>
						{t('mobile.components.layouts.bottomNav.userPanel.shipTo')}
					</LinkListItem>
				)}
				{orderInfo?.hasOrderInfo && adminEnabled && !configUnabled && (
					<LinkListItem href={url.wos.settings.newShipToAddress({ lang })}>
						{t(
							'mobile.components.layouts.bottomNav.userPanel.newShipToAddress'
						)}
					</LinkListItem>
				)}

				{!isEcUser && (
					<>
						<LinkListItem href={url.wos.settings.changeSettings({ lang })}>
							{t(
								'mobile.components.layouts.bottomNav.userPanel.changeSettings'
							)}
						</LinkListItem>

						<LinkListItem
							href={url.wos.settings.partNumberNicknameManagement({ lang })}
						>
							{t(
								'mobile.components.layouts.bottomNav.userPanel.partNoNicknameManagement'
							)}
						</LinkListItem>
					</>
				)}

				{orderInfo?.hasOrderInfo && !userManagementUnabled && (
					<LinkListItem href={url.wos.settings.userManagement({ lang })}>
						{t('mobile.components.layouts.bottomNav.userPanel.userManagement')}
					</LinkListItem>
				)}
			</ul>

			<div className={styles.logoutButtonWrapper}>
				<LogoutButton onClick={handleClickLogout} />
			</div>
		</div>
	);
};

UserPanel.displayName = 'UserPanel';
