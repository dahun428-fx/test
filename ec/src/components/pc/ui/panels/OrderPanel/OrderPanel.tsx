import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrderPanel.module.scss';
import { NagiLinkButton } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { url } from '@/utils/url';
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

	const hasInfomationPermission =
		selectedOrderInfo?.hasInfomationPermission || false;

	const enableOrderInfo = selectedOrderInfo ? true : false;

	const purchaseLinkHTML = () => {
		return (
			<>
				{isPurchaseLinkUser ? (
					<p>
						<NagiLinkButton
							theme="primary"
							size="s"
							className={styles.btnHeaderOrder}
							href={url.wos.quote.quote({ lang })}
							disabled={!(canEstimate || !authenticated)}
						>
							{t('common.quote.quote')}
						</NagiLinkButton>
					</p>
				) : (
					<ul className={styles.headerOrderFunction}>
						<li>
							<NagiLinkButton
								theme="primary"
								size="s"
								className={styles.btnHeaderOrder}
								href={url.wos.quote.quote({ lang })}
								disabled={!(canEstimate || !authenticated)}
							>
								{t('common.quote.quote')}
							</NagiLinkButton>
						</li>
						<li>
							<NagiLinkButton
								theme="primary"
								size="s"
								className={styles.btnHeaderOrder}
								href={url.wos.order.order({ lang })}
								disabled={!(canOrder || !authenticated)}
							>
								{t('common.order.order')}
							</NagiLinkButton>
						</li>
					</ul>
				)}
			</>
		);
	};

	const orderPanelBtnPrintHTML = () => {
		const canUseEstimateHistory = !authenticated || hasQuoteHistoryPermission;
		const canUseOrderHistory = !authenticated || hasOrderHistoryPermission;
		return (
			<ul className={styles.headerOrderFunction}>
				<li>
					<NagiLinkButton
						href={url.wos.quote.history({ lang })}
						className={styles.btnHeaderOrderHistory}
						disabled={!canUseEstimateHistory}
						size="s"
						theme="tertiary"
					>
						{t('common.quote.history')}
					</NagiLinkButton>
				</li>
				<li>
					<NagiLinkButton
						className={styles.btnHeaderOrderHistory}
						href={url.wos.order.history({ lang })}
						size="s"
						theme="tertiary"
						disabled={!canUseOrderHistory}
					>
						{t('common.order.history')}
					</NagiLinkButton>
				</li>
			</ul>
		);
	};

	const balloonInnerFirstHTML = () => {
		return (
			<div className={styles.headerBalloonBoxInner}>
				<ul className={classNames(styles.headerOrderUpload, styles.estTopBox)}>
					<li>
						<span className={styles.type}>
							{t('components.ui.panels.orderPanel.copyAndPaste')}
						</span>
						<NagiLink
							href={url.wos.quote.withCopyAndPaste({ lang })}
							disabled={!(canEstimate || !authenticated)}
						>
							{t('common.quote.quote')}
						</NagiLink>
						|
						{!isPurchaseLinkUser && (
							<NagiLink
								href={url.wos.quote.withCopyAndPaste({ lang })}
								disabled={!(canOrder || !authenticated)}
							>
								{t('common.order.order')}
							</NagiLink>
						)}
					</li>
					<li>
						<span className={styles.type}>
							{t('components.ui.panels.orderPanel.uploadFile')}
						</span>
						<NagiLink
							href={url.wos.quote.withUploadingFile({ lang })}
							disabled={!(canEstimate || !authenticated)}
						>
							{t('common.quote.quote')}
						</NagiLink>
						|
						{!isPurchaseLinkUser && (
							<NagiLink
								href={url.wos.quote.withUploadingFile({ lang })}
								disabled={!(canOrder || !authenticated)}
							>
								{t('common.order.order')}
							</NagiLink>
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
							<NagiLink href={url.wos.quote.withUploadingFile({ lang })}>
								{t('components.ui.panels.orderPanel.upFileUPLOAD')}
							</NagiLink>
						</li>
					) : (
						<li>
							<NagiLink href={url.wos.shipment.history({ lang })}>
								{t('components.ui.panels.orderPanel.shipmentHistory')}
							</NagiLink>
						</li>
					)}
				</ul>
			</div>
		);
	};

	const balloonInnerThirdHTML = () => {
		return (
			<div className={styles.headerBalloonBoxInner}>
				<ul className={classNames(styles.headerLinkList, styles.estTopBox)}>
					{!(isHipus || isNetRicoh) && (
						<li>
							<NagiLink href={url.wos.partNumberChecker} target="_blank">
								{t('components.ui.panels.orderPanel.partNumberChecker')}
							</NagiLink>
						</li>
					)}
					{enableOrderInfo && !isNetRicoh && hasPDFInvoicePermission ? (
						<li>
							<NagiLink href={url.wos.invoice.pdf({ lang })} target="_blank">
								{t('components.ui.panels.orderPanel.invocePDF')}
							</NagiLink>
						</li>
					) : (
						hasInfomationPermission && (
							<li>
								<NagiLink
									href={url.wos.invoice.apply({ lang })}
									target="_blank"
								>
									{t('components.ui.panels.orderPanel.invocePDF')}
								</NagiLink>
							</li>
						)
					)}
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
				{isPurchaseLinkUser
					? `${t('components.ui.panels.orderPanel.purchaseUserTitle')}`
					: `${t('components.ui.panels.orderPanel.title')}`}
			</div>
			<div>
				{purchaseLinkHTML()}
				{orderPanelBtnPrintHTML()} {balloonInnerFirstHTML()}
				{balloonInnerSecondHTML()} {balloonInnerThirdHTML()}
			</div>
		</div>
	);
};
OrderPanel.displayName = 'OrderPanel';
