import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useFloatingBanner, useAuth } from './FloatingBanner.hooks';
import styles from './FloatingBanner.module.scss';
import { Cookie, getCookieObject, setCookie } from '@/utils/cookie';

/**
 * Bottom floating banner
 */
export const FloatingBanner: React.VFC = () => {
	const elementRef = useRef<HTMLDivElement>(null);
	const cookie = getCookieObject<{ member?: 0 | 1; closed?: 0 | 1 }>(
		Cookie.VONAEC_ALREADY_MEMBER
	);
	/** loadする条件 */
	const shouldLoadBanner =
		!cookie || (cookie.member !== 1 && cookie.closed !== 1);
	const { floatingBanner, error } = useFloatingBanner(shouldLoadBanner);
	const authenticated = useAuth();
	const [showsBanner, setShowsBanner] = useState(shouldLoadBanner);

	// 入稿 HTML コンテンツの link タグで指定された CSS がロードされたか、link タグがなければ true
	const [cssReady, setCssReady] = useState(false);

	useEffect(() => {
		// NOTE: React の制御下にないDOM群(将来JSON化される予定のCRM HTMLコンテンツ)の制御のためやむを得ず
		//       querySelector 等を利用していますが、通常は禁じ手ですので真似しないでください
		const element = elementRef.current?.querySelector<HTMLAnchorElement>(
			// 閉じるボタン
			'a[data-common="floatingBnrBottomClose"]'
		);
		if (element) {
			const handler = () => {
				setCookie(
					Cookie.VONAEC_ALREADY_MEMBER,
					{ closed: 1 },
					{
						expires: dayjs().add(1, 'day').hour(0).startOf('hour').toDate(),
					}
				);
				setShowsBanner(false);
			};
			element.addEventListener('click', handler);
		}
	}, [floatingBanner]);

	useEffect(() => {
		if (floatingBanner) {
			const onLoad = () => {
				setCssReady(true);
			};

			// NOTE: React の制御下にないDOM群(入稿HTMLコンテンツ)の制御のためやむを得ず
			//       querySelector 等を利用していますが、通常は禁じ手ですので真似しないでください。
			// WARN: NEW_FE-3706 で CLS を改善するためにこの制御が入れられていますが、
			//       入稿された HTML における link タグが複数に増えた場合、新たな考慮が必要になる可能性があります。
			//       他現法にはこのまま横展開することは出来ない可能性が高いです。
			const link = elementRef.current?.querySelector<HTMLLinkElement>('link');

			if (link) {
				link.addEventListener('load', onLoad);
				return () => link.removeEventListener('load', onLoad);
			} else {
				// 待ち合わせるべき css load はないと判定したため、ready にする
				setCssReady(true);
			}
		}
	}, [floatingBanner]);

	useEffect(() => {
		// 未ログインからログイン済みに変化した場合、cookie の VONAEC_ALREADY_MEMBER が {member: 1} になるので再描画
		if (authenticated) {
			setShowsBanner(false);
		}
	}, [authenticated]);

	if (!showsBanner || error) {
		return null;
	}

	return (
		<div className={styles.bottom}>
			<div
				dangerouslySetInnerHTML={{ __html: floatingBanner ?? '' }}
				ref={elementRef}
				// ここでは必要があって display: none を使用していますが安易に真似しないでください
				style={{ display: cssReady ? undefined : 'none' }}
			/>
		</div>
	);
};
FloatingBanner.displayName = 'FloatingBanner';
