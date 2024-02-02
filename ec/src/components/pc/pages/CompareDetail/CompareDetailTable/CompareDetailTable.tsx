import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SpecListType } from '@/store/modules/pages/compareDetail';
import classNames from 'classnames';
import styles from './CompareDetailTable.module.scss';
import { Flag } from '@/models/api/Flag';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { cadTypeListDisp } from '@/utils/cad';
import { rohsFlagDisp } from '@/utils/domain/rohs';
import { UnitPrice } from '../UnitPrice';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { NagiLink } from '@/components/pc/ui/links';
import { pagesPath } from '@/utils/$path';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { useTranslation } from 'react-i18next';
import { useCallback, useRef, useState } from 'react';

type Props = {
	specList: SpecListType[];
	partNumberList: PartNumber[];
	seriesList: Series[];
	currencyCode: string;
	totalCount: number;
	selectedCompareDetailItems: Set<number>;
	searchSpecValue: (
		partNumber: PartNumber | undefined,
		specCode: string | undefined
	) => string;
	setCompareList: (
		index?: number,
		seriesCode?: string | null,
		partNumber?: string | null
	) => void;
	handleSelectItem: (item: number) => void;
	handleDeleteItem: (item: number) => void;
};

const LIST_MAX_COUNT = 5;

export const CompareDetailTable: React.VFC<Props> = ({
	partNumberList,
	seriesList,
	specList,
	totalCount,
	currencyCode,
	selectedCompareDetailItems,
	searchSpecValue,
	setCompareList,
	handleSelectItem,
}) => {
	const [t] = useTranslation();

	const imageHTMLPrint = () => {
		let html = seriesList.map((item, index) => {
			const productImageUrl = item.productImageList[0]?.url || '';

			return (
				<td
					key={`${item.seriesCode}_${index}`}
					className={classNames(
						styles.product,
						selectedCompareDetailItems.has(index) && styles.on
					)}
					// onClick={e => onClickHandler(e)}
					onClick={() => handleSelectItem(index)}
				>
					<div className={styles.tableCheckbox}></div>
					<div className={styles.closeBtn}></div>
					<div className={styles.tableImg}>
						<ProductImage
							imageUrl={productImageUrl}
							preset="t_product_main"
							comment={item.seriesName}
						/>
					</div>
				</td>
			);
		});
		if (LIST_MAX_COUNT > totalCount) {
			const remainCount = LIST_MAX_COUNT - totalCount;
			const rowSpan = specList.length + 3;
			for (let i = 0; i < remainCount; i++) {
				html.push(
					<td
						key={`empty_${i}`}
						className={styles.product}
						rowSpan={rowSpan}
					></td>
				);
			}
		}
		return html;
	};
	const specHtmlPrint = () => {
		return specList.map((item, index) => {
			const { diffTypeCode, specTypeCode } = item;
			const isDiffRow = diffTypeCode % 2 !== 0;
			const className = classNames(isDiffRow && styles.tableDiffRow);
			if (diffTypeCode > 2) {
				switch (specTypeCode) {
					case '9':
						return (
							<tr key={`brand_${index}`} className={className}>
								<th>{t('pages.compareDetail.brand')}</th>
								{seriesList.map((seriesItem, seriesIndex) => {
									return (
										<td key={`brand_${seriesItem.seriesCode}_${seriesIndex}`}>
											{seriesItem.brandName}
										</td>
									);
								})}
							</tr>
						);
					case '0':
						return (
							<tr key={`price_${index}`} className={className}>
								<th>{t('pages.compareDetail.discount')}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`price_${partNumberItem.partNumber}`}>
											{Flag.isTrue(partNumberItem.volumeDiscountFlag)
												? t('pages.compareDetail.have')
												: t('pages.compareDetail.emptySentence')}
										</td>
									);
								})}
							</tr>
						);
					case '1':
						return (
							<tr key={`shipping_date_${index}`} className={className}>
								<th>{t('pages.compareDetail.shippingDate')}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`shipping_date_${partNumberItem.partNumber}`}>
											<DaysToShip
												minDaysToShip={partNumberItem.minStandardDaysToShip}
												maxDaysToShip={partNumberItem.maxStandardDaysToShip}
											/>
										</td>
									);
								})}
							</tr>
						);
					case '2':
						return (
							<tr key={`cad_${index}`} className={className}>
								<th>{t('pages.compareDetail.cad')}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`cad_${partNumberItem.partNumber}`}>
											{cadTypeListDisp(partNumberItem.cadTypeList)}
										</td>
									);
								})}
							</tr>
						);
					case '3':
						return (
							<tr key={`rohs_${index}`} className={className}>
								<th>{t('pages.compareDetail.rohs')}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`rohs_${partNumberItem.partNumber}`}>
											{rohsFlagDisp(partNumberItem.rohsFlag)}
										</td>
									);
								})}
							</tr>
						);
					case '4':
						return (
							<tr key={`price_${index}`} className={className}>
								<th>{t('pages.compareDetail.price')}</th>
								{partNumberList.map((partNumberItem, partNumberIndex) => {
									return (
										<td key={`price_${partNumberItem.partNumber}`}>
											<UnitPrice
												campaignEndDate={partNumberItem.campaignEndDate}
												campaignUnitPrice={partNumberItem.campaignUnitPrice}
												currencyCode={currencyCode}
												standardUnitPrice={partNumberItem.standardUnitPrice}
											/>
										</td>
									);
								})}
							</tr>
						);
					default:
						break;
				}
			} else {
				return (
					<tr key={`${item.specName}_${index}`} className={className}>
						<th>{item.specName}</th>
						{partNumberList.map((partNumberItem, partNumberIndex) => {
							return (
								<td key={`${item.specName}_${partNumberItem.partNumber}`}>
									{searchSpecValue(partNumberItem, item.specCode)}
								</td>
							);
						})}
					</tr>
				);
			}
		});
	};

	return (
		<div className={styles.compareTable}>
			<table className={styles.tableInfo}>
				<colgroup>
					<col />
					<col />
					<col />
					<col />
					<col />
					<col />
				</colgroup>
				<tbody>
					<tr>
						<th>{t('pages.compareDetail.image')}</th>
						{imageHTMLPrint()}
					</tr>
					<tr>
						<th>{t('pages.compareDetail.productName')}</th>
						{seriesList.map((item, index) => {
							setCompareList(index, item.seriesCode, null);
							return (
								<td
									key={`productName_${item.seriesCode}_${index}`}
									className={classNames(
										styles.product,
										selectedCompareDetailItems.has(index) && styles.on
									)}
									onClick={() => handleSelectItem(index)}
								>
									<p className={styles.ndrThin}>{item.seriesName}</p>
								</td>
							);
						})}
					</tr>
					<tr>
						<th>{t('pages.compareDetail.partNumber')}</th>

						{partNumberList.map((item, index) => {
							const seriesUrl = pagesPath.vona2.detail
								._seriesCode(seriesList[index]?.seriesCode || '')
								.$url({
									query: { HissuCode: item.partNumber },
								});
							setCompareList(index, null, item.partNumber);
							return (
								<td
									key={`partNumber_${item.partNumber}`}
									className={classNames(
										styles.product,
										selectedCompareDetailItems.has(index) && styles.on
									)}
									onClick={() => handleSelectItem(index)}
								>
									<NagiLink href={seriesUrl}>
										<p
											className={classNames(
												styles.ndrThin,
												styles.productType,
												styles.productTypeNewWindow
											)}
										>
											{item.partNumber}
										</p>
									</NagiLink>
								</td>
							);
						})}
					</tr>
					{specHtmlPrint()}
				</tbody>
			</table>
		</div>
	);
};
CompareDetailTable.displayName = 'CompareDetailTable';
