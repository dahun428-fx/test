import React, { useState, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth, useCartCount } from './AsideNavs.hooks';
import styles from './AsideNavs.module.scss';
import { LoginMenu } from './LoginMenu';
import { NeedHelp } from './NeedHelp';
import { OrderMenu } from './OrderMenu';
import { UserMenu } from './UserMenu';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { url } from '@/utils/url';
import classNames from 'classnames';
import { RegistMenu } from './RegistMenu';
import { useRouter } from 'next/router';

/**
 * Header aside navigations.
 */
export const AsideNavs: React.VFC = () => {
	const router = useRouter();

	const { authenticated, isPurchaseLinkUser } = useAuth();
	const cartCount = useCartCount();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'ko';
	const { t } = useTranslation();

	const handleOnClickCartBtn = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		event.preventDefault();
		router.push(url.cart);
	};

	return (
		<div className={styles.headerBalloonBoxWrap}>
			<ul className={styles.headerFunction}>
				<OrderMenu />
				<NeedHelp />
				{authenticated ? <UserMenu /> : <LoginMenu />}
				{authenticated ? (
					<li className={styles.cart}>
						<a onClick={event => handleOnClickCartBtn(event)}>
							{t('components.ui.layouts.headers.header.asideNavs.cart')}
							<span className={styles.badge}>{cartCount}</span>
						</a>
					</li>
				) : (
					<RegistMenu />
				)}
			</ul>
		</div>
	);
};
