import NextLink from 'next/link';
import { MouseEvent, useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { UrlObject } from 'url';
import styles from './PhotoItem.module.scss';
import { SeriesLabels } from '@/components/pc/domain/category/SeriesList/SeriesLabels';
import { PriceLeadTime } from '@/components/pc/domain/series/PriceLeadTime';
import { SeriesDiscount } from '@/components/pc/domain/series/SeriesDiscount';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { EconomyLabel } from '@/components/pc/ui/labels';
import { Link } from '@/components/pc/ui/links';
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
	isCValueProduct: boolean;
	seriesUrl: string;
	linkUrlForCadType: (cadType?: string) => UrlObject;
	onClick: (event: MouseEvent) => void;
};

/** Photo item component */
export const PhotoItem: VFC<Props> = ({
	image,
	series,
	currencyCode,
	isCValueProduct,
	seriesUrl,
	linkUrlForCadType,
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
		<li className={styles.listItem}>
			<div className={styles.wrapper} onClick={onClick}>
				<div className={styles.main}>
					<div className={styles.panel}>
						<div className={styles.panelFixed}>
							<ProductImage
								imageUrl={image.url}
								comment={image.comment}
								preset="t_search_view_b"
								size={150}
							/>
						</div>
						<div className={styles.panelFlow}>
							<div className={styles.brandWrapper}>
								<span className={styles.brandItem}>{series.brandName}</span>
								{isCValueProduct && (
									<>
										<EconomyLabel className={styles.brandItem} />
										<SeriesDiscount pictList={series.pictList} />
									</>
								)}
							</div>
							<p className={styles.seriesName}>
								<NextLink href={seriesUrl}>
									<a className={styles.seriesNameLink} target="_blank">
										<span dangerouslySetInnerHTML={{ __html: seriesName }} />
									</a>
								</NextLink>
							</p>
							<div className={styles.seriesLabels}>
								<SeriesLabels
									recommendFlag={series.recommendFlag}
									gradeTypeDisp={series.gradeTypeDisp}
									campaignEndDate={series.campaignEndDate}
									iconTypeList={series.iconTypeList}
									pictList={series.pictList}
								/>
							</div>
							{series.cadTypeList.length > 0 && (
								<dl className={styles.cadLinkList}>
									<dt>
										{t(
											'components.domain.category.seriesList.seriesTile.cadLabel'
										)}
									</dt>
									{series.cadTypeList.map((cadType, index) => (
										<dd key={index}>
											{index > 0 && (
												<span className={styles.cadLinkSeparator}>/</span>
											)}
											<Link
												className={styles.cadType}
												href={linkUrlForCadType(cadType.cadType)}
												target="_blank"
												onClick={event => event.stopPropagation()}
											>
												{cadType.cadTypeDisp}
											</Link>
										</dd>
									))}
								</dl>
							)}
						</div>
					</div>
				</div>
				<div className={styles.aside}>
					<PriceLeadTime
						series={series}
						currencyCode={currencyCode}
						photoView
					/>
				</div>
			</div>
		</li>
	);
};
PhotoItem.displayName = 'PhotoItem';
