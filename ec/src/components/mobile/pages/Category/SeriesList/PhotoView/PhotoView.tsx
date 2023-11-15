import { VFC } from 'react';
import styles from './PhotoView.module.scss';
import { PhotoViewItem } from './PhotoViewItem';
import { OverlayLoader } from '@/components/mobile/ui/loaders';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { SharedOptionalQuery } from '@/pages/vona2/detail/[seriesCode].types';

type Props = {
	seriesList: Series[];
	currencyCode?: string;
	query: SharedOptionalQuery;
	loading: boolean;
};

export const PhotoView: VFC<Props> = ({
	seriesList,
	currencyCode,
	query,
	loading,
}) => {
	return (
		<ul className={styles.listContainer}>
			{seriesList.map(series => (
				<PhotoViewItem
					key={series.seriesCode}
					series={series}
					currencyCode={currencyCode}
					query={query}
				/>
			))}
			{loading && <OverlayLoader />}
		</ul>
	);
};
PhotoView.displayName = 'PhotoView';
