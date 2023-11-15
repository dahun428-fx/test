import { useTranslation } from 'react-i18next';
import styles from './SeriesListControl.module.scss';
import { Select } from '@/components/pc/ui/controls/select';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { Pagination } from '@/components/pc/ui/paginations';

const pageSizes = [30, 45, 60] as const;

export type Props = {
	pageSize: number;
	page: number;
	totalCount: number;
	onChangePageSize: (pageSize: number) => void;
	onChangePage: (page: number) => void;
};

/**
 * 表示件数の選択
 */
export const SeriesListControl: React.VFC<Props> = ({
	pageSize,
	page,
	totalCount,
	onChangePageSize,
	onChangePage,
}) => {
	const [t] = useTranslation();

	const options: Option[] = pageSizes.map(count => ({
		value: `${count}`,
		label: t('pages.keywordSearch.seriesList.seriesListControl.count', {
			count,
		}),
	}));

	return (
		<div className={styles.seriesListControl}>
			<div className={styles.pageSize}>
				<span className={styles.text}>{`${t(
					'pages.keywordSearch.seriesList.seriesListControl.displayCount'
				)}:`}</span>
				<Select
					value={`${pageSize}`}
					items={options}
					onChange={option => onChangePageSize(Number(option.value))}
				/>
			</div>
			<div>
				<Pagination
					page={page}
					pageSize={pageSize}
					totalCount={totalCount}
					onChange={onChangePage}
				/>
			</div>
		</div>
	);
};
SeriesListControl.displayName = 'SeriesListControl';
