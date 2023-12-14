import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrderPanel.module.scss';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { url } from '@/utils/url';
import Link from 'next/link';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { OrderInfo } from '@/store/modules/pages/home';

type Props = {
	size: 'wide' | 'narrow';
	/** ログイン済みか */
	authenticated: boolean;
	/** ログイン済みかつEC会員か */
	isEcUser: boolean;
	/** ログイン済みかつ購買連携ユーザか */
	isPurchaseLinkUser?: boolean;
	/** 注文権限 (未ログインの場合は false 想定) */
	hasOrderPermission: boolean; //
	/** 見積権限 (未ログインの場合は false 想定) */
	hasQuotePermission: boolean; //hasQuotePermission: permissionList.includes('3'),
	/** 注文履歴権限 (未ログインの場合は false 想定) */
	hasOrderHistoryPermission: boolean; // permissionList.includes('6'),
	/** 注文履歴権限 (未ログインの場合は false 想定) */
	hasQuoteHistoryPermission: boolean; //permissionList.includes('5'),
	selectedUserInfo: Readonly<GetUserInfoResponse> | null;
	selectedOrderInfo: OrderInfo | null;
};

const lang = 'KOR';

/**
 * Order / Quote
 */
export const OrderPanel: React.VFC<Props> = ({
	size = 'narrow',
	authenticated,
	isEcUser,
	isPurchaseLinkUser,
	hasOrderPermission,
	hasQuotePermission,
	hasOrderHistoryPermission,
	hasQuoteHistoryPermission,
	selectedUserInfo,
	selectedOrderInfo,
}) => {
	const [t] = useTranslation();
	const canEstimate = !isEcUser && hasQuotePermission;
	const canOrder = !isEcUser && hasOrderPermission;
	const isHipus =
		selectedUserInfo &&
		selectedUserInfo.styleKey &&
		selectedUserInfo.styleKey == '0708152018';

	const isNetRicoh =
		selectedUserInfo &&
		selectedUserInfo.styleKey &&
		selectedUserInfo.styleKey == '1304191708';
	const hasUnitPricePermission =
		selectedOrderInfo?.hasUnitPricePermission || false;

	const hasPDFInvoicePermission =
		selectedOrderInfo?.hasPDFInvoicePermission || false;

	const enableOrderInfo = selectedOrderInfo ? true : false;

	const purchaseLinkHTML = () => {
		return (
			<>
				{canEstimate || !authenticated ? (
					<p>
						<Link href={url.wos.quote.quote({ lang })}>
							<a className={styles.btnHeaderOrder}>견적</a>
						</Link>
					</p>
				) : (
					<p>
						<span
							className={classNames(styles.btnHeaderOrder, styles.isDisabled)}
						>
							견적
						</span>
					</p>
				)}
			</>
		);
	};

	const orderPanelBtnPrintHTML = () => {
		const canUseEstimateHistory = !authenticated || hasQuoteHistoryPermission;
		const canUseOrderHistory = !authenticated || hasOrderHistoryPermission;
		return (
			<ul className={styles.headerOrderFunction}>
				{canUseEstimateHistory ? (
					<li>
						<Link href={url.wos.quote.history({ lang })}>
							<a className={styles.btnHeaderOrderHistory}>견적이력</a>
						</Link>
					</li>
				) : (
					<li>
						<span
							className={classNames(
								styles.btnHeaderOrderHistory,
								styles.isDisabled
							)}
						>
							견적이력
						</span>
					</li>
				)}
				{canUseOrderHistory ? (
					<li>
						<Link href={url.wos.order.history({ lang })}>
							<a className={styles.btnHeaderOrderHistory}>주문이력</a>
						</Link>
					</li>
				) : (
					<li>
						<span
							className={classNames(
								styles.btnHeaderOrderHistory,
								styles.isDisabled
							)}
						>
							주문이력
						</span>
					</li>
				)}
			</ul>
		);
	};

	const balloonInnerFirstHTML = () => {
		return (
			<div className={styles.headerBalloonBoxInner}>
				<ul className={classNames(styles.headerOrderUpload, styles.estTopBox)}>
					<li>
						<span className={styles.type}>복사&붙여넣기</span>
						{canEstimate || !authenticated ? (
							<Link href={url.wos.quote.withCopyAndPaste({ lang })}>견적</Link>
						) : (
							<span className={styles.isDisabled}>견적</span>
						)}
						{!isPurchaseLinkUser && (canOrder || !authenticated) ? (
							<Link href={url.wos.quote.withCopyAndPaste({ lang })}>주문</Link>
						) : (
							<span className={styles.isDisabled}>주문</span>
						)}
					</li>
					<li>
						<span className={styles.type}>파일업로드</span>&nbsp;
						{canEstimate || !authenticated ? (
							<Link href={url.wos.quote.withUploadingFile({ lang })}>견적</Link>
						) : (
							<span className={styles.isDisabled}>견적</span>
						)}
						{!isPurchaseLinkUser && (canOrder || !authenticated) ? (
							<Link href={url.wos.quote.withUploadingFile({ lang })}>주문</Link>
						) : (
							<span className={styles.isDisabled}>주문</span>
						)}
					</li>
				</ul>
			</div>
		);
	};

	const balloonInnerSecondHTML = () => {
		return (
			<div className={styles.headerBalloonBoxInner}>
				<ul className={classNames(styles.headerOrderUpload, styles.estTopBox)}>
					{hasUnitPricePermission ? (
						<li>
							<Link href={url.wos.quote.withUploadingFile({ lang })}>
								단가표 작성
							</Link>
						</li>
					) : (
						<li>
							<Link href={url.wos.shipment.history({ lang })}>출하이력</Link>
						</li>
					)}
				</ul>
			</div>
		);
	};

	const balloonInnerThirdHTML = () => {
		return (
			<div className={styles.headerBalloonBoxInner}>
				<ul className={styles.headerLinkList}>
					{!(isHipus || isNetRicoh) && (
						<li>
							<Link href={url.wos.partNumberChecker}>
								<a target="_blank">형번확인</a>
							</Link>
						</li>
					)}
					{enableOrderInfo && !isNetRicoh}
				</ul>
			</div>
		);
	};

	return (
		<div
			className={classNames(
				styles.headerBalloonBoxLeft,
				styles.balloonBoxOrder
			)}
		>
			<div className={styles.headerBalloonBoxTtl}>
				{isPurchaseLinkUser ? '[WOS]형번견적' : '견적/주문'}
			</div>
			<div>
				{isPurchaseLinkUser ? (
					purchaseLinkHTML()
				) : (
					<>
						{orderPanelBtnPrintHTML()} {balloonInnerFirstHTML()}
						{balloonInnerSecondHTML()}
					</>
				)}
			</div>
		</div>
	);
};
OrderPanel.displayName = 'OrderPanel';
