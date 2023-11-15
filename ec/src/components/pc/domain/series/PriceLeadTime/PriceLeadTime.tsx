import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PriceLeadTime.module.scss';
import { Link } from '@/components/pc/ui/links';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { Price } from '@/components/pc/ui/text/Price';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

export type Props = {
	series: Series;
	currencyCode?: string;
	/** Some elements are omitted in the photo view. */
	photoView?: boolean;
};
export const PriceLeadTime: React.VFC<Props> = ({
	series,
	currencyCode,
	photoView,
}) => {
	const { t } = useTranslation();

	const hasCampaign = series.minCampaignUnitPrice || series.campaignEndDate;

	const handleClickSameDayShippingGuideLink = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		openSubWindow(url.sameDayShippingGuide, 'guide', {
			width: 990,
			height: 800,
		});
	};

	return (
		<div className={styles.priceLeadTimeContainer}>
			{!!series.minStandardUnitPrice && (
				<div className={styles.priceContainer}>
					<div
						className={classNames(styles.standardPrice, {
							[String(styles.preDiscountPriceContainer)]: hasCampaign,
						})}
					>
						{!photoView && (
							<div className={styles.label}>
								{t('components.domain.series.priceLeadTime.standardPrice')}
							</div>
						)}
						<Price
							theme={hasCampaign ? 'standard' : 'medium-accent'}
							className={classNames({
								[String(styles.preDiscountPrice)]: hasCampaign,
							})}
							value={series.minStandardUnitPrice}
							ccyCode={currencyCode}
						/>
						{!!series.maxStandardUnitPrice &&
							series.minStandardUnitPrice !== series.maxStandardUnitPrice &&
							'-'}
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
											series.maxCampaignUnitPrice &&
										'-'}
								</div>
							)}
						</div>
					)}
				</div>
			)}
			{!!series.minStandardDaysToShip && (
				<div className={styles.leadTimeContainer}>
					{!photoView && (
						<div className={styles.label}>
							{t('components.domain.series.priceLeadTime.daysToShip')}
						</div>
					)}
					<div>
						{Flag.isTrue(series.discontinuedProductFlag) ? (
							<span>-</span>
						) : (
							<DaysToShip
								className={styles.leadTime}
								minDaysToShip={series.minStandardDaysToShip}
								maxDaysToShip={series.maxStandardDaysToShip}
							/>
						)}
					</div>
				</div>
			)}
			{!photoView && (
				<div className={styles.sameDayShippingGuide}>
					<Link
						href="#"
						className={styles.guideLink}
						onClick={event => handleClickSameDayShippingGuideLink(event)}
					>
						{t('components.domain.series.priceLeadTime.sameDayShippingGuide')}
					</Link>
				</div>
			)}
		</div>
	);
};
PriceLeadTime.displayName = 'PriceLeadTime';
