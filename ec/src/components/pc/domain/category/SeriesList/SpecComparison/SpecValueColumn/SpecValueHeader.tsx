import NextLink from 'next/link';
import { useMemo, VFC } from 'react';
import styles from './SpecValueHeader.module.scss';
import { SeriesLabels } from '@/components/pc/domain/category/SeriesList/SeriesLabels';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { first } from '@/utils/collection';

type Props = {
	series: Series;
	seriesUrl: string;
	onClick: (seriesCode: string) => void;
};

/** Spec value header */
export const SpecValueHeader: VFC<Props> = ({ series, seriesUrl, onClick }) => {
	const firstImage = useMemo(() => {
		if (series.productImageList.length === 0) {
			return { url: '', comment: '' };
		}

		const imageUrl = first(series.productImageList);
		const imageComment = first(series.productImageList);

		return {
			url: imageUrl?.url ?? '',
			comment: imageComment?.comment ?? '',
		};
	}, [series.productImageList]);

	return (
		<>
			<SeriesLabels
				recommendFlag={series.recommendFlag}
				gradeTypeDisp={series.gradeTypeDisp}
				campaignEndDate={series.campaignEndDate}
				iconTypeList={series.iconTypeList}
				pictList={series.pictList}
			/>
			<NextLink href={seriesUrl}>
				<a
					target="_blank"
					className={styles.imageLink}
					onClick={event => {
						event.preventDefault();
						onClick(series.seriesCode);
					}}
				>
					<ProductImage
						imageUrl={firstImage.url}
						comment={firstImage.comment}
						preset="t_product_view_c"
						size={100}
					/>
				</a>
			</NextLink>
		</>
	);
};
SpecValueHeader.displayName = 'SpecValueHeader';
