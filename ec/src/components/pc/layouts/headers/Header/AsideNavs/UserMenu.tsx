import Router from 'next/router';
import React, { MouseEvent, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth, useLogout, useMessageCount } from './UserMenu.hooks';
import styles from './UserMenu.module.scss';
import { Expand } from '@/components/pc/layouts/headers/Header/Expand';
import { Anchor, NagiLink } from '@/components/pc/ui/links';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { Flag } from '@/models/api/Flag';
import { url } from '@/utils/url';
import classNames from 'classnames';

/**
 * User menu.
 */
export const UserMenu: React.VFC = () => {
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'ko';
	const { t } = useTranslation();
	const { user, permissions, isEcUser, isPurchaseLinkUser } = useAuth();
	const logout = useLogout();
	const messageCount = useMessageCount();

	const [isOpen, setIsOpen] = useState(false);

	const handleClickLogout = async (event: MouseEvent) => {
		event.preventDefault();
		await logout();
		Router.reload();
	};

	const rootRef = useRef(null);
	useOuterClick(
		rootRef,
		useCallback(() => setIsOpen(false), [])
	);

	const isTechnicalSupport = user && user.technicalSupport ? true : false;

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
					label={'마이페이지'} // If only not logged in, name is empty.
				/>
			</div>
			{!!messageCount && <span className={styles.badge}>{messageCount}</span>}
			<div className={styles.menu} aria-hidden={!isOpen}>
				<div className={styles.section}>
					<Anchor href={url.myPage.top}>
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
				<div className={styles.section}>
					<ul>
						<li className={styles.linkItem}>
							<Anchor href={url.myPage.top}>
								{t('components.ui.layouts.headers.header.userMenu.myPage')}
							</Anchor>
						</li>
						{Flag.isTrue(Flag.toFlag(isTechnicalSupport)) && (
							<li className={styles.linkItem}>
								<Anchor href={`/mypage/tech/contact/`}>
									{t(
										'components.ui.layouts.headers.header.userMenu.technicalSupport'
									)}
								</Anchor>
							</li>
						)}
						{Flag.isTrue(user.informationMessageFlag) && (
							<li className={styles.linkItem}>
								<Anchor href={url.myPage.messageList}>
									{t(
										'components.ui.layouts.headers.header.userMenu.myMessages'
									)}
								</Anchor>
							</li>
						)}
						{Flag.isTrue(user.couponMessageFlag) && (
							<li className={styles.linkItem}>
								<Anchor href={url.myPage.couponList}>
									{t('components.ui.layouts.headers.header.userMenu.myCoupons')}
									{user.unconfirmedCouponCount
										? ` (${user.unconfirmedCouponCount})`
										: null}
								</Anchor>
							</li>
						)}
					</ul>
				</div>
				<div className={styles.section}>
					<h3 className={styles.sectionHeading}>
						{t('components.ui.layouts.headers.header.userMenu.myFavorites')}
					</h3>
					<ul>
						{permissions.hasCadDownloadPermission && (
							<li className={styles.linkItem}>
								<Anchor href={url.myPage.cadDownloadHistory}>
									{t(
										'components.ui.layouts.headers.header.userMenu.cadDownloadHistory'
									)}
								</Anchor>
							</li>
						)}
						{permissions.hasMyComponentsPermission && (
							<li className={styles.linkItem}>
								<Anchor href={url.myPage.myComponents}>
									{t(
										'components.ui.layouts.headers.header.userMenu.myComponents'
									)}
								</Anchor>
							</li>
						)}
					</ul>
				</div>
				{!isPurchaseLinkUser && (
					<div className={styles.section}>
						<h3 className={styles.sectionHeading}>
							{t('components.ui.layouts.headers.header.userMenu.settings')}
						</h3>
						<ul>
							<li className={styles.linkItem}>
								<Anchor href={url.wos.settings.profile({ lang })}>
									{t('components.ui.layouts.headers.header.userMenu.profile')}
								</Anchor>
							</li>
							<li className={styles.linkItem}>
								<Anchor href={url.wos.settings.changePassword({ lang })}>
									{t(
										'components.ui.layouts.headers.header.userMenu.changePassword'
									)}
								</Anchor>
							</li>
							{!isEcUser && (
								<li className={styles.linkItem}>
									<Anchor href={url.wos.settings.myOrganization({ lang })}>
										{t(
											'components.ui.layouts.headers.header.userMenu.myOrganization'
										)}
									</Anchor>
								</li>
							)}
							<li className={styles.linkItem}>
								<Anchor href={url.wos.settings.changeSettings({ lang })}>
									{t(
										'components.ui.layouts.headers.header.userMenu.changeSettings'
									)}
								</Anchor>
							</li>
							<li className={styles.linkItem}>
								<Anchor
									href={url.wos.settings.partNumberNicknameManagement({ lang })}
								>
									{t(
										'components.ui.layouts.headers.header.userMenu.customerPartNumber'
									)}
								</Anchor>
							</li>
						</ul>
					</div>
				)}
				<div className={styles.section}>
					<NagiLink href="" onClick={handleClickLogout}>
						{t('components.ui.layouts.headers.header.userMenu.logout')}
					</NagiLink>
				</div>
			</div>
		</div>
	);
};
UserMenu.displayName = 'UserMenu';
