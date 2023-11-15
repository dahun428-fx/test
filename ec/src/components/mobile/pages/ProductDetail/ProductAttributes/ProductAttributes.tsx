import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductAttributes.module.scss';
import { BrandCategory } from '@/components/mobile/pages/ProductDetail/BrandCategory';
import { PageHeading } from '@/components/mobile/pages/ProductDetail/PageHeading';
import { ProductImagePanel } from '@/components/mobile/pages/ProductDetail/ProductImagePanel';
import { ProductLabels } from '@/components/mobile/pages/ProductDetail/ProductLabels';
import { EconomyLabel, SaleLabel } from '@/components/mobile/ui/labels';
import { Price, StandardPrice } from '@/components/mobile/ui/text/Price';
import { Flag } from '@/models/api/Flag';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { getSeriesNameDisp } from '@/utils/domain/series';

type Props = {
	series: Series;
	currencyCode?: string;
	totalCount: number;
	partNumberList: PartNumber[];
	className?: string;
};

/**
 * Product attributes on Product Detail
 */
export const ProductAttributes: React.VFC<Props> = ({
	series,
	currencyCode,
	totalCount,
	partNumberList,
}) => {
	const [t] = useTranslation();
	const seriesNameDisp = getSeriesNameDisp(series, t);

	const hasCampaignPrice =
		!!series.campaignEndDate || !!series.minCampaignUnitPrice;

	const hasCampaignPriceRange =
		hasCampaignPrice &&
		!!series.minCampaignUnitPrice &&
		!!series.maxCampaignUnitPrice &&
		series.minCampaignUnitPrice !== series.maxCampaignUnitPrice;

	return (
		<div className={styles.attributesPanel}>
			{series.campaignEndDate && (
				<div className={styles.sale}>
					<SaleLabel />
				</div>
			)}
			<ProductImagePanel
				seriesName={seriesNameDisp}
				productImageList={series.productImageList}
			/>
			<ProductLabels
				iconTypeList={series.iconTypeList}
				campaignEndDate={series.campaignEndDate}
				className={styles.labels}
			/>
			<PageHeading
				className={styles.heading}
				series={series}
				partNumberList={partNumberList}
			/>
			<div className={styles.brandWrap}>
				<BrandCategory
					brandName={series.brandName}
					brandCode={series.brandCode}
					brandUrlCode={series.brandUrlCode}
					categoryList={series.categoryList}
					categoryCode={series.categoryCode}
					categoryName={series.categoryName}
				/>
				{Flag.isTrue(series.cValueFlag) && (
					<div className={styles.economyLabelBox}>
						<EconomyLabel />
					</div>
				)}
			</div>
			{totalCount !== 1 && (
				<div className={styles.standardPrice}>
					<span className={styles.standardPriceLabel}>
						{t(
							'mobile.pages.productDetail.productAttributes.standardUnitPrice'
						)}
					</span>
					{((hasCampaignPrice && series.minStandardUnitPrice) ||
						!hasCampaignPrice) && (
						<StandardPrice
							minStandardUnitPrice={series.minStandardUnitPrice}
							maxStandardUnitPrice={series.maxStandardUnitPrice}
							ccyCode={currencyCode}
							suffix=""
							theme="accent"
							className={classNames({
								[String(styles.strike)]: hasCampaignPrice,
							})}
						/>
					)}
					{hasCampaignPrice &&
						(series.minCampaignUnitPrice ? (
							<span className={styles.specialPrice}>
								<Price
									value={series.minCampaignUnitPrice}
									ccyCode={currencyCode}
									className={styles.isRed}
								/>
								{hasCampaignPriceRange && <span>-</span>}
							</span>
						) : (
							<span className={styles.specialPrice}>
								{t('mobile.pages.productDetail.productAttributes.specialPrice')}
							</span>
						))}
				</div>
			)}
		</div>
	);
};
ProductAttributes.displayName = 'ProductAttributes';
