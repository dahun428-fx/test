import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SeriesFilterPanel.module.scss';
import { SpecList } from './SpecList';
import { SpecCode, SpecValues } from './types';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	Category,
	CadType,
	DaysToShip,
	Brand as SeriesBrand,
	CValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getHeight } from '@/utils/dom';

type Props = {
	categoryList: Category[];
	daysToShipList: DaysToShip[];
	cadTypeList: CadType[];
	brandList: SeriesBrand[];
	brandIndexList: Brand[];
	cValue: CValue;
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
	onClearFilter: () => void;
};

/**
 * Series filter panel
 */
export const SeriesFilterPanel: React.VFC<Props> = ({
	categoryList,
	daysToShipList,
	cadTypeList,
	brandList,
	brandIndexList,
	cValue,
	onChange,
	onClearFilter,
}) => {
	const { t } = useTranslation();
	const specListRef = useRef<HTMLUListElement>(null);

	const headerBoxRef = useRef<HTMLDivElement>(null);

	const headerBoxHeight = getHeight(headerBoxRef) ?? 0;
	const headingHeight = getHeight('#seriesListHeading') ?? 0;

	return (
		<div className={styles.sticky} style={{ top: headingHeight }}>
			<div className={styles.container}>
				<div className={styles.headerBox} ref={headerBoxRef}>
					<h2 className={styles.filterHeading}>
						{t('pages.keywordSearch.seriesList.seriesFilterPanel.configure')}
					</h2>
					<button className={styles.clearAll} onClick={onClearFilter}>
						{t('pages.keywordSearch.seriesList.seriesFilterPanel.clearAll')}
					</button>
				</div>
				<div
					className={styles.panel}
					id="specPanel"
					style={{
						height: `${window.innerHeight - headerBoxHeight - headingHeight}px`,
					}}
				>
					<SpecList
						ref={specListRef}
						className={styles.specList}
						categoryList={categoryList}
						daysToShipList={daysToShipList}
						cadTypeList={cadTypeList}
						brandList={brandList}
						brandIndexList={brandIndexList}
						cValue={cValue}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};
SeriesFilterPanel.displayName = 'SeriesFilterPanel';
