import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StandardPrice.module.scss';
import { DaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { Price } from '@/components/pc/ui/text/Price';

type Props = {
	// discount
	minCampaignUnitPrice?: number;
	maxCampaignUnitPrice?: number;
	campaignEndDate?: string;
	// standard price
	minStandardUnitPrice?: number;
	maxStandardUnitPrice?: number;
	// lead time
	minStandardDaysToShip?: number;
	maxStandardDaysToShip?: number;
};

export const PriceLeadTime: React.VFC<Props> = ({
	minCampaignUnitPrice,
	maxCampaignUnitPrice = minCampaignUnitPrice,
	campaignEndDate,
	minStandardUnitPrice,
	maxStandardUnitPrice = minStandardUnitPrice,
	minStandardDaysToShip,
	maxStandardDaysToShip = minStandardDaysToShip,
}) => {
	const { t } = useTranslation();

	const discounted = minCampaignUnitPrice != null || campaignEndDate != null;

	return (
		<table>
			<tbody>
				{minStandardUnitPrice && (
					<tr>
						<td>{t('pages.keywordSearch.partNumberTypeList.standardPrice')}</td>
						<td>
							<Price
								value={minStandardUnitPrice}
								theme="medium-accent"
								strike={discounted}
							/>
							{minStandardUnitPrice === maxStandardUnitPrice ?? '~'}
						</td>
					</tr>
				)}

				{discounted && (
					<tr className={styles.discount}>
						<td>
							{t('pages.keywordSearch.partNumberTypeList.specialPrice')}
							{minCampaignUnitPrice && ':'}
						</td>
						{minCampaignUnitPrice && (
							<td>
								<Price
									value={minCampaignUnitPrice}
									theme="medium-accent"
									isRed
								/>
								{minCampaignUnitPrice === maxCampaignUnitPrice ?? '~'}
							</td>
						)}
					</tr>
				)}
				<tr>
					<td>{t('pages.keywordSearch.partNumberTypeList.daysToShip')}</td>
					<td>
						<DaysToShip
							minDaysToShip={minStandardDaysToShip}
							maxDaysToShip={maxStandardDaysToShip}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
};
PriceLeadTime.displayName = 'PriceLeadTime';
