import NextLink from 'next/link';
import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ListItem.module.scss';
import { PriceLeadTime } from '@/components/mobile/domain/series/PriceLeadTime';
import { SaleBadge } from '@/components/mobile/domain/series/SaleBadge';
import { SeriesDiscount } from '@/components/mobile/domain/series/SeriesDiscount';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { EconomyLabel } from '@/components/mobile/ui/labels';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getSeriesNameDisp } from '@/utils/domain/series';

type Props = {
	image: {
		url: string;
		comment?: string;
	};
	series: Series;
	currencyCode?: string;
	seriesUrl: string;
	onClick: () => void;
};

/** List item component */
export const ListItem: VFC<Props> = ({
	image,
	series,
	currencyCode,
	seriesUrl,
	onClick,
}) => {
	const [t] = useTranslation();
	const seriesName = useMemo(() => {
		if (Flag.isTrue(series.packageSpecFlag)) {
			return series.seriesName;
		}

		return getSeriesNameDisp(series, t);
	}, [series, t]);

	return (
		<NextLink href={seriesUrl}>
			<li className={styles.tile} onClick={onClick}>
				<div className={styles.main}>
					<div className={styles.imageSide}>
						<ProductImage
							className={styles.image}
							imageUrl={image.url}
							comment={image.comment}
							preset="t_search_view_a"
							size={64}
						/>
					</div>
					<div className={styles.mainSide}>
						<div className={styles.labelWrapper}>
							<div className={styles.label}>
								{Flag.isTrue(series.cValueFlag) && (
									<EconomyLabel className={styles.inlineItem} />
								)}
								<SeriesDiscount pictList={series.pictList} />
							</div>
							{!!series.campaignEndDate && <SaleBadge />}
						</div>
						<div className={styles.textSide}>
							<p className={styles.seriesName}>
								<a
									className={styles.seriesName}
									target="_blank"
									onClick={onClick}
								>
									<span dangerouslySetInnerHTML={{ __html: seriesName }} />
								</a>
							</p>
							<p className={styles.brandName}>{series.brandName}</p>
						</div>
						<PriceLeadTime
							showCampaign
							series={series}
							currencyCode={currencyCode}
						/>
					</div>
				</div>
			</li>
		</NextLink>
	);
};
