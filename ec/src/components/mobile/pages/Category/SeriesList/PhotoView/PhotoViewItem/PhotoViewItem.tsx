import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PhotoViewItem.module.scss';
import { PriceLeadTime } from '@/components/mobile/domain/series/PriceLeadTime';
import { SaleBadge } from '@/components/mobile/domain/series/SaleBadge';
import { SaleLabel } from '@/components/mobile/domain/series/SaleLabel';
import { SeriesDiscount } from '@/components/mobile/domain/series/SeriesDiscount';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { EconomyLabel, Label } from '@/components/mobile/ui/labels';
import { Link } from '@/components/mobile/ui/links/Link';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import type { SharedOptionalQuery } from '@/pages/vona2/detail/[seriesCode].types';
import { pagesPath } from '@/utils/$path';
import { getSeriesNameDisp } from '@/utils/domain/series';

type Props = {
	series: Series;
	currencyCode?: string;
	query: SharedOptionalQuery;
};

export const PhotoViewItem: VFC<Props> = ({ series, currencyCode, query }) => {
	const { t } = useTranslation();

	const url = useMemo(() => {
		return pagesPath.vona2.detail
			._seriesCode(series.seriesCode)
			.$url({ query });
	}, [query, series.seriesCode]);

	const firstImage = useMemo(() => {
		if (!series.productImageList[0]) {
			return;
		}
		return {
			url: series.productImageList[0].url,
			comment: series.productImageList[0].comment ?? '',
		};
	}, [series.productImageList]);

	const handleClick = () => {
		ga.ecommerce.selectItem({
			seriesCode: series.seriesCode,
			itemListName: ItemListName.PAGE_CATEGORY,
		});
	};

	return (
		<li className={styles.item}>
			<div className={styles.labelIconList}>
				{Flag.isTrue(series.recommendFlag) && (
					<Label theme="grade">
						{t('mobile.pages.category.seriesList.recommendation')}
					</Label>
				)}
			</div>
			<div className={styles.panelIconList}>
				{Flag.isTrue(series.cValueFlag) && (
					<EconomyLabel
						width={69}
						height={28}
						className={styles.economyLabel}
						backgroundSize="auto"
					/>
				)}
				<SeriesDiscount pictList={series.pictList} />
			</div>
			<div className={styles.imageWrapper}>
				<Link href={url} newTab onClick={handleClick}>
					<ProductImage
						imageUrl={firstImage?.url}
						comment={firstImage?.comment}
						preset="t_product_view_b"
						size={120}
					/>
				</Link>
				<div className={styles.imageBottomIconList}>
					{!!series.campaignEndDate && (
						<SaleLabel
							className={styles.campaignDate}
							date={series.campaignEndDate}
						/>
					)}
					{series.campaignEndDate && <SaleBadge />}
				</div>
			</div>
			<div className={styles.seriesNameWrapper}>
				<Link href={url} newTab className={styles.link} onClick={handleClick}>
					<p
						className={styles.seriesName}
						dangerouslySetInnerHTML={{
							__html: getSeriesNameDisp(series, t),
						}}
					/>
				</Link>
				<p className={styles.brandName}>{series.brandName}</p>
			</div>
			<PriceLeadTime series={series} currencyCode={currencyCode} />
		</li>
	);
};
PhotoViewItem.displayName = 'PhotoViewItem';
