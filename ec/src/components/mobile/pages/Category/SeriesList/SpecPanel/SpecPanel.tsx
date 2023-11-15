import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import { useRef } from 'react';
import { SpecList } from './SpecList';
import { BaseFilterPanel } from '@/components/mobile/domain/specs/series/BaseFilterPanel';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	Brand,
	CValue,
	DaysToShip,
	SeriesSpec,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

type Props = {
	specList: SeriesSpec[];
	daysToShipList: DaysToShip[];
	totalCount: number;
	brandList: Brand[];
	cValue?: CValue;
	onChange: (payload: ChangePayload) => void;
	onClose: () => void;
	onClear: () => void;
};

export const SpecPanel: React.VFC<Props> = ({
	specList,
	daysToShipList,
	totalCount,
	brandList,
	cValue,
	onChange,
	onClose,
	onClear,
}) => {
	const panelRef = useRef<HTMLDivElement>(null);

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
				onClear={onClear}
				onConfirm={onClose}
				onClose={onClose}
			>
				<SpecList
					specList={specList}
					brandList={brandList}
					cValue={cValue}
					daysToShipList={daysToShipList}
					onChange={onChange}
				/>
			</BaseFilterPanel>
		</div>
	);
};
SpecPanel.displayName = 'SpecPanel';
