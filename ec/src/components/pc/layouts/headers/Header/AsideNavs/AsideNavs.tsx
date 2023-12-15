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
		<div className={styles.headerBalloonBoxWrap}>
			<ul className={styles.headerFunction}>
				<OrderMenu />
				<NeedHelp />
				{authenticated ? <>mypage</> : <LoginMenu />}
				{authenticated ? <>장바구니</> : <RegistMenu />}
			</ul>
		</div>
	);
};
