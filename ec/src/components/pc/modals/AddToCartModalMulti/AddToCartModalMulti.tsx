import { useTranslation } from 'react-i18next';
import { CurrencyProvider } from '../../ui/text/Price';
import styles from './AddToCartModalMulti.module.scss';
import legacyStyles from '@/styles/pc/legacy/modalRecommendations.module.scss';
import classNames from 'classnames';
import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { Button, LinkButton } from '../../ui/buttons';
import { url } from '@/utils/url';
import { notEmpty } from '@/utils/predicate';
import { Flag } from '@/models/api/Flag';
import { SeriesInfoText } from '../../domain/series/SeriesInfoText';
import { AddToCartOrMyComponentsModalMultiContentsCompare } from '../AddToCartOrMyComponentsModalMultiContents/AddToCartOrMyComponentsModalMultiContentsCompare';
import { AddToCartOrMyComponentsModalMultiContentsSimple } from '../AddToCartOrMyComponentsModalMultiContents/AddToCartOrMyComponentsModalMultiContentsSimple';
import { MyComponentsItem } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';

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
	authenticated: boolean;
	hasQuotePermission: boolean;
	isEcUser: boolean;
	displayStandardPriceFlag?: Flag;
	isCompare?: boolean;
	close?: () => void;
	quoteOnWOS: (
		price: Price,
		item: CartItem | MyComponentsItem
	) => Promise<void>;
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
	displayStandardPriceFlag,
	authenticated,
	hasQuotePermission,
	isEcUser,
	isCompare,
	close,
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
								if (isCompare) {
									return (
										<AddToCartOrMyComponentsModalMultiContentsCompare
											key={index}
											{...{
												authenticated,
												currencyCode,
												handleClipBoardCopy,
												imageUrl,
												stockQuantity,
												hasQuotePermission,
												isPurchaseLinkUser,
												item,
												price,
												quoteOnWOS,
											}}
										/>
									);
								} else {
									return (
										<AddToCartOrMyComponentsModalMultiContentsSimple
											key={index}
											{...{
												item,
												price,
												currencyCode,
												isPurchaseLinkUser,
												authenticated,
												hasQuotePermission,
												isEcUser,
												displayStandardPriceFlag,
												quoteOnWOS,
												imageUrl,
												stockQuantity,
												handleClipBoardCopy,
											}}
										/>
									);
								}
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
							<Button className={styles.btnClose} onClick={close}>
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
