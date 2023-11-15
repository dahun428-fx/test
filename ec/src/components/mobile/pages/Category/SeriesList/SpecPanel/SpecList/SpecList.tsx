import React, { forwardRef, useMemo } from 'react';
import styles from './SpecList.module.scss';
import { ImageListSpec } from '@/components/mobile/domain/specs/ImageListSpec';
import { NumericSpec } from '@/components/mobile/domain/specs/NumericSpec';
import { TextListSpec } from '@/components/mobile/domain/specs/TextListSpec';
import { TreeSpec } from '@/components/mobile/domain/specs/TreeSpec';
import { BrandListSpec } from '@/components/mobile/domain/specs/series/BrandListSpec';
import { DaysToShipListSpec } from '@/components/mobile/domain/specs/series/DaysToShipListSpec/DaysToShipListSpec';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import {
	Brand,
	CValue,
	DaysToShip,
	SeriesSpec,
	SpecViewType,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { hidden, notHidden } from '@/utils/domain/spec';
import { isSpecHidden } from '@/utils/spec';

type Props = {
	specList: SeriesSpec[];
	brandList: Brand[];
	cValue?: CValue;
	daysToShipList: DaysToShip[];
	onChange: (payload: ChangePayload) => void;
	className?: string;
};

export const SpecList = forwardRef<HTMLUListElement, Props>(
	(
		{ specList, brandList, cValue, daysToShipList, onChange, className },
		ref
	) => {
		const sortedSpecList = useMemo(
			() =>
				specList
					.filter(spec => !isSpecHidden(spec))
					// 中央表示のスペックを一番上に表示させる
					.sort(
						(a, b) =>
							(a.specViewType === SpecViewType.CENTER ? -1 : 0) +
							(b.specViewType === SpecViewType.CENTER ? 1 : 0)
					),
			[specList]
		);

		return (
			<ul ref={ref} className={className}>
				{!!brandList.length && cValue && (
					<BrandListSpec
						brandList={brandList}
						cValue={cValue}
						onChange={args => onChange({ selectedSpecs: args })}
					/>
				)}
				{sortedSpecList.map(spec => {
					switch (spec.specViewType) {
						case SpecViewType.TEXT_BUTTON:
						case SpecViewType.TEXT_SINGLE_LINE:
						case SpecViewType.TEXT_DOUBLE_LINE:
						case SpecViewType.TEXT_TRIPLE_LINE:
						case SpecViewType.LIST:
						case SpecViewType.AGGREGATION:
							return (
								<li className={styles.item} key={spec.specCode}>
									<TextListSpec spec={spec} onChange={onChange} />
								</li>
							);
						case SpecViewType.IMAGE_SINGLE_LINE:
						case SpecViewType.IMAGE_DOUBLE_LINE:
						case SpecViewType.IMAGE_TRIPLE_LINE:
						case SpecViewType.CENTER:
							return (
								<li className={styles.item} key={spec.specCode}>
									<ImageListSpec spec={spec} onChange={onChange} />
								</li>
							);
						case SpecViewType.NUMERIC:
							return spec.numericSpec == null ||
								hidden(spec.numericSpec) ? null : (
								<li className={styles.item} key={spec.specCode}>
									<NumericSpec spec={spec} onChange={onChange} />
								</li>
							);
						case SpecViewType.TREE:
							return (
								<li className={styles.item} key={spec.specCode}>
									<TreeSpec spec={spec} onChange={onChange} />
								</li>
							);
						default:
							return null;
					}
				})}
				{daysToShipList.some(notHidden) && (
					<DaysToShipListSpec
						daysToShipListSpec={daysToShipList}
						onChange={spec => onChange({ selectedSpecs: spec })}
					/>
				)}
			</ul>
		);
	}
);
SpecList.displayName = 'SpecList';
