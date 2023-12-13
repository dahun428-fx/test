import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth, useCartCount } from './AsideNavs.hooks';
import styles from './AsideNavs.module.scss';
import { LoginMenu } from './LoginMenu';
import { NeedHelp } from './NeedHelp';
import { OrderMenu } from './OrderMenu';
import { UserMenu } from './UserMenu';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { url } from '@/utils/url';

/**
 * Header aside navigations.
 */
export const AsideNavs: React.VFC = () => {
	const { authenticated, isPurchaseLinkUser } = useAuth();
	const cartCount = useCartCount();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';
	const { t } = useTranslation();
	return (
		<div className={styles.asideNavs}>
			{isPurchaseLinkUser ? (
				<ul className={styles.purchaseLinkUser}>
					<li className={styles.needHelp}>
						<NeedHelp />
					</li>
				</ul>
			) : (
				<ul className={styles.list}>
					<li className={styles.navItem}>
						<OrderMenu />
					</li>
					<li className={styles.navItem}>
						<NeedHelp />
					</li>
				</ul>
			)}
			<ul className={styles.list}>
				<li className={styles.navItem}>
					{authenticated ? <UserMenu /> : <LoginMenu />}
				</li>
				<li className={styles.navItem}>
					{authenticated ? (
						<NagiLinkButton theme="primary" href={url.cart}>
							<Trans i18nKey="components.ui.layouts.headers.header.asideNavs.cart">
								<span className={styles.cartCount}>{{ cartCount }}</span>
							</Trans>
						</NagiLinkButton>
					) : (
						<NagiLinkButton
							theme="secondary"
							href={url.wos.userRegistration({ lang })}
							target="_blank"
						>
							{t('components.ui.layouts.headers.header.asideNavs.newUser')}
						</NagiLinkButton>
					)}
				</li>
			</ul>
		</div>
	);
};
