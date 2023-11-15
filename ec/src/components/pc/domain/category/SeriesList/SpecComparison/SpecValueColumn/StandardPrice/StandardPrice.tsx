import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StandardPrice.module.scss';
import { Price } from '@/components/pc/ui/text/Price';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

type Props = {
	series: Series;
	currencyCode?: string;
};

const PRICE_VALUE_FALLBACK = '-';

/** Standard price component */
export const StandardPrice: React.VFC<Props> = ({ series, currencyCode }) => {
	const { t } = useTranslation();

	const hasCampaign = series.minCampaignUnitPrice || series.campaignEndDate;

	if (!series.minStandardUnitPrice) {
		return <span>{PRICE_VALUE_FALLBACK}</span>;
	}

	return (
		<div>
			<div className={styles.priceContainer}>
				<div
					className={classNames(styles.standardPrice, {
						[String(styles.preDiscountPriceContainer)]: hasCampaign,
					})}
				>
					<Price
						theme={hasCampaign ? 'standard' : 'medium-accent'}
						className={classNames({
							[String(styles.preDiscountPrice)]: hasCampaign,
						})}
						value={series.minStandardUnitPrice}
						ccyCode={currencyCode}
					/>
					{!!series.maxStandardUnitPrice &&
						series.minStandardUnitPrice !== series.maxStandardUnitPrice && (
							<span className={styles.fallbackPrice}>
								{PRICE_VALUE_FALLBACK}
							</span>
						)}
				</div>
				{hasCampaign && (
					<div>
						<div className={styles.campaignPriceLabel}>
							{t('components.domain.series.priceLeadTime.specialPrice')}
						</div>
						{!!series.minCampaignUnitPrice && (
							<div className={styles.campaignPrice}>
								<Price
									value={series.minCampaignUnitPrice}
									ccyCode={currencyCode}
									theme="medium-accent"
									isRed
								/>
								{!!series.maxCampaignUnitPrice &&
									series.minCampaignUnitPrice !==
										series.maxCampaignUnitPrice && (
										<span className={styles.fallbackPrice}>
											{PRICE_VALUE_FALLBACK}
										</span>
									)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
StandardPrice.displayName = 'StandardPrice';
