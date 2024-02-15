import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import styles from '../AddToCartModalMulti.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { UnitPrice } from '../UnitPrice';
import { isDiscounted, isPack } from '@/utils/domain/price';
import { useTranslation } from 'react-i18next';
import { TotalPrice } from '@/components/pc/domain/price/PriceLeadTime/TotalPrice';
import { notEmpty } from '@/utils/predicate';
import { NeedsQuoteMessage } from '@/components/pc/domain/price/NeedsQuoteMessage';
import { CartboxMessage } from '@/components/pc/domain/Cartbox/cartboxMessage';

type Props = {
	item: CartItem;
	price: Price | CartItem;
	currencyCode: string;
	isPurchaseLinkUser: boolean;
	authenticated: boolean;
	hasQuotePermission: boolean;
	imageUrl?: string;
	stockQuantity?: number;
	quoteOnWOS: (price: Price, cartItem: CartItem) => Promise<void>;
	handleClipBoardCopy: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		partNumber: string
	) => void;
};

export const AddToCartModalMultiCompareContent: React.VFC<Props> = ({
	item,
	price,
	currencyCode,
	isPurchaseLinkUser,
	authenticated,
	hasQuotePermission,
	quoteOnWOS,
	imageUrl,
	stockQuantity,
	handleClipBoardCopy,
}) => {
	const [t] = useTranslation();

	return (
		<div className={styles.productListTable}>
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
						<div className={styles.modelBody}>{item.partNumber}</div>
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
					<span className={styles.quantity}>{price.quantity}</span>
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
								{t('components.modals.addToCartModalMulti.stock', {
									stockQuantity,
								})}
							</p>
						) : (
							<p>{t('components.modals.addToCartModalMulti.notStock')}</p>
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
				</div>
			</div>
			<CartboxMessage cartItem={item} currencyCode={currencyCode} />
			{notEmpty(item.seriesCode) && price && (
				<NeedsQuoteMessage
					price={price}
					className={styles.quoteOnWos}
					isPurchaseLinkUser={isPurchaseLinkUser}
					isDisabled={authenticated && !hasQuotePermission}
					quoteOnWOS={() => quoteOnWOS(price, item)}
				/>
			)}
		</div>
	);
};
AddToCartModalMultiCompareContent.displayName =
	'AddToCartModalMultiCompareContent';
