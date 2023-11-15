import NextLink from 'next/link';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PhotoItem.module.scss';
import { PriceLeadTime } from '@/components/mobile/domain/series/PriceLeadTime';
import { SaleBadge } from '@/components/mobile/domain/series/SaleBadge';
import { SaleLabel } from '@/components/mobile/domain/series/SaleLabel';
import { SeriesDiscount } from '@/components/mobile/domain/series/SeriesDiscount';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { EconomyLabel } from '@/components/mobile/ui/labels';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getSeriesNameDisp } from '@/utils/domain/series';

type Props = {
	onClick: () => void;
	image: {
		url: string;
		comment?: string;
	};
	series: Series;
	currencyCode?: string;
	seriesUrl: string;
};

/** Photo item component */
export const PhotoItem: VFC<Props> = ({
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
			<li className={styles.listItem}>
				<div className={styles.main} onClick={onClick}>
					<div className={styles.panel}>
						<div className={styles.brandWrapper}>
							{Flag.isTrue(series.cValueFlag) && (
								<>
									<EconomyLabel
										className={styles.economyLabel}
										backgroundSize="auto"
									/>
									<SeriesDiscount pictList={series.pictList} />
								</>
							)}
						</div>
						<div className={styles.panelFixed}>
							<ProductImage
								imageUrl={image.url}
								comment={image.comment}
								preset="t_search_view_b"
								size={120}
							/>
							{series.campaignEndDate && Flag.isTrue(series.recommendFlag) && (
								<>
									<div className={styles.salesLabel}>
										<SaleLabel date={series.campaignEndDate} />
									</div>

									<div className={styles.salesIcon}>
										<SaleBadge />
									</div>
								</>
							)}
						</div>
						<div className={styles.panelFlow}>
							<p className={styles.seriesName}>
								<a
									className={styles.seriesNameLink}
									target="_blank"
									dangerouslySetInnerHTML={{ __html: seriesName }}
									onClick={onClick}
								/>
							</p>
							<p className={styles.brandItem}>{series.brandName}</p>
						</div>
					</div>
				</div>
				<PriceLeadTime series={series} currencyCode={currencyCode} photoView />
			</li>
		</NextLink>
	);
};
PhotoItem.displayName = 'PhotoItem';
