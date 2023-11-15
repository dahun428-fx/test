import NextLink from 'next/link';
import React, { VFC } from 'react';
import { UrlObject } from 'url';
import styles from './List.module.scss';
import { PriceLeadTime } from '@/components/mobile/domain/series/PriceLeadTime';
import { SaleBadge } from '@/components/mobile/domain/series/SaleBadge';
import { SaleLabel } from '@/components/mobile/domain/series/SaleLabel';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
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

/** List component */
export const List: VFC<Props> = ({
	seriesImage,
	series,
	currencyCode,
	seriesName,
	partNumberLink,
	onClick,
}) => {
	return (
		<li className={styles.tile}>
			<div className={styles.main}>
				<div className={styles.imageSide}>
					<ProductImage
						className={styles.image}
						imageUrl={seriesImage.url}
						comment={seriesImage.comment}
						preset="t_search_view_a"
						size={64}
					/>
				</div>
				<div className={styles.mainSide}>
					<div className={styles.label}>
						{/* NOTE: In case of List, do not show Economy and SaleDiscount */}
						{!!series.campaignEndDate && (
							<>
								<SaleBadge />
								<SaleLabel
									className={styles.saleLabel}
									date={series.campaignEndDate}
								/>
							</>
						)}
					</div>
					<div className={styles.textSide}>
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
								className={styles.seriesName}
								target="_blank"
								onClick={onClick}
							>
								<span dangerouslySetInnerHTML={{ __html: seriesName }} />
							</a>
						</NextLink>

						<p className={styles.brandName}>{series.brandName}</p>
					</div>
					<PriceLeadTime
						series={{ ...series, discontinuedProductFlag: Flag.FALSE }}
						currencyCode={currencyCode}
					/>
				</div>
			</div>
		</li>
	);
};

List.displayName = 'List';
