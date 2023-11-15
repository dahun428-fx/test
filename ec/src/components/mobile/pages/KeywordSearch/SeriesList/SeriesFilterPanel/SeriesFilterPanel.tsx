import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import React, { useCallback, useRef } from 'react';
import { SpecCode, SpecValues } from './types';
import { BaseFilterPanel } from '@/components/mobile/domain/specs/series/BaseFilterPanel';
import { BrandListSpec } from '@/components/mobile/domain/specs/series/BrandListSpec';
import { CadListSpec } from '@/components/mobile/domain/specs/series/CadListSpec/CadListSpec';
import { CategoryListSpec } from '@/components/mobile/domain/specs/series/CategoryListSpec/CategoryListSpec';
import { DaysToShipListSpec } from '@/components/mobile/domain/specs/series/DaysToShipListSpec/DaysToShipListSpec';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
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
	totalCount: number;
	categoryList: Category[];
	daysToShipList: DaysToShip[];
	cadTypeList: CadType[];
	brandList: SeriesBrand[];
	brandIndexList: Brand[];
	cValue: CValue;
	showsSpecFilter: boolean;
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
	onClearFilter: () => void;
	onClose: () => void;
};

/**
 * Series filter panel
 */
export const SeriesFilterPanel: React.VFC<Props> = ({
	daysToShipList,
	totalCount,
	categoryList,
	brandList,
	cadTypeList,
	cValue,
	onChange,
	onClearFilter,
	onClose,
}) => {
	const panelRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => {
		onClose();
	}, [onClose]);

	useOnMounted(() => {
		if (panelRef.current) {
			disableBodyScroll(panelRef.current, { allowTouchMove: () => true });
			return () => clearAllBodyScrollLocks();
		}
	});

	return (
		<div ref={panelRef}>
			<BaseFilterPanel
				totalCount={totalCount}
				onClear={onClearFilter}
				onConfirm={handleClose}
				onClose={handleClose}
			>
				{categoryList.some(notHidden) && (
					<CategoryListSpec categoryList={categoryList} onChange={onChange} />
				)}
				{brandList.some(notHidden) && (
					<BrandListSpec
						brandList={brandList}
						onChange={onChange}
						cValue={cValue}
					/>
				)}
				{cadTypeList.some(notHidden) && (
					<CadListSpec cadTypeList={cadTypeList} onChange={onChange} />
				)}
				{daysToShipList.some(notHidden) && (
					<DaysToShipListSpec
						daysToShipListSpec={daysToShipList}
						onChange={onChange}
					/>
				)}
			</BaseFilterPanel>
		</div>
	);
};
SeriesFilterPanel.displayName = 'SeriesFilterPanel';
