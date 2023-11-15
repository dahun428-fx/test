import React, {
	useCallback,
	MouseEvent,
	FormEvent,
	useRef,
	useMemo,
	RefObject,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './ActionsPanel.module.scss';
import { NeedsQuoteMessage } from '@/components/pc/domain/price/NeedsQuoteMessage';
import { PriceLeadTime } from '@/components/pc/domain/price/PriceLeadTime';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { ExpressServiceTable } from '@/components/pc/pages/ProductDetail/ActionsPanel/ExpressServiceTable';
import { PartNumberMessageList } from '@/components/pc/pages/ProductDetail/ActionsPanel/PartNumberMessageList';
import { VolumeDiscountTable } from '@/components/pc/pages/ProductDetail/ActionsPanel/VolumeDiscountTable';
import { SearchSimilarProductButton } from '@/components/pc/pages/ProductDetail/SearchSimilarProductButton';
import { Button } from '@/components/pc/ui/buttons';
import { QuantityField } from '@/components/pc/ui/fields';
import { Link } from '@/components/pc/ui/links';
import { OverlayLoader } from '@/components/pc/ui/loaders';
import { InformationMessage } from '@/components/pc/ui/messages/InformationMessage';
import { CurrencyProvider } from '@/components/pc/ui/text/Price';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Flag } from '@/models/api/Flag';
import ExpressType from '@/models/api/constants/ExpressType';
import {
	AlterationSpec,
	PartNumberSpecValue,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { needsQuote } from '@/utils/domain/price';
import { digit } from '@/utils/number';
import { notEmpty, notNull } from '@/utils/predicate';

export type ProductAttributes = {
	completeFlag: Flag;
	partNumber?: string;
	brandCode: string;
	minQuantity?: number;
	orderUnit?: number;
	piecesPerPackage?: number;
	content?: string;
	displayStandardPriceFlag: Flag;
	discontinuedProductFlag?: Flag;
	cautionList?: string[];
	noticeList?: string[];
	seriesCode: string;
	categoryName?: string;
	categoryCodeList: string[];
	similarSpecList: (Spec & PartNumberSpecValue)[];
};

type Props = {
	quantity: number | null;
	showsCheck: boolean;
	onChangeQuantity: (quantity: number | null) => void;
	product: ProductAttributes;
	alterationSpecEnabled?: boolean;
	alterationSpecList?: AlterationSpec[];
	isTemplateTypeSimple?: boolean;
	similarSearchEnabled?: boolean;
	price?: Price;
	loading: boolean;
	checkPrice: () => Promise<void>;
	orderNow: () => Promise<void>;
	addToCart: () => Promise<void>;
	quoteOnWOS: () => Promise<void>;
	checkout: () => Promise<void>;
	addToMyComponents: () => Promise<void>;
	focusOptionSpecs?: () => void;
	authenticated: boolean;
	isEcUser: boolean;
	isAddToCartEnabled: boolean;
	hasQuotePermission: boolean;
	hasOrderPermission: boolean;
	isPurchaseLinkUser: boolean;
	isAbleToCheckout: boolean;
	stickyEnabled?: boolean;
	actionsPanelRef?: RefObject<HTMLDivElement>;
};

/**
 * Order Actions Panel
 */
export const ActionsPanel: React.FC<Props> = ({
	quantity,
	showsCheck,
	onChangeQuantity,
	product,
	alterationSpecEnabled,
	alterationSpecList = [],
	isTemplateTypeSimple = false,
	similarSearchEnabled,
	price,
	loading,
	checkPrice,
	orderNow,
	addToCart,
	quoteOnWOS,
	checkout,
	focusOptionSpecs,
	addToMyComponents,
	authenticated,
	hasOrderPermission,
	isEcUser,
	hasQuotePermission,
	isPurchaseLinkUser,
	isAbleToCheckout,
	stickyEnabled = true,
	children,
	actionsPanelRef,
}) => {
	// refs
	const quantityFieldRef = useRef<HTMLInputElement>(null);

	// utils
	const { t } = useTranslation();

	const {
		partNumber,
		completeFlag,
		brandCode,
		similarSpecList,
		categoryName,
		categoryCodeList,
		seriesCode,
	} = product;

	const showLoginModal = useLoginModal();

	const showsPiecesPerPackage = useMemo(
		() => !!price?.piecesPerPackage || !!product.piecesPerPackage,
		[price?.piecesPerPackage, product.piecesPerPackage]
	);
	const showsStock = useMemo(
		() => price?.stockQuantity != null,
		[price?.stockQuantity]
	);
	const showsVolumeDiscountList = useMemo(
		() => !!price?.volumeDiscountList?.length,
		[price?.volumeDiscountList?.length]
	);

	// NEW_FE-2665 購買連携ユーザのうちチェックアウト可能ユーザは、見積が必要な状況でもストーク表を表示する。
	//             Checkout-enabled users among purchasing-linked users will display a stork table
	//             even in situations where a quote is required.
	const showsExpressList = useMemo(
		() =>
			!!price?.expressList?.length && (!needsQuote(price) || isAbleToCheckout),
		[isAbleToCheckout, price]
	);

	const expressList = useMemo(() => {
		// NOTE: Currently, in Malaysia, only [T0, A0, 0A, B0, C0] storks are supported.
		const expressTypeList: ExpressType[] = [
			ExpressType.ExpressTypeT0,
			ExpressType.ExpressTypeA0,
			ExpressType.ExpressType0A,
			ExpressType.ExpressTypeB0,
			ExpressType.ExpressTypeC0,
		];
		if (!price?.expressList) {
			return [];
		}

		return price.expressList
			.filter(
				item => item.expressType && expressTypeList.includes(item.expressType)
			)
			.sort((a, b) => {
				if (!a.expressType || !b.expressType) {
					return 0;
				}
				return (
					expressTypeList.indexOf(a.expressType) -
					expressTypeList.indexOf(b.expressType)
				);
			});
	}, [price]);

	const showsShippableMessage = useMemo(
		() =>
			authenticated &&
			price &&
			// 在庫あり (In stock)
			price.stockQuantity != null &&
			price.stockQuantity > 0 &&
			// 大口UFでない (Not a big order unfit)
			(price.largeOrderMaxQuantity == null ||
				price.largeOrderMaxQuantity <= 0) &&
			// 希望数量が在庫数量を超えている (Requested quantity exceeds stock quantity)
			quantity != null &&
			quantity > price.stockQuantity,
		[authenticated, price, quantity]
	);
	const showsStockDescription = useMemo(
		() => authenticated && price?.stockQuantity != null,
		[authenticated, price?.stockQuantity]
	);

	const handleCheckPrice = useCallback(
		async (event: FormEvent) => {
			event.preventDefault();
			if (showsCheck) {
				await checkPrice();
			}
		},
		[checkPrice, showsCheck]
	);

	/** click registration */
	const handleClickRegister = useCallback(
		async (event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			if ((await showLoginModal()) === 'LOGGED_IN') {
				await checkPrice();
			}
		},
		[checkPrice, showLoginModal]
	);

	const handleClickShowOptions = useCallback(() => {
		focusOptionSpecs?.();
	}, [focusOptionSpecs]);

	useOnMounted(() => {
		if (!loading) {
			quantityFieldRef.current?.focus?.();
		}
	});

	const stickyInnerActiveClass = isTemplateTypeSimple
		? styles.stickyActive
		: '';

	return (
		<CurrencyProvider ccyCode={price?.currencyCode}>
			<div className={styles.panelOuter}>
				<Sticky
					enabled={stickyEnabled}
					bottomBoundary="#productContents"
					innerClass={styles.sticky}
					innerActiveClass={stickyInnerActiveClass}
				>
					<div
						id="actionsPanel"
						className={styles.container}
						ref={actionsPanelRef}
					>
						{children}
						<div
							className={`${styles.panel} ${
								notEmpty(alterationSpecList) && styles.blinkEffect
							}`}
						>
							<PartNumberMessageList
								{...product}
								alterationSpecEnabled={alterationSpecEnabled}
								alterationSpecList={alterationSpecList}
								orderDeadline={price?.orderDeadline}
								onClickShowOptions={handleClickShowOptions}
								className={styles.messageList}
							>
								{!authenticated && notNull(price) && (
									<InformationMessage>
										<Trans i18nKey="pages.productDetail.actionsPanel.promptRegistration">
											<Link href="" onClick={handleClickRegister} />
										</Trans>
									</InformationMessage>
								)}
							</PartNumberMessageList>

							{price && (
								<PriceLeadTime
									price={price}
									isAbleToCheckout={isAbleToCheckout}
								/>
							)}

							<NeedsQuoteMessage
								price={price}
								isPurchaseLinkUser={isPurchaseLinkUser}
								className={styles.needsQuote}
								isDisabled={authenticated && !hasQuotePermission}
								quoteOnWOS={quoteOnWOS}
							/>

							<div className={styles.actionBox}>
								<ul className={styles.actionList}>
									<li>
										<Button
											type="submit"
											theme="default-sub"
											icon="add-my-component"
											disabled={
												Flag.isFalse(product.completeFlag) ||
												Flag.isTrue(product.discontinuedProductFlag)
											}
											onClick={addToMyComponents}
										>
											{t('pages.productDetail.actionsPanel.addToMyComponents')}
										</Button>
									</li>
									<li>
										{similarSearchEnabled &&
											partNumber &&
											Flag.isTrue(completeFlag) && (
												<SearchSimilarProductButton
													{...{
														similarSpecList,
														partNumber,
														categoryName,
														categoryCodeList,
														seriesCode,
														brandCode,
													}}
												/>
											)}
									</li>
								</ul>

								<div className={styles.checkPriceFormWrap}>
									<form
										className={styles.checkPriceForm}
										onSubmit={handleCheckPrice}
									>
										<div className={styles.quantity}>
											<div>
												{t('pages.productDetail.actionsPanel.quantityLabel')}
											</div>
											<QuantityField
												disabled={Flag.isFalse(product.completeFlag)}
												ref={quantityFieldRef}
												className={styles.quantityField}
												value={quantity}
												min={product.minQuantity ?? 1}
												onChange={onChangeQuantity}
											/>
											{(showsPiecesPerPackage || showsStock) && (
												<div className={styles.piecesAndStock}>
													{showsPiecesPerPackage && (
														<span>
															{t(
																'pages.productDetail.actionsPanel.piecePerPackage',
																{
																	piecesPerPackage:
																		price?.piecesPerPackage ||
																		product.piecesPerPackage,
																}
															)}
														</span>
													)}
													{showsStock && (
														<div>
															{price?.stockQuantity ?? 0 > 0 ? (
																<dd>
																	{t(
																		'pages.productDetail.actionsPanel.stockQuantity',
																		{
																			stock: price?.stockQuantity,
																		}
																	)}
																</dd>
															) : (
																<dd>
																	{t(
																		'pages.productDetail.actionsPanel.noStock'
																	)}
																</dd>
															)}
														</div>
													)}
												</div>
											)}
										</div>
										{showsCheck && (
											<div className={styles.buttonBox}>
												<Button
													type="submit"
													theme="strong"
													icon="price-check"
													// part number is incomplete
													disabled={
														Flag.isFalse(product.completeFlag) || loading
													}
												>
													{t(
														'pages.productDetail.actionsPanel.priceCheckButton'
													)}
												</Button>
											</div>
										)}
									</form>
								</div>
								<ul className={styles.conversionsWrap}>
									{isPurchaseLinkUser ? (
										isAbleToCheckout ? (
											// Disabled conditions related to the following files are not implemented in MY
											// 		/operation/emergency/order_suspend/config.json
											// 		/operation/emergency/order_suspend/data/mro.json
											<li className={styles.buttonBox}>
												<Button
													theme="conversion"
													size="s"
													onClick={checkout}
													disabled={
														Flag.isFalse(product.completeFlag) || loading
													}
													icon="order-now"
												>
													{t('pages.productDetail.checkout')}
												</Button>
											</li>
										) : null
									) : (
										<li className={styles.buttonBox}>
											<Button
												theme="conversion"
												size="s"
												onClick={orderNow}
												disabled={
													Flag.isFalse(product.completeFlag) || // part number is incomplete
													// In case of EC user, show message prompt to register payment method.
													(authenticated && !hasOrderPermission && !isEcUser) ||
													loading
												}
												icon="order-now"
											>
												{t('pages.productDetail.orderNow')}
											</Button>
										</li>
									)}
									<li className={styles.buttonBox}>
										<Button
											theme="conversion"
											size="s"
											onClick={addToCart}
											disabled={Flag.isFalse(product.completeFlag) || loading}
											icon="cart"
										>
											{t('pages.productDetail.addToCart')}
										</Button>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<OverlayLoader show={loading} returnElementRef={quantityFieldRef} />
				</Sticky>
				{price && (showsVolumeDiscountList || showsExpressList) && (
					<div className={styles.remarksContainer}>
						<div className={styles.remarks}>
							<div className={styles.tableBox}>
								{showsVolumeDiscountList && (
									<VolumeDiscountTable
										volumeDiscountList={price?.volumeDiscountList}
										currencyCode={price?.currencyCode}
										isPurchaseLinkUser={isPurchaseLinkUser}
									/>
								)}

								{showsExpressList && (
									<ExpressServiceTable expressList={expressList} />
								)}
							</div>
							<ul className={styles.shippingNotice}>
								{showsShippableMessage && (
									<li>
										{t('pages.productDetail.actionsPanel.shippable', {
											stock: digit(price.stockQuantity),
										})}
									</li>
								)}
								{showsStockDescription && (
									<li>
										{t('pages.productDetail.actionsPanel.stockDescription')}
									</li>
								)}

								<li>
									{t('pages.productDetail.actionsPanel.shippingDateWarning')}
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</CurrencyProvider>
	);
};
ActionsPanel.displayName = 'ActionsPanel';
