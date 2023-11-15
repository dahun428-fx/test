import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SeriesListControl.module.scss';
import { addLog } from '@/api/services/addLog';
import { Select, type Option } from '@/components/pc/ui/controls/select';
import { Pagination } from '@/components/pc/ui/paginations';
import { config } from '@/config';
import { Flag } from '@/models/api/Flag';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { DaysToShip } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { SeriesSortType } from '@/models/pages/category';
import { isNumericString } from '@/utils/domain/spec';

export type Props = {
	categoryCode: string;
	pageSize: number;
	page: number;
	sortType: string;
	totalCount: number;
	daysToShip?: number;
	daysToShipList: DaysToShip[];
	isShowDaysToShipSelect: boolean;
	onChangePageSize: (pageSize: number) => void;
	onChangePage: (page: number) => void;
	onChangeDaysToShip: (daysToShip?: number) => void;
	onChangeSortType: (sortType: string) => void;
};

/** SeriesListControl component */
export const SeriesListControl: React.VFC<Props> = ({
	categoryCode,
	pageSize,
	page,
	sortType,
	daysToShip,
	totalCount,
	daysToShipList,
	isShowDaysToShipSelect,
	onChangePageSize,
	onChangePage,
	onChangeDaysToShip,
	onChangeSortType,
}) => {
	const [t] = useTranslation();

	const pageSizeListOptions: Option[] = config.pagination.series.sizeList.map(
		count => ({
			value: String(count),
			label: t('components.domain.category.seriesListControl.count', {
				count,
			}),
		})
	);

	const sortTypeOptions: Option[] = [
		{
			value: SeriesSortType.POPULARITY,
			label: t(
				'components.domain.category.seriesListControl.sortOptionLabel.popularity'
			),
		},
		{
			value: SeriesSortType.DAYS_TO_SHIP,
			label: t(
				'components.domain.category.seriesListControl.sortOptionLabel.daysToShip'
			),
		},
		{
			value: SeriesSortType.PRICE,
			label: t(
				'components.domain.category.seriesListControl.sortOptionLabel.price'
			),
		},
	];

	const daysToShipListOptions = useMemo(() => {
		const options = daysToShipList
			.filter(option => Flag.isFalse(option.hiddenFlag))
			.map(option => ({
				value: String(option.daysToShip),
				label: t('components.domain.category.seriesListControl.daysToShip', {
					count: option.daysToShip,
				}),
			}));

		return [
			{
				value: 'all',
				label: t('components.domain.category.seriesListControl.all'),
			},
			...options,
		];
	}, [daysToShipList, t]);

	const handleChangeDaysToShip = (daysToShip: string) => {
		let parameterValue;
		if (isNumericString(daysToShip)) {
			onChangeDaysToShip(Number(daysToShip));
			parameterValue = t(
				'components.domain.category.seriesListControl.daysToShip',
				{
					count: Number(daysToShip),
				}
			);
		}

		if (daysToShip === 'all') {
			parameterValue = t('components.domain.category.seriesListControl.all');
			onChangeDaysToShip();
		}

		addLog(LogType.SPEC, {
			categoryCode,
			select: 'ON',
			parameterName: 'Days to Ship',
			parameterValue,
		});
	};

	if (!totalCount) {
		return null;
	}

	return (
		<div className={styles.seriesListControl}>
			<div className={styles.controlList}>
				<div className={styles.itemList}>
					<span className={styles.text}>
						{t('components.domain.category.seriesListControl.displayCount')}
					</span>
					<Select
						value={String(pageSize)}
						items={pageSizeListOptions}
						onChange={option => onChangePageSize(Number(option.value))}
					/>
					<span className={styles.text}>
						{t('components.domain.category.seriesListControl.sortBy')}
					</span>
					<Select
						value={sortType}
						items={sortTypeOptions}
						onChange={option => onChangeSortType(option.value)}
					/>
				</div>
				{isShowDaysToShipSelect && (
					<div className={styles.itemList}>
						<span className={styles.text}>
							{t(
								'components.domain.category.seriesListControl.daysToShipLabel'
							)}
						</span>
						<Select
							value={daysToShip ? String(daysToShip) : 'all'}
							items={daysToShipListOptions}
							onChange={option => handleChangeDaysToShip(option.value)}
						/>
					</div>
				)}
			</div>

			<Pagination
				page={page}
				pageSize={pageSize}
				totalCount={totalCount}
				queryParamKeys={['CategorySpec', 'DispMethod']}
				onChange={onChangePage}
			/>
		</div>
	);
};
SeriesListControl.displayName = 'SeriesListControl';
