import classNames from 'classnames';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './PriceLeadTime.module.scss';
import { RecommendDaysToShip } from '@/components/mobile/domain/daysToShip';
import { SaleLabel } from '@/components/mobile/domain/series/SaleLabel';
import { Link } from '@/components/mobile/ui/links';
import { Price } from '@/components/mobile/ui/text/Price';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

export type Props = {
	series: Pick<
		Series,
		| 'minCampaignUnitPrice'
		| 'campaignEndDate'
		| 'minStandardUnitPrice'
		| 'maxStandardUnitPrice'
		| 'maxCampaignUnitPrice'
		| 'discontinuedProductFlag'
		| 'minStandardDaysToShip'
		| 'maxStandardDaysToShip'
	>;
	currencyCode?: string;
	photoView?: boolean;
	showCampaign?: boolean;
};

/** Price lead time component */
export const PriceLeadTime: React.VFC<Props> = ({
	series,
	currencyCode,
	photoView = false,
	showCampaign = false,
}) => {
	const [t] = useTranslation();
	const hasCampaign = !!series.minCampaignUnitPrice || !!series.campaignEndDate;

	const handleClickSameDayShippingGuideLink = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		openSubWindow(url.sameDayShippingGuide, 'guide');
	};

	return (
		<div className={styles.priceLeadTimeContainer}>
			{!!series.minStandardUnitPrice && (
				<div
					className={classNames({
						[String(styles.pricePhoto)]: photoView,
					})}
				>
					<div className={styles.standardPrice}>
						<Trans i18nKey="mobile.components.domain.series.priceLeadTime.from">
							<Price
								className={classNames({
									[String(styles.preDiscountPrice)]: hasCampaign,
								})}
								value={series.minStandardUnitPrice}
								ccyCode={currencyCode}
							/>
						</Trans>
						{!!series.maxStandardUnitPrice &&
							series.minStandardUnitPrice !== series.maxStandardUnitPrice &&
							'-'}
					</div>
					{hasCampaign && (
						<div className={styles.campaignPriceLabel}>
							{!!series.minCampaignUnitPrice ? (
								<>
									<Trans i18nKey="mobile.components.domain.series.priceLeadTime.specialPriceWithValue">
										<Price
											value={series.minCampaignUnitPrice}
											ccyCode={currencyCode}
										/>
									</Trans>
									{!!series.maxCampaignUnitPrice &&
										series.minCampaignUnitPrice !==
											series.maxCampaignUnitPrice &&
										'-'}
								</>
							) : (
								<Trans i18nKey="mobile.components.domain.series.priceLeadTime.specialPrice" />
							)}
						</div>
					)}
				</div>
			)}
			<div
				className={classNames({
					[String(styles.daysToShipPhoto)]: photoView,
				})}
			>
				{Flag.isTrue(series.discontinuedProductFlag) ? (
					<span>-</span>
				) : (
					notNull(series.minStandardDaysToShip) && (
						<RecommendDaysToShip
							verticalAlign="bottom"
							minDaysToShip={series.minStandardDaysToShip}
							maxDaysToShip={series.maxStandardDaysToShip}
						/>
					)
				)}
			</div>

			{showCampaign && (
				<>
					{!!series.campaignEndDate && (
						<SaleLabel
							className={styles.campaignDate}
							date={series.campaignEndDate}
						/>
					)}
					<div className={styles.sameDayShippingGuide}>
						<Link
							href={url.sameDayShippingGuide}
							className={styles.guideLink}
							onClick={event => handleClickSameDayShippingGuideLink(event)}
						>
							{t('components.domain.series.priceLeadTime.sameDayShippingGuide')}
						</Link>
					</div>
				</>
			)}
		</div>
	);
};
PriceLeadTime.displayName = 'PriceLeadTime';
