import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';
import { SeriesFilterPanel } from './SeriesFilterPanel';
import styles from './SeriesList.module.scss';
import { SeriesTile } from './SeriesTile';
import { Option } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { Pagination } from '@/components/mobile/ui/paginations';
import { useInfiniteScroll } from '@/hooks/utils/useInfiniteScroll';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

type Props = {
	seriesResponse: SearchSeriesResponse$search;
	keyword: string;
	displayType: Option;
	page?: number;
	pageSize: number;
	onChange: (specs: Partial<SearchSeriesRequest>, isClear?: boolean) => void;
	isReSearch?: string;
};

/**
 * Series list
 */
export const SeriesList: React.VFC<Props> = ({
	seriesResponse,
	keyword,
	displayType,
	page,
	pageSize,
	onChange,
	isReSearch,
}) => {
	const disabledInfinityScroll = useRef(false);
	const { currencyCode } = seriesResponse;
	const { listItems: seriesList, listRef } = useInfiniteScroll({
		data: seriesResponse?.seriesList ?? [],
		disabled: disabledInfinityScroll.current,
	});

	const handleChange = useCallback(
		(page: number) => {
			onChange({ page });
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
			disabledInfinityScroll.current = true;
		},
		[onChange]
	);

	return (
		<>
			<SeriesFilterPanel keyword={keyword} onChange={onChange} />
			<ul
				ref={listRef}
				className={classNames(styles.seriesList, {
					[String(styles.horizontalList)]: displayType === Option.PHOTO,
				})}
			>
				{seriesList.map((series, index) => (
					<SeriesTile
						key={index}
						index={index}
						isReSearch={isReSearch}
						series={series}
						currencyCode={currencyCode}
						displayType={displayType}
						keyword={keyword}
					/>
				))}
			</ul>
			<div className={styles.pagination}>
				<Pagination
					page={page ?? 1}
					onChange={handleChange}
					pageSize={pageSize}
					totalCount={seriesResponse.totalCount}
				/>
			</div>
		</>
	);
};
SeriesList.displayName = 'SeriesList';
