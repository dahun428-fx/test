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

/**
 * Header aside navigations.
 */
export const AsideNavs: React.VFC = () => {
	const { authenticated, isPurchaseLinkUser } = useAuth();
	const cartCount = useCartCount();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';
	const { t } = useTranslation();

	const [isBalloonShow, setIsBalloonShow] = useState<string>('');

	const NAV_ORDER = 'order';
	const NAV_HELP = 'help';
	const NAV_LOGIN = 'login';
	const NAV_REGIST = 'regist';

	return (
		<div className={styles.headerBalloonBoxWrap}>
			<ul className={styles.headerFunction}>
				<li
					className={
						isBalloonShow === NAV_ORDER
							? classNames(styles.order, styles.on)
							: classNames(styles.order)
					}
					onClick={() => setIsBalloonShow(NAV_ORDER)}
				>
					<span>견적/주문</span>
				</li>
				{/* <li
					className={
						isBalloonShow === NAV_HELP
							? classNames(styles.help, styles.on)
							: classNames(styles.help)
					}
					onClick={() => setIsBalloonShow(NAV_HELP)}
				>
					<span>문의하기</span>
				</li> */}
				<NeedHelp />
				<LoginMenu />
				{/* <li
					className={
						isBalloonShow === NAV_LOGIN
							? classNames(styles.login, styles.on)
							: classNames(styles.login)
					}
					onClick={() => setIsBalloonShow(NAV_LOGIN)}
				>
					<span>로그인</span>
				</li> */}
				<li
					className={
						isBalloonShow === NAV_REGIST
							? classNames(styles.regist, styles.on)
							: classNames(styles.regist)
					}
					onClick={() => setIsBalloonShow(NAV_REGIST)}
				>
					<span>회원가입</span>
				</li>
			</ul>
		</div>
	);
};
