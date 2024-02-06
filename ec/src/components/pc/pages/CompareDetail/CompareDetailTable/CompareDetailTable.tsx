import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { CompareDetail, SpecList } from '@/store/modules/pages/compareDetail';
import classNames from 'classnames';
import styles from './CompareDetailTable.module.scss';
import { Flag } from '@/models/api/Flag';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { cadTypeListDisp } from '@/utils/cad';
import { rohsFlagDisp } from '@/utils/domain/rohs';
import { UnitPrice } from '../UnitPrice';
import { NagiLink } from '@/components/pc/ui/links';
import { pagesPath } from '@/utils/$path';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { useTranslation } from 'react-i18next';
import React from 'react';

type Props = {
	specList: SpecList[];
	compareDetailItems: CompareDetail[];
	currencyCode: string;
	totalCount: number;
	selectedCompareDetailItems: Set<number>;
	searchSpecValue: (
		partNumber: PartNumber | undefined,
		specCode: string | undefined
	) => string;

	handleSelectItem: (item: number) => void;
	handleDeleteItem: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		idx: number
	) => void;
};

const LIST_MAX_COUNT = 5;

export const CompareDetailTable: React.VFC<Props> = ({
	specList,
	compareDetailItems,
	totalCount,
	currencyCode,
	selectedCompareDetailItems,
	searchSpecValue,
	handleSelectItem,
	handleDeleteItem,
}) => {
	const [t] = useTranslation();

	/**
	 * 이미지 관련 HTML 출력 함수
	 * 비교결과가 있을 경우, productImageList[0] 출력
	 * 비교결과가 없을 경우, 비어있는 <td></td> 출력
	 */
	const imageHTMLPrint = () => {
		let html = compareDetailItems.map((compareDetailItem, index) => {
			const idx = compareDetailItem.idx;
			const item = compareDetailItem.seriesList[0];
			if (!item) return;
			const productImageUrl =
				(item.productImageList && item.productImageList[0]?.url) || '';

			return (
				<td
					key={`${item.seriesCode}_${index}`}
					className={classNames(
						styles.product,
						selectedCompareDetailItems.has(idx) && styles.on
					)}
					onClick={() => handleSelectItem(idx)}
				>
					<div className={styles.tableCheckbox}></div>
					<div
						className={styles.closeBtn}
						onClick={e => handleDeleteItem(e, idx)}
					></div>
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

	/**
	 * 비교결과 Spec 관련 HTML 출력
	 * SpecList 에 해당하는 값이 Series | PartNumber 에 존재하는 경우 출력된다.
	 */
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
								{compareDetailItems.map((compareDetailItem, seriesIndex) => {
									const seriesItem = compareDetailItem.seriesList[0];
									if (!seriesItem) return;
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
								{compareDetailItems.map(
									(compareDetailItem, partNumberIndex) => {
										const partNumberItem = compareDetailItem.partNumberList[0];
										if (!partNumberItem) return;
										return (
											<td key={`price_${partNumberItem.partNumber}`}>
												{Flag.isTrue(partNumberItem.volumeDiscountFlag)
													? t('pages.compareDetail.have')
													: t('pages.compareDetail.emptySentence')}
											</td>
										);
									}
								)}
							</tr>
						);
					case '1':
						return (
							<tr key={`shipping_date_${index}`} className={className}>
								<th>{t('pages.compareDetail.shippingDate')}</th>
								{compareDetailItems.map(
									(compareDetailItem, partNumberIndex) => {
										const partNumberItem = compareDetailItem.partNumberList[0];
										if (!partNumberItem) return;
										return (
											<td key={`shipping_date_${partNumberItem.partNumber}`}>
												<DaysToShip
													minDaysToShip={partNumberItem.minStandardDaysToShip}
													maxDaysToShip={partNumberItem.maxStandardDaysToShip}
												/>
											</td>
										);
									}
								)}
							</tr>
						);
					case '2':
						return (
							<tr key={`cad_${index}`} className={className}>
								<th>{t('pages.compareDetail.cad')}</th>
								{compareDetailItems.map(
									(compareDetailItem, partNumberIndex) => {
										const partNumberItem = compareDetailItem.partNumberList[0];
										if (!partNumberItem) return;
										return (
											<td key={`cad_${partNumberItem.partNumber}`}>
												{cadTypeListDisp(partNumberItem.cadTypeList)}
											</td>
										);
									}
								)}
							</tr>
						);
					case '3':
						return (
							<tr key={`rohs_${index}`} className={className}>
								<th>{t('pages.compareDetail.rohs')}</th>
								{compareDetailItems.map(
									(compareDetailItem, partNumberIndex) => {
										const partNumberItem = compareDetailItem.partNumberList[0];
										if (!partNumberItem) return;
										return (
											<td key={`rohs_${partNumberItem.partNumber}`}>
												{rohsFlagDisp(partNumberItem.rohsFlag)}
											</td>
										);
									}
								)}
							</tr>
						);
					case '4':
						return (
							<tr key={`price_${index}`} className={className}>
								<th>{t('pages.compareDetail.price')}</th>
								{compareDetailItems.map(
									(compareDetailItem, partNumberIndex) => {
										const partNumberItem = compareDetailItem.partNumberList[0];
										if (!partNumberItem) return;
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
									}
								)}
							</tr>
						);
					default:
						break;
				}
			} else {
				return (
					<tr key={`${item.specName}_${index}`} className={className}>
						<th>{item.specName}</th>
						{compareDetailItems.map((compareDetailItem, partNumberIndex) => {
							const partNumberItem = compareDetailItem.partNumberList[0];
							if (!partNumberItem) return;
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
						{compareDetailItems.map((compareDetailItem, index) => {
							const idx = compareDetailItem.idx;
							const item = compareDetailItem.seriesList[0];
							if (!item) return;
							return (
								<td
									key={`productName_${item.seriesCode}_${index}`}
									className={classNames(
										styles.product,
										selectedCompareDetailItems.has(idx) && styles.on
									)}
									onClick={() => handleSelectItem(idx)}
								>
									<p className={styles.ndrThin}>{item.seriesName}</p>
								</td>
							);
						})}
					</tr>
					<tr>
						<th>{t('pages.compareDetail.partNumber')}</th>

						{compareDetailItems.map((compareDetailItem, index) => {
							const idx = compareDetailItem.idx;
							const item = compareDetailItem.partNumberList[0];
							const seriesItem = compareDetailItem.seriesList[0];

							if (!item) return;
							const seriesUrl = pagesPath.vona2.detail
								._seriesCode(seriesItem?.seriesCode || '')
								.$url({
									query: { HissuCode: item.partNumber },
								});

							return (
								<td
									key={`partNumber_${item.partNumber}`}
									className={classNames(
										styles.product,
										selectedCompareDetailItems.has(idx) && styles.on
									)}
									onClick={() => handleSelectItem(idx)}
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
