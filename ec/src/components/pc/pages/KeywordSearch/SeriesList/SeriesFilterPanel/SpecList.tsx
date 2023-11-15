import React, { forwardRef } from 'react';
import styles from './SpecList.module.scss';
import {
	SpecCode,
	SpecValues,
} from '@/components/pc/pages/KeywordSearch/SeriesList/SeriesFilterPanel/types';
import { BrandListSpec } from '@/components/pc/ui/specs/BrandListSpec';
import { CadTypeListSpec } from '@/components/pc/ui/specs/CadTypeListSpec';
import { CategoryListSpec } from '@/components/pc/ui/specs/CategoryListSpec';
import { DaysToShipListSpec } from '@/components/pc/ui/specs/DaysToShipListSpec';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	Category,
	CadType,
	DaysToShip,
	Brand as SeriesBrand,
	CValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden } from '@/utils/domain/spec';

type Props = {
	categoryList: Category[];
	daysToShipList: DaysToShip[];
	cadTypeList: CadType[];
	brandList: SeriesBrand[];
	brandIndexList: Brand[];
	cValue: CValue;
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
	className?: string;
};

export const SpecList = forwardRef<HTMLUListElement, Props>(
	(
		{
			categoryList,
			daysToShipList,
			cadTypeList,
			brandList,
			brandIndexList,
			cValue,
			onChange,
			className,
		},
		ref
	) => {
		return (
			<ul ref={ref} className={className}>
				{categoryList.some(notHidden) && (
					<li className={styles.specItem}>
						<CategoryListSpec categoryList={categoryList} onChange={onChange} />
					</li>
				)}

				{daysToShipList.some(notHidden) && (
					<li className={styles.specItem}>
						<DaysToShipListSpec
							daysToShipList={daysToShipList}
							onChange={onChange}
						/>
					</li>
				)}

				{brandList.some(notHidden) && (
					<li className={styles.specItem}>
						<BrandListSpec
							isSearchResult
							brandList={brandList}
							brandIndexList={brandIndexList}
							cValue={cValue}
							onChange={onChange}
						/>
					</li>
				)}

				{cadTypeList.some(notHidden) && (
					<li className={styles.specItem}>
						<CadTypeListSpec cadTypeList={cadTypeList} onChange={onChange} />
					</li>
				)}
			</ul>
		);
	}
);
SpecList.displayName = 'SpecList';
