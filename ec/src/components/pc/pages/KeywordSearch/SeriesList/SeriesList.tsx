import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SeriesFilterPanel } from './SeriesFilterPanel';
import { useDisplayType } from './SeriesList.hooks';
import styles from './SeriesList.module.scss';
import { SeriesListControl } from './SeriesListControl';
import { Section } from '@/components/pc/pages/KeywordSearch/Section';
import { SeriesTile } from '@/components/pc/pages/KeywordSearch/SeriesList/SeriesTile';
import {
	DisplayTypeSwitch,
	Option,
} from '@/components/pc/ui/controls/select/DisplayTypeSwitch';
import { Pagination } from '@/components/pc/ui/paginations';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

type Props = {
	keyword: string;
	page: number;
	pageSize: number;
	seriesResponse: SearchSeriesResponse$search;
	brandIndexList: Brand[];
	defaultExpanded: boolean;
	onChange: (specs: Partial<SearchSeriesRequest>, isClear?: boolean) => void;
	clearAll: () => void;
	className?: string;
	isReSearch?: string;
};

export const SeriesList: React.VFC<Props> = ({
	keyword,
	page,
	pageSize,
	seriesResponse,
	brandIndexList,
	defaultExpanded,
	onChange,
	clearAll,
	className,
	isReSearch,
}) => {
	const { t } = useTranslation();

	const [displayType, setDisplayType] = useDisplayType();
	// TODO: initial state decide other section result
	const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

	const {
		totalCount,
		seriesList,
		currencyCode,
		cadTypeList,
		categoryList,
		daysToShipList,
		brandList,
		cValue,
	} = seriesResponse;

	return (
		<Section
			id="seriesList"
			className={className}
			title={t('pages.keywordSearch.seriesList.heading', { totalCount })}
			enableSticky
			defaultExpanded={expanded}
			onChange={setExpanded}
			aside={
				<DisplayTypeSwitch
					value={displayType}
					options={[Option.LIST, Option.PHOTO]}
					onChange={setDisplayType}
				/>
			}
		>
			<div className={styles.specAndSeriesList}>
				<div className={styles.seriesFilterPanel}>
					<SeriesFilterPanel
						cadTypeList={cadTypeList}
						categoryList={categoryList}
						daysToShipList={daysToShipList}
						brandList={brandList}
						brandIndexList={brandIndexList}
						cValue={cValue}
						onClearFilter={clearAll}
						onChange={onChange}
					/>
				</div>
				<div className={styles.seriesList}>
					<SeriesListControl
						pageSize={pageSize}
						page={page}
						totalCount={totalCount}
						onChangePageSize={pageSize => onChange({ pageSize })}
						onChangePage={page => onChange({ page })}
					/>
					<ul
						className={classNames({
							[String(styles.horizontalList)]: displayType === Option.PHOTO,
						})}
					>
						{seriesList.map((series, index) => (
							<SeriesTile
								index={index}
								displayType={displayType}
								key={series.seriesCode}
								series={series}
								currencyCode={currencyCode}
								keyword={keyword}
								isReSearch={isReSearch}
							/>
						))}
					</ul>
					<div className={styles.resultFooter}>
						<Pagination
							page={page}
							pageSize={pageSize}
							totalCount={totalCount}
							onChange={page => onChange({ page })}
						/>
					</div>
				</div>
			</div>
		</Section>
	);
};
