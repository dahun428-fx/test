import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	useInterestRecommend,
	HEADER_WIDTH,
	RECOMMEND_ITEM_WIDTH,
} from './InterestRecommend.hooks';
import styles from './InterestRecommend.module.scss';
import { SectionHeading } from '@/components/pc/ui/headings/SectionHeading';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { pagesPath } from '@/utils/$path';
import { notEmpty } from '@/utils/predicate';

type Props = {
	seriesCode: string;
};

const HEADER_STYLE = { width: HEADER_WIDTH };
const RECOMMEND_ITEM_STYLE = { width: RECOMMEND_ITEM_WIDTH };

export const InterestRecommend: React.VFC<Props> = () => {
	const [t] = useTranslation();

	const {
		series,
		recommendListPerPage,
		totalPageCount,
		changePage,
		currencyCode,
		onLoadImage,
		onClickItem,
	} = useInterestRecommend();

	const [isHoverIndex, setIsHoverIndex] = useState(-1);

	useEffect(() => {
		if (recommendListPerPage.length) {
			ga.ecommerce.viewItemList(
				recommendListPerPage.map(({ seriesCode }) => ({
					seriesCode,
					itemListName: ItemListName.INTEREST_RECOMMEND,
				}))
			);
		}
	}, [recommendListPerPage]);

	if (!notEmpty(recommendListPerPage)) {
		return null;
	}

	return (
		<>
			<SectionHeading>
				{t('pages.productDetail.interestRecommend.title')}
			</SectionHeading>

			<div className={styles.interestRecommendWrapper}>
				{totalPageCount > 1 && (
					<button
						aria-label="back"
						className={classNames(styles.button, styles.buttonLeft)}
						onClick={() => changePage('prev')}
					/>
				)}
				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<tbody>
							<tr>
								<th className={styles.tableHeader} style={HEADER_STYLE} />
								<td
									className={styles.tableHeaderCellWithRelative}
									style={RECOMMEND_ITEM_STYLE}
								>
									<span className={styles.lookingNowItem}>
										{t('pages.productDetail.interestRecommend.lookingNow')}
									</span>
									<div className={styles.itemImageBox}>
										<ProductImage
											imageUrl={series.productImageList[0]?.url}
											size={100}
											preset="t_product_recommend_b"
										/>
									</div>
									<span
										className={styles.lookingNowItemName}
										dangerouslySetInnerHTML={{ __html: series.seriesName }}
									/>
								</td>
								{recommendListPerPage.map((item, index) => (
									<td
										key={item.seriesCode}
										style={RECOMMEND_ITEM_STYLE}
										className={classNames(styles.tableHeaderCell, {
											[String(styles.isHover)]: index === isHoverIndex,
										})}
									>
										<div className={styles.itemImageBox}>
											<ProductImage
												imageUrl={item.imgUrl}
												size={100}
												preset="t_product_recommend_b"
												onLoad={() => onLoadImage(item)}
											/>
										</div>
										<span
											className={classNames(
												styles.itemName,
												index === isHoverIndex && styles.itemNameHover
											)}
											dangerouslySetInnerHTML={{ __html: item.seriesName }}
										/>
										<Link
											href={pagesPath.vona2.detail
												._seriesCode(item.seriesCode)
												.$url({
													query: {
														rid: `rid3_detail_${item.position}_${item.seriesCode}`,
														list: ItemListName.INTEREST_RECOMMEND,
													},
												})}
											className={styles.itemLink}
											style={{ width: RECOMMEND_ITEM_WIDTH }}
											onMouseEnter={() => setIsHoverIndex(index)}
											onMouseLeave={() => setIsHoverIndex(-1)}
											onClick={() => {
												ga.ecommerce.selectItem({
													seriesCode: item.seriesCode,
													itemListName: ItemListName.INTEREST_RECOMMEND,
												});
												onClickItem(item);
											}}
										/>
									</td>
								))}
							</tr>
							<tr>
								<th className={styles.tableHeader}>
									{t('pages.productDetail.interestRecommend.marker')}
								</th>
								<td
									className={classNames(styles.item, styles.lookingNowItemCell)}
								>
									{series.brandName}
								</td>
								{recommendListPerPage.map((item, index) => {
									return (
										<td
											key={index}
											className={classNames(styles.item, {
												[String(styles.isHover)]: index === isHoverIndex,
											})}
										>
											{item.brandName}
										</td>
									);
								})}
							</tr>
							<tr>
								<th className={styles.tableHeader}>
									{t('pages.productDetail.interestRecommend.priceTitle')}
								</th>
								<td
									className={classNames(styles.item, styles.lookingNowItemCell)}
								>
									<StandardPrice
										minStandardUnitPrice={series.minStandardUnitPrice}
										maxStandardUnitPrice={series.maxStandardUnitPrice}
										ccyCode={currencyCode}
										suffix="-"
									/>
								</td>
								{recommendListPerPage.map((item, index) => {
									return (
										<td
											key={item.seriesCode}
											className={classNames(styles.item, {
												[String(styles.isHover)]: index === isHoverIndex,
											})}
										>
											<StandardPrice
												minStandardUnitPrice={Number(item.minStandardUnitPrice)}
												maxStandardUnitPrice={Number(item.maxStandardUnitPrice)}
												ccyCode={item.currencyCode}
											/>
										</td>
									);
								})}
							</tr>
							<tr>
								<th className={styles.tableHeader}>
									{t('pages.productDetail.interestRecommend.shipTitle')}
								</th>
								<td
									className={classNames(styles.item, styles.lookingNowItemCell)}
								>
									<DaysToShip
										minDaysToShip={series.minStandardDaysToShip}
										maxDaysToShip={series.maxStandardDaysToShip}
									/>
								</td>
								{recommendListPerPage.map((item, index) => {
									return (
										<td
											key={item.seriesCode}
											className={classNames(styles.item, {
												[String(styles.isHover)]: index === isHoverIndex,
											})}
										>
											<DaysToShip
												minDaysToShip={Number(item.minStandardDaysToShip)}
												maxDaysToShip={Number(item.maxStandardDaysToShip)}
											/>
										</td>
									);
								})}
							</tr>
						</tbody>
					</table>
				</div>
				{totalPageCount > 1 && (
					<button
						aria-label="next"
						className={classNames(styles.button, styles.buttonRight)}
						onClick={() => changePage('next')}
					/>
				)}
			</div>
		</>
	);
};
InterestRecommend.displayName = `InterestRecommend`;
