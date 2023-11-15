import classNames from 'classnames';
import { VFC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
	useRelatedPartNumber,
	useSpecInformation,
} from './RelatedPartNumberList.hooks';
import styles from './RelatedPartNumberList.module.scss';
import { UnitPrice } from './UnitPrice';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Label } from '@/components/mobile/ui/labels';
import { Link } from '@/components/mobile/ui/links';
import { DaysToShip } from '@/components/mobile/ui/text/DaysToShip';
import { config } from '@/config';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { RoHSType } from '@/models/api/constants/RoHSType';
import { PartNumber } from '@/models/api/msm/ect/relatedPartNumber/SearchRelatedPartNumberResponse';
import { pagesPath } from '@/utils/$path';
import { url } from '@/utils/url';

export type Props = {
	seriesCode: string;
	relatedLinkFrameFlag?: Flag;
	rohsFrameFlag?: Flag;
};

export const RelatedPartNumberList: VFC<Props> = ({
	seriesCode,
	relatedLinkFrameFlag,
	rohsFrameFlag,
}) => {
	const { nonStandardSpecList } = useSpecInformation();

	const {
		hasPageStandardUnitPrice,
		hasPagePiecesPerPackage,
		relatedPartNumberInfo,
	} = useRelatedPartNumber(seriesCode);

	const [t] = useTranslation();

	const partNumberPackDisp = useCallback(
		(partNumber: PartNumber) => {
			if (partNumber.piecesPerPackage && partNumber.piecesPerPackage <= 1) {
				return '';
			}
			return t('mobile.pages.productDetail.piecesPerPackage', {
				piecesPerPackage: partNumber.piecesPerPackage,
			});
		},
		[t]
	);

	const minQuantityMessage = useCallback(
		(partNumber: PartNumber) => {
			const minQuantity = partNumber.minQuantity ?? 1;
			if (partNumber.piecesPerPackage === undefined) {
				return t(
					'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.nPieces',
					{
						n: minQuantity,
					}
				);
			}
			return t(
				'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.nPacks',
				{
					n: minQuantity,
				}
			);
		},
		[t]
	);

	const volumeDiscountFlagDisp = useCallback(
		(partNumber: PartNumber) => {
			if (Flag.isTrue(partNumber.volumeDiscountFlag)) {
				return t(
					'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.available'
				);
			}
			return '';
		},
		[t]
	);

	const rohsFlagDisp = useCallback((partNumber: PartNumber) => {
		switch (partNumber.rohsFlag) {
			// TODO: make a common function to render RoHS display value
			case RoHSType.Correspondence6:
				return '6';
			case RoHSType.Correspondence10:
				return '10';
			default:
				return '-';
		}
	}, []);
	// TODO: Make this function become common method , file PartNumber.tsx
	const getSpecValueDisp = useCallback(
		(partNumber: PartNumber, specCode: string) => {
			const specValue = partNumber.specValueList.find(
				value => value.specCode === specCode
			);
			if (specValue) {
				return specValue.specValueDisp ?? '-';
			} else {
				return '-';
			}
		},
		[]
	);

	const handleClick = useCallback(() => {
		ga.ecommerce.selectItem({
			seriesCode,
			itemListName: ItemListName.PRODUCT_DETAIL,
		});
	}, [seriesCode]);

	if (!relatedPartNumberInfo || !relatedPartNumberInfo.partNumberList.length) {
		return null;
	}

	return (
		<>
			<SectionHeading>
				{t(
					'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.productsLikeThis'
				)}
			</SectionHeading>
			<div className={styles.container}>
				<div className={styles.table}>
					<table className={classNames(styles.table, styles.dataTable)}>
						<thead>
							<tr>
								<th
									className={classNames(
										styles.tableHead,
										styles.textBold,
										styles.tableCellFirstColumn
									)}
								>
									{t('mobile.pages.productDetail.partNumber')}
								</th>
								{Flag.isTrue(relatedLinkFrameFlag) && (
									<th className={styles.tableHead}>
										{t(
											'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.relatedTo'
										)}
									</th>
								)}
								{hasPageStandardUnitPrice && (
									<th className={styles.tableHead}>
										{t('mobile.pages.productDetail.standardUnitPrice')}
									</th>
								)}
								{hasPagePiecesPerPackage && (
									<th className={styles.tableHead}>
										{t(
											'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.numberOfPieces'
										)}
									</th>
								)}
								<th className={styles.tableHead}>
									{t(
										'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.minOrderQuantity'
									)}
								</th>
								<th className={styles.tableHead}>
									{t(
										'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.volumeDiscount'
									)}
								</th>
								<th className={styles.tableHead}>
									{t('mobile.pages.productDetail.daysToShip')}
								</th>
								{Flag.isTrue(rohsFrameFlag) && (
									<th className={styles.tableHead}>
										{t(
											'mobile.pages.productDetail.relatedToProductContents.relatedPartNumberList.roHS'
										)}
										<span className={styles.rohsLink}>
											<a target="_blank" href={url.rohs} rel="noreferrer">
												<span className={styles.rohsQuestion}>?</span>
											</a>
										</span>
									</th>
								)}
								{nonStandardSpecList.map(spec => {
									return (
										<th key={spec.specCode} className={styles.tableHead}>
											<span
												dangerouslySetInnerHTML={{
													__html: spec.specName,
												}}
											/>
											{spec.specUnit && (
												<>
													<br />(
													<span
														dangerouslySetInnerHTML={{
															__html: spec.specUnit ?? '',
														}}
													/>
													)
												</>
											)}
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{relatedPartNumberInfo.partNumberList.map(partNumber => (
								<tr key={partNumber.partNumber}>
									<td
										className={classNames(
											styles.tableCell,
											styles.textBold,
											styles.textLeft,
											styles.tableCellFirstColumn
										)}
									>
										<Link
											href={pagesPath.vona2.detail
												._seriesCode(seriesCode)
												.$url({
													query: {
														HissuCode: partNumber.partNumber,
														list: ItemListName.PRODUCT_DETAIL,
													},
												})}
											className={styles.partNumber}
											onClick={handleClick}
										>
											{partNumber.partNumber}
										</Link>
									</td>

									{Flag.isTrue(relatedLinkFrameFlag) && (
										<td className={styles.tableCell}>
											{partNumber.relatedLinkList.length > 0
												? partNumber.relatedLinkList.map(
														(relatedLink, index) => (
															<p key={index}>
																<a
																	href={relatedLink.relatedInfoUrl}
																	target="_blank"
																	rel="noreferrer"
																>
																	{relatedLink.relatedLinkTypeDisp ?? ''}
																</a>
															</p>
														)
												  )
												: '-'}
										</td>
									)}
									{hasPageStandardUnitPrice && (
										<td
											className={classNames(styles.tableCell, styles.dataPrice)}
										>
											<UnitPrice
												campaignEndDate={partNumber.campaignEndDate}
												campaignUnitPrice={partNumber.campaignUnitPrice}
												standardUnitPrice={partNumber.standardUnitPrice}
												currencyCode={config.defaultCurrencyCode}
											/>
										</td>
									)}
									{hasPagePiecesPerPackage && (
										<td className={styles.tableCell}>
											{partNumber.piecesPerPackage &&
												partNumber.piecesPerPackage.toString().trim().length >
													0 && (
													<Label theme="pict">
														{partNumberPackDisp(partNumber)}
													</Label>
												)}
										</td>
									)}
									<td className={styles.tableCell}>
										{minQuantityMessage(partNumber)}
									</td>
									<td className={styles.tableCell}>
										{volumeDiscountFlagDisp(partNumber)}
									</td>
									<td className={styles.tableCell}>
										<DaysToShip
											minDaysToShip={partNumber.minStandardDaysToShip}
											maxDaysToShip={partNumber.maxStandardDaysToShip}
											className={styles.daysToShip}
										/>
									</td>

									{Flag.isTrue(rohsFrameFlag) && (
										<td className={styles.tableCell}>
											{rohsFlagDisp(partNumber)}
										</td>
									)}
									{nonStandardSpecList.map(spec => {
										return (
											<td key={spec.specCode} className={styles.tableCell}>
												<span
													dangerouslySetInnerHTML={{
														__html:
															getSpecValueDisp(partNumber, spec.specCode) ?? '',
													}}
												/>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
RelatedPartNumberList.displayName = 'RelatedPartNumberList';
