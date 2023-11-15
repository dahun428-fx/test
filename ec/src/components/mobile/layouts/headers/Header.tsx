import dayjs from 'dayjs';
import Router, { useRouter } from 'next/router';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './Header.hooks';
import styles from './Header.module.scss';
import { SearchBox } from './SearchBox';
import { ServiceMenu } from './ServiceMenu';
import { MessageToast } from '@/components/mobile/layouts/headers/MessageToast';
import { Link } from '@/components/mobile/ui/links';
import { Drawer } from '@/components/mobile/ui/modals/Drawer';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { pagesPath } from '@/utils/$path';
import { Cookie, getCookie, setCookie } from '@/utils/cookie';
import { useTimer } from '@/utils/timer';
import { convertToURLString, url } from '@/utils/url';
import { uuidv4 } from '@/utils/uuid';
import { openSubWindow } from '@/utils/window';

// FIXME: Using this to calculate top for Category Sticky in Search Result page.
// If having a better solution, change to it.
export const HEADER_WRAPPER_ID = `header-wrapper-${uuidv4()}`;
/** cookie */
const CONFIRMED = '1';
/** Delay to show toast message */
const DELAY_TO_SHOW = 2000;
/** Delay to hide toast message */
const DELAY_TO_HIDE = 14000;

export type Props = {
	showsServiceMenu: boolean;
	showsSearchBox?: boolean;
	hideServiceMenu: () => void;
	onToggleShowServiceMenu: () => void;
};

/**
 * Mobile header
 */
export const Header: React.VFC<Props> = ({
	showsServiceMenu,
	showsSearchBox = true,
	hideServiceMenu,
	onToggleShowServiceMenu,
}) => {
	const router = useRouter();
	const [t] = useTranslation();
	const {
		authenticated,
		isPurchaseLinkUser,
		unconfirmedMessageCount,
		unconfirmedMessageAndContactCount,
	} = useAuth();
	const ref = useRef(null);
	const timer = useTimer();
	const [showsSignUpMenu, setShowsSignUpMenu] = useState(false);
	const [showsMessageToast, setShowsMessageToast] = useState(false);

	/** Close all header menus on changing route */
	const onStartToChangeRoute = useCallback(() => {
		if (showsSignUpMenu) {
			setShowsSignUpMenu(false);
		}

		hideServiceMenu();
	}, [hideServiceMenu, showsSignUpMenu]);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			event.preventDefault();
			const chatPath = pagesPath.vona2.chat.$url({
				query: { referrer: 'ec', site: '1', pagereferrer: location.href },
			});

			if (chatPath.pathname === router.pathname) {
				return;
			}

			openSubWindow(convertToURLString(chatPath), 'chat');
		},
		[router.pathname]
	);

	useEffect(() => {
		Router.events.on('routeChangeStart', onStartToChangeRoute);
		return () => {
			Router.events.off('routeChangeStart', onStartToChangeRoute);
		};
	}, [onStartToChangeRoute]);

	/** Handle click menu */
	const handleClickServiceMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowsSignUpMenu(false);
		onToggleShowServiceMenu();
	};

	/**
	 * Show the message toast
	 */
	const handleShowToast = useCallback(async () => {
		if (
			authenticated &&
			!isPurchaseLinkUser &&
			((unconfirmedMessageCount && unconfirmedMessageCount > 0) ||
				(unconfirmedMessageAndContactCount &&
					unconfirmedMessageAndContactCount > 0)) &&
			getCookie(Cookie.VONAEC_UNCONFIRMED) !== CONFIRMED
		) {
			// Set cookie to not show again until 08:00 AM next day
			setCookie(Cookie.VONAEC_UNCONFIRMED, CONFIRMED, {
				expires: dayjs().add(1, 'day').hour(8).startOf('hour').toDate(),
			});

			// Delay 2s before visible toast
			await timer.sleep(DELAY_TO_SHOW);
			setShowsMessageToast(true);

			// Stay 14s
			await timer.sleep(DELAY_TO_HIDE);
			setShowsMessageToast(false);
		}
	}, [
		authenticated,
		isPurchaseLinkUser,
		timer,
		unconfirmedMessageAndContactCount,
		unconfirmedMessageCount,
	]);

	useOuterClick(ref, () => {
		setShowsSignUpMenu(false);
		hideServiceMenu();
	});

	useEffect(() => {
		handleShowToast();
	}, [handleShowToast]);

	return (
		<header className={styles.container} id={HEADER_WRAPPER_ID}>
			<div className={styles.header} ref={ref}>
				<div className={styles.menu}>
					<a
						aria-label="Open Menu"
						href="#"
						className={styles.menuIcon}
						onClick={handleClickServiceMenu}
					/>
				</div>
				<div className={styles.logoWrap}>
					{router.pathname === '/' ? (
						<h1
							className={styles.logoImage}
							aria-label={t(
								'mobile.components.layouts.headers.header.misumiHeaderTitle'
							)}
						/>
					) : (
						<Link
							className={styles.logoImage}
							href={pagesPath.$url()}
							aria-label={t(
								'mobile.components.layouts.headers.header.misumiHeaderTitle'
							)}
						/>
					)}
				</div>
				<div className={styles.aside}>
					{authenticated && (
						<a
							href={url.myPage.couponList}
							className={styles.coupon}
							aria-label="Coupon"
						/>
					)}
					<a
						className={styles.chat}
						onClick={handleClick}
						href="#"
						aria-label="Open Chat"
					/>
				</div>
				<Drawer isOpen={showsServiceMenu} top={50} slideFrom="left">
					<ServiceMenu />
				</Drawer>

				<MessageToast isOpen={showsMessageToast} />
			</div>
			{showsSearchBox && <SearchBox headerRef={ref} />}
		</header>
	);
};

Header.displayName = 'Header';
