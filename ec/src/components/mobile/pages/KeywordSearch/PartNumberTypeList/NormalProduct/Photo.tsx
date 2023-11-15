import NextLink from 'next/link';
import React from 'react';
import { UrlObject } from 'url';
import styles from './Photo.module.scss';
import { PriceLeadTime } from '@/components/mobile/domain/series/PriceLeadTime';
import { SaleBadge } from '@/components/mobile/domain/series/SaleBadge';
import { SaleLabel } from '@/components/mobile/domain/series/SaleLabel';
import { SeriesDiscount } from '@/components/mobile/domain/series/SeriesDiscount';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { EconomyLabel } from '@/components/mobile/ui/labels';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	seriesImage: {
		url: string;
		comment?: string;
	};
	seriesName: string;
	series: Series;
	currencyCode?: string;
	partNumberLink: string | UrlObject;
	onClick: () => void;
};

/** Photo component */
export const Photo: React.VFC<Props> = ({
	series,
	currencyCode,
	seriesImage,
	seriesName,
	partNumberLink,
	onClick,
}) => {
	return (
		<li className={styles.listItem}>
			<div className={styles.main}>
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
							imageUrl={seriesImage.url}
							comment={seriesImage.comment}
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
						<NextLink href={partNumberLink}>
							<a
								className={styles.partNumberLink}
								target="_blank"
								onClick={onClick}
							>
								{series.partNumber}
							</a>
						</NextLink>
						<NextLink href={partNumberLink}>
							<a
								className={styles.seriesNameLink}
								target="_blank"
								dangerouslySetInnerHTML={{ __html: seriesName }}
								onClick={onClick}
							/>
						</NextLink>

						<p className={styles.brandItem}>{series.brandName}</p>
					</div>
				</div>
			</div>
			<PriceLeadTime
				series={{ ...series, discontinuedProductFlag: Flag.FALSE }}
				currencyCode={currencyCode}
				photoView
			/>
		</li>
	);
};

Photo.displayName = 'Photo';
