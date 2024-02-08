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

export type Series = {
	seriesCode: string;
	brandCode: string;
	brandName: string;
	displayStandardPriceFlag?: Flag;
};

type Props = {
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
	console.log('cartItemList ===> ', cartItemList);
	return (
		<CurrencyProvider ccyCode={currencyCode}>
			<div
				className={classNames(
					legacyStyles.modalRecommendations,
					styles.addToCartModal
				)}
			>
				<h2 className={styles.title}>
					제품 {cartItemList.length}건을 장바구니에 추가하였습니다.
				</h2>

				<div className={styles.productList}>
					<div className={styles.productListHeader}>
						<div className={styles.productListTable}>
							<div className={styles.TDmodel}>형번</div>
							<div className={styles.TDshipDay}>출하일</div>
							<div className={styles.TDunitPrice}>단가</div>
							<div className={styles.TDquantity}>수량</div>
							<div className={styles.TDtotal}>합계(VAT별도)</div>
							<div className={styles.TDremarks}></div>
						</div>
					</div>
					<div className={styles.productListBody}>
						{cartItemList.length > 0 &&
							cartItemList.map((item, index) => {
								console.log('item ===> ', item);
								const imageUrl = item.productImageUrl;
								const price = priceList[index] || item;

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
												{isPack(price) && <p>({price.piecesPerPackage}개입)</p>}
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
													클립보드에 형번/수량 복사
												</a>
												{notEmpty(item.expressList) && (
													<div className={styles.tableRemarks}>
														<ExpressService expressList={item.expressList} />
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
												// isPurchaseLinkUser={isPurchaseLinkUser}
												isPurchaseLinkUser={false}
												isDisabled={authenticated && !hasQuotePermission}
												quoteOnWOS={() => quoteOnWOS(price, item)}
											/>
										)}

										{/* {notEmpty(item.orderDeadline) && ( */}
										<CartboxMessage
											cartItem={item}
											currencyCode={currencyCode}
										/>
										{/* )}
										{item.lowVolumeCharge && (
											<div className={styles.error}>
												<div className={styles.errorText}>
													<p className={styles.info}></p>
												</div>
											</div>
										)} */}
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
								장바구니 보기
							</LinkButton>
						</li>
						<li>
							<Button className={styles.btnClose}>닫기</Button>
						</li>
					</ul>
				</div>
			</div>
		</CurrencyProvider>
	);
};

AddToCartModalMulti.displayName = 'AddToCartModalMulti';
