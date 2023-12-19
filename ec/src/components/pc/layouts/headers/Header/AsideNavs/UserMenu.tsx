import Router from 'next/router';
import React, { MouseEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	openOrderStatusPanel,
	useAuth,
	useLogout,
	useMessageCount,
} from './UserMenu.hooks';
import styles from './UserMenu.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import { Anchor, NagiLink } from '@/components/pc/ui/links';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { Flag } from '@/models/api/Flag';
import { url } from '@/utils/url';
import classNames from 'classnames';
import { useOrderStatusPanel } from '../OrderStatus/OrderStatusPanel.hooks';

/**
 * User menu.
 */
export const UserMenu: React.VFC = () => {
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'ko';
	const { t } = useTranslation();
	const {
		user,
		permissions,
		isEcUser,
		isPurchaseLinkUser,
		selectedOrderInfo,
		isCashOnDeliveryUser,
		isCreditCardUser,
		isNetRicoh,
	} = useAuth();
	const logout = useLogout();
	const messageCount = useMessageCount();

	const [isOpen, setIsOpen] = useState(false);

	const handleClickLogout = async (event: MouseEvent) => {
		event.preventDefault();
		await logout();
		Router.reload();
	};

	const { setShowsStatus } = useOrderStatusPanel();

	const openPanel = (event: MouseEvent) => {
		event.preventDefault();
		setIsOpen(false);
		setShowsStatus(true);
	};

	const rootRef = useRef(null);
	useOuterClick(
		rootRef,
		useCallback(() => setIsOpen(false), [])
	);
	const canOrder = !isEcUser && permissions.hasOrderPermission;
	const isShipToAdminist = selectedOrderInfo?.hasShipToManagementPermission;
	const adminEnabled = isShipToAdminist && !isCashOnDeliveryUser && canOrder; // isCashOnDeliveryUser = COD ( DAIBIKI )
	const configUnabled =
		isCashOnDeliveryUser ||
		selectedOrderInfo?.isProxyLogin ||
		isEcUser ||
		!permissions.hasOrderPermission;
	const userManagementUnabled =
		isCreditCardUser ||
		isCashOnDeliveryUser ||
		selectedOrderInfo?.isProxyLogin ||
		!selectedOrderInfo?.hasUserManagementPermission;
	const enableOrderInfo = selectedOrderInfo ? true : false;
	const isTechnicalSupport = user && user.technicalSupport ? true : false;

	const mypageSectionHTML = () => {
		return (
			<>
				{(!isPurchaseLinkUser || isNetRicoh) && (
					<div className={styles.section}>
						<ul>
							<li className={styles.linkItem}>
								<Anchor href={url.myPage.top}>
									{t('components.ui.layouts.headers.header.userMenu.myPage')}
									{/* My 페이지 */}
								</Anchor>
							</li>
							{!isPurchaseLinkUser && isTechnicalSupport ? (
								<li className={styles.linkItem}>
									<Anchor href={`/mypage/tech/contact/`}>
										{t(
											'components.ui.layouts.headers.header.userMenu.technicalSupport'
										)}
										{/* 기술문의 / 설계지원 */}
									</Anchor>
								</li>
							) : (
								Flag.isTrue(user.informationMessageFlag) && (
									<li className={styles.linkItem}>
										<Anchor href={url.myPage.messageList}>
											{t(
												'components.ui.layouts.headers.header.userMenu.myMessages'
											)}
											{/* 미스미 소식 */}
										</Anchor>
									</li>
								)
							)}
							{!isPurchaseLinkUser && Flag.isTrue(user.couponMessageFlag) && (
								<li className={styles.linkItem}>
									<Anchor href={url.myPage.couponList}>
										{t(
											'components.ui.layouts.headers.header.userMenu.myCoupons'
										)}
										{/* 보유 쿠폰 */}
										{user.unconfirmedCouponCount
											? ` (${user.unconfirmedCouponCount})`
											: null}
									</Anchor>
								</li>
							)}
						</ul>
					</div>
				)}
			</>
		);
	};

	const wosSectionHTML = () => {
		return (
			<div className={styles.section}>
				{isPurchaseLinkUser ? (
					<ul>
						<li className={styles.linkItem}>
							<Anchor href={url.wos.quote.quote({ lang })}>
								{t('common.quote.write')}
								{/* 견적작성 */}
							</Anchor>
						</li>
						<li className={styles.linkItem}>
							<Anchor href={url.wos.quote.history({ lang })}>
								{t('common.quote.history')}
								{/* 견적이력 */}
							</Anchor>
						</li>
						<li className={styles.linkItem}>
							<Anchor
								href={url.wos.settings.partNumberNicknameManagement({ lang })}
							>
								{t(
									'components.ui.layouts.headers.header.userMenu.customerPartnumberSetting'
								)}
								{/* 고객 형번 설정 */}
							</Anchor>
						</li>
					</ul>
				) : (
					<ul>
						<li className={styles.linkItem}>
							<Anchor href={``} onClick={e => openPanel(e)}>
								{t('components.ui.layouts.headers.header.userMenu.quoteOrder')}
								{/* 견적/주문 내역 */}
							</Anchor>
						</li>
						{!isEcUser && (
							<li className={styles.linkItem}>
								<Anchor href={url.deliveryCheck}>
									{t(
										'components.ui.layouts.headers.header.userMenu.deliveryCheck'
									)}
									{/* 배송조회 */}
								</Anchor>
							</li>
						)}
						{!isEcUser && (
							<li className={styles.linkItem}>
								<Anchor href={url.shippingWayChange}>
									{t(
										'components.ui.layouts.headers.header.userMenu.deliveryChange'
									)}
									{/* 배송방식 변경 */}
								</Anchor>
							</li>
						)}
						{enableOrderInfo && adminEnabled ? (
							<li className={styles.linkItem}>
								<Anchor href={url.wos.settings.shipToManagement({ lang })}>
									{t(
										'components.ui.layouts.headers.header.userMenu.deliverySiteCheck'
									)}
									{/* 배송지 관리 */}
								</Anchor>
							</li>
						) : (
							!configUnabled && (
								<li className={styles.linkItem}>
									<Anchor href={url.wos.settings.newShipToAddress({ lang })}>
										{t(
											'components.ui.layouts.headers.header.userMenu.deliverySiteAdd'
										)}
										{/* 배송지 추가 */}
									</Anchor>
								</li>
							)
						)}

						{!isEcUser && (
							<li className={styles.linkItem}>
								<Anchor href={url.wos.returnRequest({ lang })}>
									{t(
										'components.ui.layouts.headers.header.userMenu.returnChangeCheck'
									)}
									{/* 반품/교환 신청 일람 */}
								</Anchor>
							</li>
						)}
					</ul>
				)}
			</div>
		);
	};

	const historySectionHTML = () => {
		return (
			<div className={styles.section}>
				<ul>
					{permissions.hasMyComponentsPermission && (
						<li className={styles.linkItem}>
							<Anchor href={url.myPage.myComponents}>
								{t(
									'components.ui.layouts.headers.header.userMenu.myComponents'
								)}
								{/* My 부품표 */}
							</Anchor>
						</li>
					)}
					{permissions.hasCadDownloadPermission && (
						<li className={styles.linkItem}>
							<Anchor href={url.myPage.cadDownloadHistory}>
								{t(
									'components.ui.layouts.headers.header.userMenu.cadDownloadHistory'
								)}
								{/* CAD 데이터 다운로드 내역 */}
							</Anchor>
						</li>
					)}
					{!isEcUser && (
						<li className={styles.linkItem}>
							<Anchor
								href={url.wos.settings.partNumberNicknameManagement({ lang })}
							>
								{t(
									'components.ui.layouts.headers.header.userMenu.myPartNumberSetting'
								)}
								{/* My 형번 설정 */}
							</Anchor>
						</li>
					)}
				</ul>
			</div>
		);
	};

	const customerSettingSectionHTML = () => {
		return (
			<div className={styles.section}>
				<ul>
					{!isPurchaseLinkUser && !isEcUser && (
						<li className={styles.linkItem}>
							<Anchor
								target="_blank"
								href={url.wos.settings.myOrganization({ lang })}
							>
								{t(
									'components.ui.layouts.headers.header.userMenu.myOrganization'
								)}
								{/* 미스미 회원정보 */}
							</Anchor>
						</li>
					)}
					{!isPurchaseLinkUser && (
						<li className={styles.linkItem}>
							<Anchor href={url.wos.settings.profile({ lang })}>
								{t(
									'components.ui.layouts.headers.header.userMenu.profileChange'
								)}
								{/* WOS 고객 정보 변경 */}
							</Anchor>
						</li>
					)}
					{!isPurchaseLinkUser && !isEcUser && (
						<li className={styles.linkItem}>
							<Anchor href={url.wos.settings.changeSettings({ lang })}>
								{t(
									'components.ui.layouts.headers.header.userMenu.changeSettings'
								)}
								{/* WOS 설정 변경 */}
							</Anchor>
						</li>
					)}
					{!isPurchaseLinkUser && enableOrderInfo && !userManagementUnabled && (
						<li className={styles.linkItem}>
							<Anchor href={url.wos.settings.userManagement({ lang })}>
								{t(
									'components.ui.layouts.headers.header.userMenu.userManagement'
								)}
								{/* WOS 이용자 관리 */}
							</Anchor>
						</li>
					)}
					{!isPurchaseLinkUser && (
						<li className={styles.linkItem}>
							<Anchor href={url.wos.settings.changePassword({ lang })}>
								{t('components.ui.layouts.headers.header.userMenu.changePW')}
								{/* 비밀번호 변경 */}
							</Anchor>
						</li>
					)}
				</ul>
			</div>
		);
	};

	return (
		<div className={styles.container} ref={rootRef}>
			<div
				className={
					isOpen
						? classNames(styles.myPageBtn, styles.on)
						: classNames(styles.myPageBtn)
				}
			>
				<Expand
					expanded={isOpen}
					onClick={() => setIsOpen(prev => !prev)}
					label={t('components.ui.layouts.headers.header.userMenu.expandTitle')} // If only not logged in, name is empty.
				/>
			</div>
			{!!messageCount && <span className={styles.badge}>{messageCount}</span>}
			<div className={styles.menu} aria-hidden={!isOpen}>
				<div className={styles.section}>
					<Anchor href={url.myPage.top} className={styles.userName}>
						{t('components.ui.layouts.headers.header.userMenu.userName', {
							userName: user.userName,
						})}
					</Anchor>
					{!isEcUser && (
						<p className={styles.customerCode}>
							{t('components.ui.layouts.headers.header.userMenu.customerCode', {
								customerCode: user.customerCode,
							})}
						</p>
					)}
				</div>
				{mypageSectionHTML()}
				{wosSectionHTML()}
				{historySectionHTML()}
				{customerSettingSectionHTML()}
				<div className={styles.section}>
					<div className={styles.logoutBtn}>
						<NagiLink href="" onClick={handleClickLogout}>
							{t('components.ui.layouts.headers.header.userMenu.logout')}
						</NagiLink>
					</div>
				</div>
			</div>
		</div>
	);
};
UserMenu.displayName = 'UserMenu';
