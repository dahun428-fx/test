import { useTranslation } from 'react-i18next';
import { CurrencyProvider } from '../../ui/text/Price';
import styles from './AddToCartModalMulti.module.scss';
import legacyStyles from '@/styles/pc/legacy/modalRecommendations.module.scss';
import classNames from 'classnames';
import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { Button, LinkButton } from '../../ui/buttons';
import { url } from '@/utils/url';
import { DaysToShip } from '../../ui/text/DaysToShip';
import { UnitPrice } from './UnitPrice';
import { notEmpty } from '@/utils/predicate';
import { NeedsQuoteMessage } from '../../domain/price/NeedsQuoteMessage';
import { TotalPrice } from '../../domain/price/PriceLeadTime/TotalPrice';
import { isDiscounted, isPack } from '@/utils/domain/price';
import { Flag } from '@/models/api/Flag';
import { SaleSlide } from '../../domain/Cartbox/saleSlide';
import { ExpressService } from '../../domain/Cartbox/expressService';
import { CartboxMessage } from '../../domain/Cartbox/cartboxMessage';
import { SeriesInfoText } from '../../domain/series/SeriesInfoText';

export type Series = {
	seriesCode: string;
	brandCode: string;
	brandName: string;
	displayStandardPriceFlag?: Flag;
	seriesInfoText?: string[];
};

type Props = {
	series?: Series;
	currencyCode: string;
	priceList: Price[];
	cartItemList: CartItem[];
	isPurchaseLinkUser: boolean;
	isAbleToCheckout: boolean;
	authenticated: boolean;
	hasQuotePermission: boolean;
	isEcUser: boolean;
	displayStandardPriceFlag?: Flag;
	quoteOnWOS: (price: Price, cartItem: CartItem) => Promise<void>;
	handleClipBoardCopy: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		partNumber: string
	) => void;
};

export const AddToCartModalMulti: React.VFC<Props> = ({
	series,
	priceList,
	currencyCode,
	cartItemList,
	isPurchaseLinkUser,
	isAbleToCheckout,
	displayStandardPriceFlag,
	authenticated,
	hasQuotePermission,
	isEcUser,
	quoteOnWOS,
	handleClipBoardCopy,
}) => {
	const [t] = useTranslation();
	return (
		<CurrencyProvider ccyCode={currencyCode}>
			<div
				className={classNames(
					legacyStyles.modalRecommendations,
					styles.addToCartModal
				)}
			>
				<h2 className={styles.title}>
					{t('components.modals.addToCartModalMulti.title', {
						Len: cartItemList.length,
					})}
				</h2>
				{series && notEmpty(series.seriesInfoText) && (
					<SeriesInfoText seriesInfoText={series.seriesInfoText} />
				)}
				<div className={styles.productList}>
					<div className={styles.productListHeader}>
						<div className={styles.productListTable}>
							<div className={styles.TDmodel}>
								{t('components.modals.addToCartModalMulti.partNumber')}
							</div>
							<div className={styles.TDshipDay}>
								{t('components.modals.addToCartModalMulti.shipDay')}
							</div>
							<div className={styles.TDunitPrice}>
								{t('components.modals.addToCartModalMulti.unitPrice')}
							</div>
							<div className={styles.TDquantity}>
								{t('components.modals.addToCartModalMulti.quantity')}
							</div>
							<div className={styles.TDtotal}>
								{t('components.modals.addToCartModalMulti.totalPrice')}
							</div>
							<div className={styles.TDremarks}></div>
						</div>
					</div>
					<div className={styles.productListBody}>
						{cartItemList.length > 0 &&
							cartItemList.map((item, index) => {
								const imageUrl = item.productImageUrl;
								const price = priceList[index] || item;
								const stockQuantity = priceList[index]?.stockQuantity;
								return (
									<div key={index} className={styles.productListTable}>
										<div className={styles.main}>
											<div className={styles.TDmodel}>
												<div className={styles.model}>
													<div className={styles.modelImg}>
														{imageUrl && (
															<ProductImage
																imageUrl={imageUrl}
																preset="t_parts_list_thum"
																comment={item.seriesCode}
																size={50}
															/>
														)}
													</div>
													<div className={styles.modelBody}>
														{item.partNumber}
													</div>
												</div>
											</div>
											<div className={styles.TDshipDay}>
												<DaysToShip minDaysToShip={item.daysToShip} />
											</div>
											<div className={styles.TDunitPrice}>
												<UnitPrice
													currencyCode={currencyCode}
													standardUnitPrice={price.standardUnitPrice}
													unitPrice={price.unitPrice}
												/>
											</div>
											<div className={styles.TDquantity}>
												<span className={styles.quantity}>
													{price.quantity}
												</span>
												{isPack(price) && (
													<p>
														{t('components.modals.addToCartModalMulti.pack', {
															piecesPerPackage: price.piecesPerPackage,
														})}
													</p>
												)}
												{stockQuantity ? (
													stockQuantity > 0 ? (
														<p>
															{t(
																'components.modals.addToCartModalMulti.stock',
																{ stockQuantity }
															)}
														</p>
													) : (
														<p>
															{t(
																'components.modals.addToCartModalMulti.notStock'
															)}
														</p>
													)
												) : (
													''
												)}
											</div>

											<div className={styles.TDtotal}>
												<TotalPrice
													totalPrice={price.totalPrice}
													discounted={isDiscounted(price)}
													currencyCode={currencyCode}
												/>
											</div>
											<div className={styles.TDremarks}>
												<a
													className={styles.icCopy}
													onClick={e => handleClipBoardCopy(e, item.partNumber)}
												>
													{t('components.modals.addToCartModalMulti.clipBoard')}
												</a>
												{notEmpty(item.expressList) && (
													<div className={styles.tableRemarks}>
														<ExpressService
															expressList={item.expressList}
															isModal={true}
														/>
													</div>
												)}
												{!isEcUser &&
													Flag.isFalse(displayStandardPriceFlag) &&
													notEmpty(item.volumeDiscountList) && (
														<div className={styles.tableRemarks}>
															<SaleSlide
																currencyCode={currencyCode}
																isModal={true}
																volumeDiscountList={item.volumeDiscountList}
															/>
														</div>
													)}
											</div>
										</div>
										{notEmpty(item.seriesCode) && price && (
											<NeedsQuoteMessage
												price={price}
												className={styles.quoteOnWos}
												isPurchaseLinkUser={isPurchaseLinkUser}
												isDisabled={authenticated && !hasQuotePermission}
												quoteOnWOS={() => quoteOnWOS(price, item)}
											/>
										)}
										<CartboxMessage
											cartItem={item}
											currencyCode={currencyCode}
										/>
									</div>
								);
							})}
					</div>
				</div>
				<div className={styles.modalFunction}>
					<ul>
						<li>
							<LinkButton
								className={styles.viewCart}
								theme="conversion"
								size="m"
								href={url.myPage.cart}
							>
								{t('components.modals.addToCartModalMulti.myCart')}
							</LinkButton>
						</li>
						<li>
							<Button className={styles.btnClose}>
								{t('components.modals.addToCartModalMulti.close')}
							</Button>
						</li>
					</ul>
				</div>
				{/* todo : recommend 추가 */}
			</div>
		</CurrencyProvider>
	);
};

AddToCartModalMulti.displayName = 'AddToCartModalMulti';
