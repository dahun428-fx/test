import { VFC } from 'react';
import styles from './ListView.module.scss';
import { ListViewItem } from './ListViewItem';
import { OverlayLoader } from '@/components/mobile/ui/loaders';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import type { SharedOptionalQuery } from '@/pages/vona2/detail/[seriesCode].types';

type Props = {
	seriesList: Series[];
	currencyCode?: string;
	query: SharedOptionalQuery;
	loading: boolean;
};

export const ListView: VFC<Props> = ({
	seriesList,
	currencyCode,
	query,
	loading,
}) => {
	return (
		<ul className={styles.listContainer}>
			{seriesList.map(series => (
				<ListViewItem
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
ListView.displayName = 'ListView';
