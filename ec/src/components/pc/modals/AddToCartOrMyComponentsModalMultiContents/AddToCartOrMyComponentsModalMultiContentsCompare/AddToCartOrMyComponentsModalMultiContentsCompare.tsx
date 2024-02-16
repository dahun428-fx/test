import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import styles from './AddToCartOrMyComponentsModalMultiContentsCompare.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { UnitPrice } from '../../AddToCartModalMulti/UnitPrice';
import { isDiscounted, isPack } from '@/utils/domain/price';
import { useTranslation } from 'react-i18next';
import { TotalPrice } from '@/components/pc/domain/price/PriceLeadTime/TotalPrice';
import { notEmpty, notNull } from '@/utils/predicate';
import { NeedsQuoteMessage } from '@/components/pc/domain/price/NeedsQuoteMessage';
import { CartboxMessage } from '@/components/pc/domain/Cartbox/cartboxMessage';
import { MyComponentsItem } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';

type Props = {
	item: CartItem | MyComponentsItem;
	price: Price | CartItem | MyComponentsItem;
	currencyCode: string;
	isPurchaseLinkUser: boolean;
	authenticated: boolean;
	hasQuotePermission: boolean;
	imageUrl?: string;
	stockQuantity?: number;
	quoteOnWOS?: (
		price: Price,
		item: CartItem | MyComponentsItem
	) => Promise<void>;
	handleClipBoardCopy: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		partNumber: string
	) => void;
};

export const AddToCartOrMyComponentsModalMultiContentsCompare: React.VFC<
	Props
> = ({
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
	const adjustPrice = {
		...price,
		piecesPerPackage: Number(price.piecesPerPackage),
	};
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
					{isPack(adjustPrice) && (
						<p>
							{t('components.modals.addToCartModalMulti.pack', {
								piecesPerPackage: adjustPrice.piecesPerPackage,
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
			<CartboxMessage item={item} currencyCode={currencyCode} />
			{notEmpty(item.seriesCode) && price && quoteOnWOS && (
				<NeedsQuoteMessage
					price={price}
					className={styles.quoteOnWos}
					isPurchaseLinkUser={isPurchaseLinkUser}
					isDisabled={authenticated && !hasQuotePermission}
					quoteOnWOS={() => quoteOnWOS(adjustPrice, item)}
				/>
			)}
		</div>
	);
};
AddToCartOrMyComponentsModalMultiContentsCompare.displayName =
	'AddToCartOrMyComponentsModalMultiContentsCompare';
