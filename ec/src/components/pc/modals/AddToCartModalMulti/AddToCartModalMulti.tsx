import { useTranslation } from 'react-i18next';
import { CurrencyProvider } from '../../ui/text/Price';
import styles from './AddToCartModalMulti.module.scss';
import legacyStyles from '@/styles/pc/legacy/modalRecommendations.module.scss';
import classNames from 'classnames';
import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';
import { PriceLeadTime } from '../../domain/series/PriceLeadTime';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';

export type Series = {
	seriesCode: string;
	brandCode: string;
	brandName: string;
};

type Props = {
	currencyCode?: string;
	priceList: Price[];
	cartItemList: CartItem[];
};

export const AddToCartModalMulti: React.VFC<Props> = ({
	priceList,
	currencyCode,
	cartItemList,
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
				<h2 className={styles.title}>제품 n건을 장바구니에 추가하였습니다.</h2>

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
												111111
												{/* <PriceLeadTime
											price={item}
											isAbleToCheckout={isAbleToCheckout}
											prepend="quantity"
										/> */}
											</div>
											<div className={styles.TDunitPrice}>
												111111
												{/* {notEmpty(seriesCode) && series && (
											<NeedsQuoteMessage
												price={price}
												className={styles.quoteOnWos}
												isPurchaseLinkUser={isPurchaseLinkUser}
												isDisabled={authenticated && !hasQuotePermission}
												quoteOnWOS={() => quoteOnWOS(price)}
											/>
										)} */}
											</div>
											<div className={styles.TDquantity}>111111</div>
											<div className={styles.TDtotal}>111111111111</div>
											<div className={styles.TDremarks}>
												<a>클립보드에 형번/수량 복사</a>
												{/* <div className={styles.copyBalloon}>
													<p>수량/형번을 클립보드에 복사했습니다</p>
												</div> */}
												{/* <div className={styles.tableRemarks}>1</div>
												<div className={styles.tableDiscount}>1</div>
												<div className={styles.tableRemarks}>1</div> */}
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</CurrencyProvider>
	);
};

AddToCartModalMulti.displayName = 'AddToCartModalMulti';
