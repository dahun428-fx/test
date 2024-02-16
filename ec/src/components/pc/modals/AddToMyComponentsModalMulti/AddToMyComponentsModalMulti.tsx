import classNames from 'classnames';
import styles from './AddToMyComponentsModalMulti.module.scss';
import legacyStyles from '@/styles/pc/legacy/modalRecommendations.module.scss';
import { Button, LinkButton } from '../../ui/buttons';
import { url } from '@/utils/url';
import { MyComponentsItem } from '@/models/api/msm/ect/myComponents/AddMyComponentsResponse';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { useTranslation } from 'react-i18next';
import { AddToCartOrMyComponentsModalMultiContentsCompare } from '../AddToCartOrMyComponentsModalMultiContents/AddToCartOrMyComponentsModalMultiContentsCompare';
import { AddToCartOrMyComponentsModalMultiContentsSimple } from '../AddToCartOrMyComponentsModalMultiContents/AddToCartOrMyComponentsModalMultiContentsSimple';
import { notEmpty } from '@/utils/predicate';
import { SeriesInfoText } from '../../domain/series/SeriesInfoText';

export type Series = {
	seriesCode: string;
	brandCode: string;
	brandName: string;
	seriesInfoText?: string[];
};

type Props = {
	series?: Series;
	myComponentsItemList: MyComponentsItem[];
	priceList: Price[];
	currencyCode: string;
	isPurchaseLinkUser: boolean;
	isEcUser: boolean;
	hasQuotePermission: boolean;
	authenticated: boolean;
	isCompare?: boolean;
	close?: () => void;
	handleClipBoardCopy: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		partNumber: string
	) => void;
};

export const AddToMyComponentsModalMulti: React.VFC<Props> = ({
	series,
	myComponentsItemList,
	priceList,
	isCompare,
	authenticated,
	currencyCode,
	hasQuotePermission,
	isEcUser,
	isPurchaseLinkUser,
	handleClipBoardCopy,
	close,
}) => {
	const [t] = useTranslation();

	return (
		<div
			className={classNames(
				styles.addToMyComponentModal,
				legacyStyles.modalRecommendations
			)}
		>
			<h3 className={styles.title}>
				{t('components.modals.addToMyComponentsModalMulti.title', {
					Len: myComponentsItemList.length,
				})}
			</h3>
			{series && notEmpty(series.seriesInfoText) && (
				<SeriesInfoText seriesInfoText={series.seriesInfoText} />
			)}
			<div className={styles.productList}>
				<div className={styles.productListHeader}>
					<div className={styles.productListTable}>
						<div className={styles.TDmodel}>
							{t('components.modals.addToMyComponentsModalMulti.partNumber')}
						</div>
						<div className={styles.TDshipDay}>
							{t('components.modals.addToMyComponentsModalMulti.shipDay')}
						</div>
						<div className={styles.TDunitPrice}>
							{t('components.modals.addToMyComponentsModalMulti.unitPrice')}
						</div>
						<div className={styles.TDquantity}>
							{t('components.modals.addToMyComponentsModalMulti.quantity')}
						</div>
						<div className={styles.TDtotal}>
							{t('components.modals.addToMyComponentsModalMulti.totalPrice')}
						</div>
						<div className={styles.TDremarks}></div>
					</div>
				</div>
				<div className={styles.productListBody}>
					{myComponentsItemList.length > 0 &&
						myComponentsItemList.map((item, index) => {
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
							className={styles.viewMyComponents}
							theme="conversion"
							size="m"
							href={url.myPage.myComponents}
						>
							{t('components.modals.addToMyComponentsModalMulti.myComponents')}
						</LinkButton>
					</li>
					<li>
						<Button className={styles.btnClose} onClick={close}>
							{t('components.modals.addToMyComponentsModalMulti.close')}
						</Button>
					</li>
				</ul>
			</div>
		</div>
	);
};

AddToMyComponentsModalMulti.displayName = 'AddToMyComponentsModalMulti';
